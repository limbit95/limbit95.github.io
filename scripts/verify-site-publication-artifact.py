"""Verify the uploaded Pages ZIP/tar without extracting it; never deploy anything."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import tarfile
import tempfile
import zipfile


def require(condition, message):
    if not condition:
        raise ValueError(message)


def safe_path(name, directory=False):
    require(isinstance(name, str), "Non-string path")
    if directory and name in (".", "./"):
        return ""
    if name.startswith("./"):
        name = name[2:]
    if directory:
        name = name.removesuffix("/")
    require(name and not any(c in name for c in ("\\", "%", ":", "\0")), "Unsafe path")
    require(all(p not in ("", ".", "..") for p in name.split("/")), "Unsafe path")
    return name


def verify_package(filename, manifest, policy_bytes, revision):
    policy = json.loads(policy_bytes)
    require(manifest.get("schemaVersion") == 1 and policy.get("schemaVersion") == 1, "Invalid schema")
    require(manifest.get("sourceRevision") == revision, "Checkout revision mismatch")
    require(manifest.get("policySha256") == hashlib.sha256(policy_bytes).hexdigest(), "Policy digest mismatch")
    expected = {}
    for item in manifest["files"]:
        name = safe_path(item["path"])
        require(name == item["path"] == item["source"] and name not in expected, "Invalid provenance/duplicate")
        require(type(item["size"]) is int and item["size"] >= 0, "Invalid size")
        require(re.fullmatch(r"[0-9a-f]{64}", item["sha256"]), "Invalid hash")
        expected[name] = item
    require(expected and len(policy["files"]) == len(expected) and set(policy["files"]) == set(expected), "Policy inventory mismatch")
    directories = {""}
    for name in expected:
        parts = name.split("/")
        directories.update("/".join(parts[:i]) for i in range(1, len(parts)))
    with zipfile.ZipFile(filename) as wrapper:
        entries = wrapper.infolist()
        require(len(entries) == 1 and entries[0].filename == "artifact.tar", "Unexpected ZIP inventory")
        entry = entries[0]
        require(not entry.is_dir() and not entry.flag_bits & 1, "Invalid ZIP member")
        # Bound the package before reading. This is a supported-format limit, not a size certificate.
        require(1024 <= entry.file_size <= 1024 * 1024 * 1024, "Unsupported tar size")
        with wrapper.open(entry) as payload:
            with tarfile.open(fileobj=payload, mode="r:") as archive:
                seen = set()
                seen_dirs = set()
                end = 0
                for member in archive:
                    require(member.offset == end, "Unexpected tar metadata")
                    payload.seek(member.offset)
                    header = payload.read(512)
                    raw_type = header[156:157]
                    require(raw_type in (b"0", b"\0", b"5") and not member.pax_headers, "Unsupported tar metadata/type")
                    require(not member.linkname and not member.sparse, "Link/sparse member forbidden")
                    # tarfile strips directory slashes, turning '/' into ''.
                    # Validate the original name and combined prefix/name before
                    # accepting that lossy parser representation. These supported
                    # types use the same prefix field as TarInfo.frombuf.
                    raw_name = header[:100].split(b"\0", 1)[0].decode(archive.encoding, archive.errors)
                    prefix = header[345:500].split(b"\0", 1)[0].decode(archive.encoding, archive.errors)
                    require(raw_name and not raw_name.startswith("/"), "Unsafe raw tar name")
                    raw_path = f"{prefix}/{raw_name}" if prefix else raw_name
                    name = safe_path(raw_path, member.isdir())
                    require(name == safe_path(member.name, member.isdir()), "Tar path interpretation mismatch")
                    if member.isdir():
                        require(name in directories and name not in seen_dirs and member.size == 0, "Unexpected/duplicate directory")
                        seen_dirs.add(name)
                    else:
                        require(member.isreg() and name in expected and name not in seen, "Unexpected/duplicate file")
                        item = expected[name]
                        require(member.size == item["size"], "File size mismatch")
                        stream = archive.extractfile(member)
                        digest = hashlib.file_digest(stream, "sha256").hexdigest()
                        require(digest == item["sha256"], "File hash mismatch")
                        seen.add(name)
                    end = member.offset_data + ((member.size + 511) // 512) * 512
                require(seen == set(expected), "Missing public file")
                payload.seek(end)
                remaining = entry.file_size - end
                require(remaining >= 1024 and remaining % 512 == 0, "Invalid tar ending")
                while chunk := payload.read(65536):
                    require(not any(chunk), "Trailing tar content")
    return len(expected)


def verify_identity(run, artifacts, artifact_id, repository, revision, run_id, attempt):
    require(run["id"] == run_id and run["head_sha"] == revision and run["run_attempt"] == attempt,
            "Run/revision/attempt mismatch")
    require(run["event"] == "workflow_dispatch" and run["head_branch"] == "main", "Not an explicit main dispatch")
    require(run["repository"]["full_name"] == repository, "Repository mismatch")
    name = f"github-pages-{run_id}-{attempt}"
    matches = [a for a in artifacts if a["name"] == name]
    require(len(matches) == 1, "Missing/ambiguous Pages artifact")
    artifact = matches[0]
    require(artifact["id"] == artifact_id and not artifact["expired"], "Artifact ID/expiry mismatch")
    require(artifact["workflow_run"]["id"] == run_id and artifact["workflow_run"]["head_sha"] == revision,
            "Artifact origin mismatch")
    require(re.fullmatch(r"sha256:[0-9a-f]{64}", artifact.get("digest", "")), "Missing artifact digest")
    return artifact


def api(endpoint, paginate=False):
    command = ["gh", "api", endpoint]
    if paginate:
        command += ["--paginate", "--slurp"]
    return json.loads(subprocess.check_output(command, text=True))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--identity-only", action="store_true")
    parser.add_argument("--manifest", default=".site-publication/manifest.json")
    parser.add_argument("--policy", default="scripts/site-publication-files.json")
    args = parser.parse_args()
    repository = os.environ["GITHUB_REPOSITORY"]
    revision = os.environ["GITHUB_SHA"]
    run_id, attempt = int(os.environ["GITHUB_RUN_ID"]), int(os.environ["GITHUB_RUN_ATTEMPT"])
    artifact_id = int(os.environ["PAGES_ARTIFACT_ID"])
    require(re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+", repository), "Invalid repository")
    require(re.fullmatch(r"[0-9a-f]{40}", revision), "Invalid revision")
    require(min(run_id, attempt, artifact_id) > 0, "Invalid identity")
    require(subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip() == revision, "Checkout mismatch")
    prefix = f"repos/{repository}"
    def identity():
        run = api(f"{prefix}/actions/runs/{run_id}")
        pages = api(f"{prefix}/actions/runs/{run_id}/artifacts?per_page=100", paginate=True)
        return verify_identity(run, [a for p in pages for a in p["artifacts"]], artifact_id,
                               repository, revision, run_id, attempt)
    artifact = identity()
    if args.identity_only:
        require(artifact["digest"] == os.environ["PAGES_ARTIFACT_DIGEST"], "Artifact changed since verification")
    else:
        manifest = json.loads(Path(args.manifest).read_text())
        with tempfile.TemporaryDirectory(prefix="pages-verify-") as directory:
            filename = Path(directory) / "pages.zip"
            with filename.open("wb") as output:
                subprocess.run(["gh", "api", f"{prefix}/actions/artifacts/{artifact_id}/zip"], stdout=output, check=True)
            with filename.open("rb") as source:
                digest = "sha256:" + hashlib.file_digest(source, "sha256").hexdigest()
            require(digest == artifact["digest"], "Downloaded artifact digest mismatch")
            count = verify_package(filename, manifest, Path(args.policy).read_bytes(), revision)
        require(identity() == artifact, "Artifact metadata changed during verification")
        report = {"repository": repository, "revision": revision, "runId": run_id, "runAttempt": attempt,
                  "artifactId": artifact_id, "artifactName": artifact["name"], "artifactDigest": artifact["digest"],
                  "files": count, "policySha256": manifest["policySha256"], "deployment": "NOT_RUN"}
        Path(".site-publication/artifact-verification.json").write_text(json.dumps(report, indent=2) + "\n")
        with open(os.environ["GITHUB_OUTPUT"], "a") as output:
            output.write(f'digest={artifact["digest"]}\n')
    print(f'Verified Pages artifact identity {artifact_id}; not a deployment or P1 certificate.')


if __name__ == "__main__":
    main()
