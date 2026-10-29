import { createTokenVerifier } from "./tokenVerifier.mjs";
import { SESSION_CONTRACT, sessionCommandHash } from "./sessionControl.mjs";

const failures = new WeakMap();
function fail(code) {
  const error = Object.assign(new Error(code), { code });
  failures.set(error, code);
  throw error;
}
const text = (value) => typeof value === "string" && value.length > 0;
const fields = ["contract", "id", "session", "match", "subject", "kind", "payload", "payloadHash"];
function snapshot(input) {
  const command = structuredClone(input);
  if (!command || Object.getPrototypeOf(command) !== Object.prototype
    || Object.keys(command).length !== fields.length || Object.keys(command).some((key) => !fields.includes(key))
    || command.contract !== SESSION_CONTRACT || command.kind !== "set-ready"
    || !["id", "session", "match", "subject", "payloadHash"].every((key) => text(command[key]))
    || !command.payload || Object.getPrototypeOf(command.payload) !== Object.prototype
    || Object.keys(command.payload).length !== 1 || typeof command.payload.ready !== "boolean"
    || command.payloadHash !== sessionCommandHash(command)) fail("COMMAND_BINDING_INPUT_INVALID");
  Object.freeze(command.payload);
  return Object.freeze(command);
}
function context(signal) { if (signal?.aborted) fail("COMMAND_BINDING_CONTEXT_CLOSED"); }

/** Token subject bound to command input only: no current permission, replay
 * protection, storage, A/C/P, DB caller permit or command signature.
 * Configuration is trusted. This consumer owns the original JWT verify call.
 */
export function createCommandBinder(configuration) {
  let config, clock;
  try {
    const { issuer, audience, algorithms, jwks, clock: configuredClock } = configuration ?? {};
    clock = configuredClock;
    config = structuredClone({ issuer, audience, algorithms, jwks });
    // Validate/snapshot explicit configuration at construction; no JWT or I/O.
    createTokenVerifier({ ...config, clock });
  } catch {
    fail("COMMAND_BINDING_CONFIG_INVALID");
  }
  return Object.freeze({
    async bind(token, input, options) {
      try {
        const { signal } = options ?? {};
        let last = -1;
        const observe = () => {
          const now = clock();
          if (!Number.isSafeInteger(now) || now < 0 || now < last) fail("COMMAND_BINDING_CLOCK_INVALID");
          last = now;
          return now;
        };
        context(signal);
        observe();
        const command = snapshot(input);
        // A per-call clock observer covers every verifier observation as well
        // as this consumer; concurrent calls never share clock history.
        const claims = await createTokenVerifier({ ...config, clock: observe }).verify(token, { signal });
        if (claims.subject !== command.subject) fail("COMMAND_BINDING_SUBJECT_MISMATCH");
        const finish = observe();
        if (finish / 1000 >= claims.expiresAtSeconds) fail("COMMAND_BINDING_EXPIRED");
        context(signal);
        return Object.freeze({ kind: "TOKEN_SUBJECT_BOUND_COMMAND", subject: claims.subject,
          authSessionId: claims.sessionId, expiresAtSeconds: claims.expiresAtSeconds, command });
      } catch (error) {
        // Do not inspect external error properties, even getters or causes.
        fail(failures.get(error) ?? "COMMAND_BINDING_REJECTED");
      }
    },
  });
}
