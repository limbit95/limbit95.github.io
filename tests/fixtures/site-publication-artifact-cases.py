"""Local contract fixtures only: no GitHub requests, uploads or deployments."""
import copy
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import tarfile
import tempfile
import sys
from unittest.mock import patch
import unittest
import zipfile

spec = importlib.util.spec_from_file_location("verifier", Path(__file__).resolve().parents[2] / "scripts/verify-site-publication-artifact.py")
sys.dont_write_bytecode = True
v = importlib.util.module_from_spec(spec)
spec.loader.exec_module(v)
REV = "a" * 40


class PackageTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.filename = Path(self.tmp.name) / "pages.zip"
        self.policy = json.dumps({"schemaVersion": 1, "files": ["index.html", "js/app.js"]}).encode()
        self.files = {"index.html": b"<script src='js/app.js'></script>", "js/app.js": b"export const x=1;"}
        self.manifest = {"schemaVersion": 1, "sourceRevision": REV,
                         "policySha256": hashlib.sha256(self.policy).hexdigest(),
                         "files": [{"path": p, "source": p, "size": len(b), "sha256": hashlib.sha256(b).hexdigest()}
                                   for p, b in self.files.items()]}

    def package(self, change=None, suffix=b"", wrapper_extra=False):
        members = [("./", b"", tarfile.DIRTYPE), ("./js/", b"", tarfile.DIRTYPE)]
        members += [("./" + p, b, tarfile.REGTYPE) for p, b in self.files.items()]
        if change:
            members = change(members)
        data = io.BytesIO()
        with tarfile.open(fileobj=data, mode="w", format=tarfile.USTAR_FORMAT) as archive:
            for name, content, kind in members:
                item = tarfile.TarInfo(name)
                item.type = kind
                item.size = len(content)
                if kind in (tarfile.SYMTYPE, tarfile.LNKTYPE):
                    item.linkname = "index.html"
                archive.addfile(item, io.BytesIO(content))
        with zipfile.ZipFile(self.filename, "w") as wrapper:
            wrapper.writestr("artifact.tar", data.getvalue() + suffix)
            if wrapper_extra:
                wrapper.writestr("extra.txt", "extra")

    def verify(self):
        return v.verify_package(self.filename, self.manifest, self.policy, REV)

    def test_valid_real_zip_tar_and_exact_bytes(self):
        self.package()
        self.assertEqual(self.verify(), 2)
        self.assertEqual(list(Path(self.tmp.name).iterdir()), [self.filename])

    def test_add_missing_duplicate(self):
        for change in (lambda m: m + [("extra.js", b"x", tarfile.REGTYPE)], lambda m: m[:-1], lambda m: m + [m[-1]]):
            with self.subTest(change=change):
                self.package(change)
                with self.assertRaises(ValueError): self.verify()

    def test_size_and_same_size_hash_mismatch(self):
        for value in (b"short", b"export const x=2;"):
            self.package(lambda m: m[:-1] + [(m[-1][0], value, tarfile.REGTYPE)])
            with self.assertRaises(ValueError): self.verify()

    def test_unsafe_paths_and_normalized_duplicates(self):
        for name in ("/index.html", "../index.html", "js/../index.html", "././index.html", "assets/%2e%2e/x", "js\\x", "index.html"):
            with self.subTest(name=name):
                self.package(lambda m: m + [(name, self.files["index.html"], tarfile.REGTYPE)])
                with self.assertRaises(ValueError): self.verify()

    def test_links_devices_fifo(self):
        for kind in (tarfile.SYMTYPE, tarfile.LNKTYPE, tarfile.CHRTYPE, tarfile.BLKTYPE, tarfile.FIFOTYPE):
            with self.subTest(kind=kind):
                self.package(lambda m: m + [("bad", b"", kind)])
                with self.assertRaises(ValueError): self.verify()

    def test_unexpected_directory_and_duplicate_root(self):
        for name in ("./private/", "./"):
            self.package(lambda m: m + [(name, b"", tarfile.DIRTYPE)])
            with self.assertRaises(ValueError): self.verify()

    def test_zip_inventory_and_trailing_tar_content(self):
        self.package(wrapper_extra=True)
        with self.assertRaises(ValueError): self.verify()
        self.package(suffix=b"x" * 512)
        with self.assertRaises(ValueError): self.verify()

    def test_revision_policy_provenance(self):
        original = copy.deepcopy(self.manifest)
        for change in (lambda m: m.update(sourceRevision="b" * 40), lambda m: m.update(policySha256="0" * 64),
                       lambda m: m["files"][0].update(source="services/private.js"), lambda m: m["files"].append(m["files"][0])):
            self.package()
            self.manifest = copy.deepcopy(original)
            change(self.manifest)
            with self.assertRaises(ValueError): self.verify()

    def test_extended_tar_metadata_rejected(self):
        data = io.BytesIO()
        with tarfile.open(fileobj=data, mode="w", format=tarfile.PAX_FORMAT) as archive:
            item = tarfile.TarInfo("index.html")
            item.pax_headers = {"comment": "not in the supported package format"}
            archive.addfile(item, io.BytesIO())
        with zipfile.ZipFile(self.filename, "w") as wrapper: wrapper.writestr("artifact.tar", data.getvalue())
        with self.assertRaises(ValueError): self.verify()


class IdentityTests(unittest.TestCase):
    def setUp(self):
        self.run = {"id": 9, "head_sha": REV, "run_attempt": 2, "event": "workflow_dispatch", "head_branch": "main",
                    "repository": {"full_name": "owner/repo"}}
        self.artifact = {"id": 12, "name": "github-pages-9-2", "expired": False, "digest": "sha256:" + "c" * 64,
                         "workflow_run": {"id": 9, "head_sha": REV}}

    def verify(self, artifacts=None):
        return v.verify_identity(self.run, [self.artifact] if artifacts is None else artifacts, 12, "owner/repo", REV, 9, 2)

    def test_exact_identity(self):
        self.assertEqual(self.verify()["id"], 12)

    def test_wrong_run_revision_attempt_event_branch_repository(self):
        for key, value in (("id", 10), ("head_sha", "b" * 40), ("run_attempt", 3), ("event", "pull_request"),
                           ("head_branch", "feature/test"), ("repository", {"full_name": "other/repo"})):
            with self.subTest(key=key):
                old = self.run[key]; self.run[key] = value
                with self.assertRaises(ValueError): self.verify()
                self.run[key] = old

    def test_cli_identity_recheck_rejects_changed_digest_and_checkout(self):
        env = {"GITHUB_REPOSITORY": "owner/repo", "GITHUB_SHA": REV, "GITHUB_RUN_ID": "9",
               "GITHUB_RUN_ATTEMPT": "2", "PAGES_ARTIFACT_ID": "12", "PAGES_ARTIFACT_DIGEST": "sha256:" + "d" * 64}
        with patch.dict(v.os.environ, env), patch.object(sys, "argv", ["verify", "--identity-only"]), \
                patch.object(v.subprocess, "check_output", return_value=REV + "\n"), \
                patch.object(v, "api", side_effect=[self.run, [{"artifacts": [self.artifact]}]]):
            with self.assertRaisesRegex(ValueError, "changed since verification"):
                v.main()
        with patch.dict(v.os.environ, env), patch.object(sys, "argv", ["verify", "--identity-only"]), \
                patch.object(v.subprocess, "check_output", return_value="b" * 40), patch.object(v, "api") as api:
            with self.assertRaisesRegex(ValueError, "Checkout mismatch"):
                v.main()
            api.assert_not_called()

    def test_missing_ambiguous_replaced_expired_wrong_origin(self):
        for entries in ([], [self.artifact, self.artifact]):
            with self.assertRaises(ValueError): self.verify(entries)
        for key, value in (("id", 13), ("expired", True), ("digest", None), ("name", "github-pages-9-1"),
                           ("workflow_run", {"id": 8, "head_sha": REV}), ("workflow_run", {"id": 9, "head_sha": "b" * 40})):
            with self.subTest(key=key):
                old = self.artifact[key]; self.artifact[key] = value
                with self.assertRaises((ValueError, TypeError)): self.verify()
                self.artifact[key] = old


if __name__ == "__main__":
    unittest.main()
