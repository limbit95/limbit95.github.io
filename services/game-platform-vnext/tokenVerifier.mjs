import { jwtVerify, createLocalJWKSet, decodeProtectedHeader } from "jose";

const uuid = (v) => typeof v === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/u.test(v);
// Only errors created here carry a trusted classification. Never inspect a
// callback's message/code/cause (including getters) while sanitizing failure.
const internalFailures = new WeakMap();
const fail = (code) => {
  const error = Object.assign(new Error(code), { code });
  internalFailures.set(error, code);
  throw error;
};
const text = (v) => typeof v === "string" && v.length > 0 && v.trim() === v;
const time = (clock) => { const n = clock(); if (!Number.isSafeInteger(n) || n < 0) fail("TOKEN_CLOCK_INVALID"); return n; };
const context = (signal) => { if (signal?.aborted) fail("TOKEN_CONTEXT_CLOSED"); };

/** Token facts only. No current permission, storage caller, A/C/P or network.
 * Inputs are trusted configuration; never construct them from token headers.
 * The ingress consumer must own this call path. A copied result is no permit.
 */
export function createTokenVerifier({ issuer, audience, algorithms, jwks, clock } = {}) {
  if (!text(issuer) || !text(audience) || typeof clock !== "function"
    || !Array.isArray(algorithms) || algorithms.length !== 1 || algorithms[0] !== "ES256"
    || !jwks || !Array.isArray(jwks.keys) || !jwks.keys.length) fail("TOKEN_CONFIG_INVALID");
  const keys = structuredClone(jwks.keys);
  const kids = new Set();
  for (const k of keys) {
    if (!k || k.kty !== "EC" || k.crv !== "P-256" || k.alg !== "ES256" || k.use !== "sig"
      || !text(k.kid) || kids.has(k.kid) || !text(k.x) || !text(k.y)
      || Object.keys(k).some((n) => !["kty", "crv", "alg", "use", "kid", "x", "y", "key_ops", "ext"].includes(n))
      || (k.key_ops !== undefined && (!Array.isArray(k.key_ops) || k.key_ops.length !== 1 || k.key_ops[0] !== "verify"))) fail("TOKEN_CONFIG_INVALID");
    kids.add(k.kid);
  }
  const localKeys = createLocalJWKSet({ keys });
  return Object.freeze({
    async verify(token, { signal } = {}) {
      try {
        context(signal);
        const start = time(clock);
        if (typeof token !== "string" || token.length > 16384 || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/u.test(token)) fail("TOKEN_MALFORMED");
        const header = decodeProtectedHeader(token);
        if (header.alg !== "ES256" || header.typ !== "JWT" || !kids.has(header.kid)
          || ["jku", "x5u", "jwk", "x5c"].some((n) => Object.hasOwn(header, n))) fail("TOKEN_HEADER_REJECTED");
        const { payload } = await jwtVerify(token, localKeys, { issuer, audience, algorithms: ["ES256"],
          requiredClaims: ["sub", "session_id", "exp"], clockTolerance: 0, currentDate: new Date(start) });
        context(signal);
        const finish = time(clock);
        if (finish < start) fail("TOKEN_CLOCK_INVALID");
        if (!uuid(payload.sub) || !uuid(payload.session_id) || !Number.isSafeInteger(payload.exp) || payload.exp < 1
          || (payload.nbf !== undefined && (!Number.isSafeInteger(payload.nbf) || payload.nbf < 0))) fail("TOKEN_CLAIMS_INVALID");
        if (finish / 1000 >= payload.exp) fail("TOKEN_EXPIRED");
        if (payload.nbf !== undefined && finish / 1000 < payload.nbf) fail("TOKEN_NOT_ACTIVE");
        context(signal);
        return Object.freeze({ kind: "VERIFIED_TOKEN_CLAIMS", subject: payload.sub, sessionId: payload.session_id,
          expiresAtSeconds: payload.exp, issuer, audience });
      } catch (error) {
        // Never expose JWT bytes, library error payloads or identifiers in errors.
        const code = internalFailures.get(error) ?? "TOKEN_VERIFICATION_REJECTED";
        fail(code);
      }
    },
  });
}
