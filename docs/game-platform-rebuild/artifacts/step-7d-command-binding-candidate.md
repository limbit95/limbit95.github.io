# STEP7D private JWT-to-command binding candidate

createCommandBinder takes explicit trusted issuer/audience/ES256 public JWKS/clock configuration and owns the original JWT verification call. bind(token, command, { signal }) accepts only GP-COOP-SESSION/1 set-ready input. It snapshots command fields before awaiting crypto, preserves command ID and existing sessionCommandHash semantics, and rejects a subject mismatch without rewriting it.

TOKEN_SUBJECT_BOUND_COMMAND contains token subject, authSessionId, expiry and an independent frozen command/payload. Auth session_id and game command.session are different namespaces. The JWT does not sign the command. This result grants no current permission, replay protection, A/C/P, DB caller permit or storage operation; serialized copies cannot bypass future verification. Freezing is not isolation from malicious code in the same process.

An invocation-local clock observer checks safe nonnegative milliseconds and non-reversal across consumer and verifier observations, including concurrent calls. Consumer return rechecks exp with zero tolerance and context closure. Errors use fixed local classifications without inspecting external message/code/cause/getters. No raw token/key/claims logging, default configuration discovery, remote JWKS/Auth fallback, DB/listener/runtime GRANT/current/native P is supplied.

Offline fixtures use https://command-binding-fixture.invalid and offline-command-binding-vnext with generated ES256 test keys. They are not operating configuration. Production compatibility remains unproven and closed. Actual DB/whole S1 or PR435/437 merge is not a prerequisite for this independent candidate.

No package/lock dependency changes. Existing pg8.23.1/jose6.2.12 and root browser package/lock are preserved. The existing private package tool explicitly includes commandBinding.mjs and its import probe; package contracts reject its omission. That code inventory update is not proof of a newly built deployable archive/unpack. Such artifact execution remains separate NOT_RUN; old14package archives do not certify this source.

Original Astra decision section8, STEP7B section7 and all inherited obligations remain intact. DB NOT_RUN/public UNKNOWN_OPAQUE_EDGES/STEP7D incomplete/support unproven are retained. Source/patch/bundle and actual revision-bound command summaries are provided outside the repository. No original SQL/lease/wrapper/helper/archive engine/Guard/policy/workflow/game/Auth/site writer changes.
