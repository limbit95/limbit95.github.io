import test from "node:test";
import assert from "node:assert/strict";
import { generateKeyPair, exportJWK, SignJWT } from "jose";
import { createCommandBinder } from "../services/game-platform-vnext/commandBinding.mjs";
import { SESSION_CONTRACT, sessionCommandHash } from "../services/game-platform-vnext/sessionControl.mjs";

const pair = await generateKeyPair("ES256"), other = await generateKeyPair("ES256");
const publicKey = { ...await exportJWK(pair.publicKey), kid: "binding-offline-key", use: "sig", alg: "ES256" };
const subject = "11111111-1111-4111-8111-111111111111";
const authSession = "22222222-2222-4222-8222-222222222222";
const claims = { iss: "https://command-binding-fixture.invalid", aud: "offline-command-binding-vnext",
  sub: subject, session_id: authSession, exp: 2000 };
const config = (clock = () => 1000000) => ({ issuer: claims.iss, audience: claims.aud,
  algorithms: ["ES256"], jwks: { keys: [publicKey] }, clock });
const sign = (key = pair.privateKey) => new SignJWT(claims)
  .setProtectedHeader({ alg: "ES256", typ: "JWT", kid: publicKey.kid }).sign(key);
function command(patch = {}) {
  const value = { contract: SESSION_CONTRACT, id: "command-one", session: "game-session",
    match: "game-match", subject, kind: "set-ready", payload: { ready: true }, ...patch };
  return { ...value, payloadHash: sessionCommandHash(value) };
}
const rejected = (binder, token, input = command(), options) => assert.rejects(binder.bind(token, input, options),
  (error) => error.code.startsWith("COMMAND_BINDING_") && error.message === error.code && !Object.hasOwn(error, "cause"));

test("real signature binds subject and separate Auth/game sessions to an immutable command, not a permit", async () => {
  const input = command(), result = await createCommandBinder(config()).bind(await sign(), input);
  assert.deepEqual(result, { kind: "TOKEN_SUBJECT_BOUND_COMMAND", subject, authSessionId: authSession,
    expiresAtSeconds: 2000, command: input });
  assert.notEqual(result.command, input);
  assert.notEqual(result.command.payload, input.payload);
  assert.ok([result, result.command, result.command.payload].every(Object.isFrozen));
  assert.throws(() => { result.command.payload.ready = false; }, TypeError);
  for (const key of ["allowed", "authorized", "permit", "token", "signature", "key", "state", "owner"]) assert.equal(key in result, false);
  assert.equal(result.command.session, "game-session");
  assert.notEqual(result.command.session, result.authSessionId);
});

test("subject mismatch rejects rather than rewriting the subject", async () => {
  const input = command({ subject: "33333333-3333-4333-8333-333333333333" });
  await assert.rejects(createCommandBinder(config()).bind(await sign(), input), { code: "COMMAND_BINDING_SUBJECT_MISMATCH" });
  assert.equal(input.subject, "33333333-3333-4333-8333-333333333333");
});

test("raw JWT is mandatory: fabricated claims, bound result and wrong signature cannot enter as verified", async () => {
  const binder = createCommandBinder(config()), valid = await sign();
  const copied = JSON.parse(JSON.stringify(await binder.bind(valid, command())));
  for (const token of [undefined, claims, copied, { authorized: true }, await sign(other.privateKey)]) await rejected(binder, token);
  const parts = valid.split("."); parts[1] = Buffer.from(JSON.stringify({ ...claims, exp: 3000 })).toString("base64url");
  await rejected(binder, parts.join("."));
});

test("request mutation during real crypto await cannot replace the command or nested payload", async () => {
  const binder = createCommandBinder(config()), token = await sign(), input = command(), expected = structuredClone(input);
  const pending = binder.bind(token, input);
  input.id = "replaced"; input.subject = "untrusted"; input.session = "replaced"; input.payload.ready = false;
  const result = await pending;
  assert.deepEqual(result.command, expected);
});

test("command ID is retained independently of payload hash and is not replay protection", async () => {
  const binder = createCommandBinder(config()), token = await sign();
  const first = command(), second = command({ id: "command-two" });
  assert.equal(first.payloadHash, second.payloadHash);
  const results = await Promise.all([binder.bind(token, first), binder.bind(token, second), binder.bind(token, first)]);
  assert.deepEqual(results.map((x) => x.command.id), ["command-one", "command-two", "command-one"]);
});

test("only complete, hash-consistent set-ready input is accepted without state/owner authority", async () => {
  const binder = createCommandBinder(config()), token = await sign();
  const omitted = command(); delete omitted.id;
  const cycle = command(); cycle.payload.self = cycle;
  for (const value of [undefined, {}, omitted, { ...command(), payloadHash: "0".repeat(64) },
    command({ kind: "start" }), command({ contract: "other" }), command({ id: "" }),
    command({ payload: { ready: "true" } }), command({ payload: { ready: true, extra: 1 } }),
    command({ owner: "claimed-owner" }), command({ authorized: true }), cycle]) await assert.rejects(binder.bind(token, value),
      (error) => error.code.startsWith("COMMAND_BINDING_") && error.message === error.code);
});

test("consumer return boundary checks expiry after verifier has completed", async () => {
  let calls = 0;
  const binder = createCommandBinder(config(() => ++calls === 4 ? 2000000 : 1000000));
  await assert.rejects(binder.bind(await sign(), command()), { code: "COMMAND_BINDING_EXPIRED" });
  assert.equal(calls, 4);
});

test("consumer return boundary checks abort triggered by its final clock observation", async () => {
  let calls = 0; const controller = new AbortController();
  const binder = createCommandBinder(config(() => { if (++calls === 4) controller.abort(); return 1000000; }));
  await assert.rejects(binder.bind(await sign(), command(), { signal: controller.signal }), { code: "COMMAND_BINDING_CONTEXT_CLOSED" });
  assert.equal(calls, 4);
});

test("closed context before entry or during crypto never returns bound command", async () => {
  const binder = createCommandBinder(config()), token = await sign(), controller = new AbortController();
  const pending = binder.bind(token, command(), { signal: controller.signal });
  const denial = assert.rejects(pending, (error) => error.code.startsWith("COMMAND_BINDING_"));
  controller.abort();
  await rejected(binder, token, command(), { signal: controller.signal });
  await denial;
});

test("clock validity and non-reversal cover consumer-to-verifier and verifier-to-consumer boundaries", async () => {
  const token = await sign();
  for (const step of [1, 2, 3, 4]) for (const bad of [NaN, -1, 999999]) {
    if (step === 1 && bad === 999999) continue;
    let calls = 0;
    await rejected(createCommandBinder(config(() => ++calls === step ? bad : 1000000)), token);
  }
});

test("external failures at all clock observations stay fixed and never read error properties", async () => {
  const token = await sign(), marker = "offline-sensitive-binding-marker";
  let reads = 0;
  const external = { get code() { reads++; throw marker; }, get message() { reads++; throw marker; }, get cause() { reads++; throw marker; } };
  for (const step of [1, 2, 3, 4]) for (const failure of [external, Object.assign(new Error(marker), { code: "COMMAND_BINDING_EXPIRED" }), null, marker]) {
    let calls = 0;
    const binder = createCommandBinder(config(() => { if (++calls === step) throw failure; return 1000000; }));
    await assert.rejects(binder.bind(token, command()), (error) => {
      assert.equal(error.code, "COMMAND_BINDING_REJECTED");
      assert.equal(error.message, error.code);
      assert.equal(Object.hasOwn(error, "cause"), false);
      assert.equal(JSON.stringify(error).includes(marker), false);
      return true;
    });
  }
  assert.equal(reads, 0);
});

test("request/options getter failures are sanitized and trusted configuration is snapshotted", async () => {
  const token = await sign(), marker = "offline-input-marker", cfg = config(), binder = createCommandBinder(cfg);
  cfg.jwks.keys.length = 0; cfg.algorithms.length = 0; cfg.clock = () => { throw marker; };
  assert.equal((await binder.bind(token, command())).subject, subject);
  for (const [input, options] of [[{ get contract() { throw marker; } }, undefined],
    [command(), { get signal() { throw marker; } }]]) {
    await assert.rejects(binder.bind(token, input, options), { code: "COMMAND_BINDING_REJECTED", message: "COMMAND_BINDING_REJECTED" });
  }
  for (const value of [undefined, { verify: async () => claims }, { ...config(), clock: undefined },
    { get issuer() { throw marker; } }]) assert.throws(() => createCommandBinder(value),
      { code: "COMMAND_BINDING_CONFIG_INVALID", message: "COMMAND_BINDING_CONFIG_INVALID" });
});
