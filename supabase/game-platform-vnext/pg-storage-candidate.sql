-- REVIEW CANDIDATE ONLY. Never applied; not a migration history entry.
-- Internal storage primitives, NOT trusted admission, A, native P or an online RPC.
-- Only the existing installation owner may exercise this isolated candidate.
-- No runtime login, bootstrap seed, public endpoint or runtime GRANT is supplied.
BEGIN;

CREATE SCHEMA vnext_private AUTHORIZATION postgres;
REVOKE ALL ON SCHEMA vnext_private FROM PUBLIC, anon, authenticated, service_role, authenticator;

CREATE TABLE vnext_private.session_anchors (
  session_id text NOT NULL CHECK (session_id <> ''),
  match_id text NOT NULL CHECK (match_id <> ''),
  owner_id text NOT NULL CHECK (owner_id <> ''),
  stream_id text NOT NULL CHECK (stream_id <> ''),
  revision bigint NOT NULL CHECK (revision BETWEEN 0 AND 9007199254740991),
  phase text NOT NULL CHECK (phase IN ('WAITING', 'ACTIVE', 'TERMINAL')),
  closed boolean NOT NULL DEFAULT true,
  failure_context_known boolean NOT NULL DEFAULT false,
  first_failure_at timestamptz,
  abort_requested boolean NOT NULL DEFAULT false,
  terminal_id text,
  terminal_at timestamptz,
  PRIMARY KEY (session_id, match_id),
  CHECK ((terminal_id IS NULL) = (terminal_at IS NULL)),
  CHECK ((phase = 'TERMINAL') = (terminal_id IS NOT NULL)),
  CHECK (terminal_id IS NULL OR terminal_id <> '')
);

CREATE TABLE vnext_private.session_members (
  session_id text NOT NULL,
  match_id text NOT NULL,
  subject_id text NOT NULL CHECK (subject_id <> ''),
  ready boolean NOT NULL,
  PRIMARY KEY (session_id, match_id, subject_id),
  FOREIGN KEY (session_id, match_id)
    REFERENCES vnext_private.session_anchors ON DELETE CASCADE
);

CREATE TABLE vnext_private.session_commands (
  contract text NOT NULL CHECK (contract = 'GP-COOP-SESSION/1'),
  session_id text NOT NULL,
  match_id text NOT NULL,
  subject_id text NOT NULL,
  command_id text NOT NULL CHECK (command_id <> ''),
  payload_hash text NOT NULL CHECK (payload_hash ~ '^[0-9a-f]{64}$'),
  ready boolean NOT NULL,
  owner_id text NOT NULL,
  stream_id text NOT NULL,
  result_revision bigint NOT NULL CHECK (result_revision BETWEEN 1 AND 9007199254740991),
  -- A DB row creation observation, never the actual transaction commit time C.
  recorded_at timestamptz NOT NULL DEFAULT pg_catalog.clock_timestamp(),
  PRIMARY KEY (contract, session_id, match_id, subject_id, command_id),
  FOREIGN KEY (session_id, match_id, subject_id)
    REFERENCES vnext_private.session_members ON DELETE CASCADE
);

ALTER TABLE vnext_private.session_anchors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vnext_private.session_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE vnext_private.session_commands ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON ALL TABLES IN SCHEMA vnext_private
  FROM PUBLIC, anon, authenticated, service_role, authenticator;

CREATE FUNCTION vnext_private.storage_owner_only() RETURNS void
LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  IF session_user <> 'postgres' OR current_user <> 'postgres' THEN
    RAISE EXCEPTION 'Storage candidate is not available to runtime callers' USING ERRCODE = '42501';
  END IF;
END;
$$;

-- This only checks stored storage preconditions. It is NOT check_access, a
-- verified JWT/session/current external generation or a reusable A permit.
CREATE FUNCTION vnext_private.storage_check_open(p_row vnext_private.session_anchors)
RETURNS void LANGUAGE plpgsql VOLATILE SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  PERFORM vnext_private.storage_owner_only();
  IF p_row.closed OR p_row.abort_requested OR NOT p_row.failure_context_known
    OR (p_row.first_failure_at IS NOT NULL
      AND pg_catalog.clock_timestamp() >= p_row.first_failure_at + interval '60 seconds') THEN
    RAISE EXCEPTION 'Storage context closed or failure context unavailable' USING ERRCODE = '55000';
  END IF;
END;
$$;

CREATE FUNCTION vnext_private.storage_ready(
  p_contract text, p_session text, p_match text, p_subject text, p_id text,
  p_hash text, p_ready boolean, p_owner text, p_expected_revision bigint
) RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  s vnext_private.session_anchors%ROWTYPE;
  c vnext_private.session_commands%ROWTYPE;
BEGIN
  PERFORM vnext_private.storage_owner_only();
  IF p_contract IS DISTINCT FROM 'GP-COOP-SESSION/1' OR p_id IS NULL OR p_id = ''
    OR p_hash IS NULL OR p_hash !~ '^[0-9a-f]{64}$' OR p_ready IS NULL
    OR p_expected_revision IS NULL OR p_expected_revision < 0
    OR p_expected_revision > 9007199254740991 THEN
    RAISE EXCEPTION 'Invalid storage command' USING ERRCODE = '22023';
  END IF;
  -- A stable existing row serializes the absent-ledger race too. Never create
  -- a session/owner here. Future membership/owner writers must share this lock.
  SELECT * INTO s FROM vnext_private.session_anchors
    WHERE session_id = p_session AND match_id = p_match FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Storage session missing' USING ERRCODE = '22023'; END IF;
  PERFORM vnext_private.storage_check_open(s);
  IF s.owner_id IS DISTINCT FROM p_owner THEN
    RAISE EXCEPTION 'Storage owner mismatch' USING ERRCODE = '40001';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM vnext_private.session_members
    WHERE session_id = p_session AND match_id = p_match AND subject_id = p_subject) THEN
    RAISE EXCEPTION 'Storage subject missing' USING ERRCODE = '42501';
  END IF;
  -- Lookup before stale-revision/phase checks permits observation of an
  -- already stored same command without applying it again. It grants no P.
  SELECT * INTO c FROM vnext_private.session_commands
    WHERE contract = p_contract AND session_id = p_session AND match_id = p_match
      AND subject_id = p_subject AND command_id = p_id;
  IF FOUND THEN
    IF c.payload_hash IS DISTINCT FROM p_hash OR c.ready IS DISTINCT FROM p_ready THEN
      RAISE EXCEPTION 'Stored command identity collision' USING ERRCODE = '22023';
    END IF;
  ELSE
    IF s.phase <> 'WAITING' OR s.terminal_id IS NOT NULL THEN
      RAISE EXCEPTION 'Ready unavailable; start/rematch/terminal writes unimplemented' USING ERRCODE = '55000';
    END IF;
    IF s.revision <> p_expected_revision OR s.revision >= 9007199254740991 THEN
      RAISE EXCEPTION 'Storage revision mismatch or exhaustion' USING ERRCODE = '40001';
    END IF;
    -- Only a boolean ready mutation: no client/proposal.next state is accepted.
    UPDATE vnext_private.session_members SET ready = p_ready
      WHERE session_id = p_session AND match_id = p_match AND subject_id = p_subject;
    UPDATE vnext_private.session_anchors SET revision = revision + 1
      WHERE session_id = p_session AND match_id = p_match;
    INSERT INTO vnext_private.session_commands
      (contract, session_id, match_id, subject_id, command_id, payload_hash,
       ready, owner_id, stream_id, result_revision)
      VALUES (p_contract, p_session, p_match, p_subject, p_id, p_hash,
        p_ready, s.owner_id, s.stream_id, s.revision + 1) RETURNING * INTO c;
  END IF;
  RETURN pg_catalog.jsonb_build_object('outcome', 'RECORDED', 'id', c.command_id,
    'payloadHash', c.payload_hash, 'session', c.session_id, 'match', c.match_id,
    'subject', c.subject_id, 'owner', c.owner_id, 'stream', c.stream_id,
    'revision', c.result_revision);
END;
$$;

CREATE FUNCTION vnext_private.storage_current(
  p_session text, p_match text, p_subject text, p_owner text
) RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  s vnext_private.session_anchors%ROWTYPE;
  members jsonb;
BEGIN
  PERFORM vnext_private.storage_owner_only();
  SELECT * INTO s FROM vnext_private.session_anchors
    WHERE session_id = p_session AND match_id = p_match FOR SHARE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Storage session missing' USING ERRCODE = '22023'; END IF;
  PERFORM vnext_private.storage_check_open(s);
  IF s.owner_id IS DISTINCT FROM p_owner OR NOT EXISTS
    (SELECT 1 FROM vnext_private.session_members WHERE session_id = p_session
      AND match_id = p_match AND subject_id = p_subject) THEN
    RAISE EXCEPTION 'Storage projection scope mismatch' USING ERRCODE = '42501';
  END IF;
  SELECT pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object('id', subject_id, 'ready', ready)
    ORDER BY subject_id COLLATE "C") INTO members FROM vnext_private.session_members
    WHERE session_id = p_session AND match_id = p_match;
  RETURN pg_catalog.jsonb_build_object('contract', 'GP-COOP-SESSION/1',
    'session', s.session_id, 'match', s.match_id, 'owner', s.owner_id,
    'stream', s.stream_id, 'revision', s.revision, 'phase', s.phase, 'members', members);
END;
$$;

CREATE FUNCTION vnext_private.storage_command_status(
  p_contract text, p_session text, p_match text, p_subject text, p_id text,
  p_hash text, p_ready boolean, p_owner text
) RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  s vnext_private.session_anchors%ROWTYPE;
  c vnext_private.session_commands%ROWTYPE;
BEGIN
  PERFORM vnext_private.storage_owner_only();
  IF p_contract IS DISTINCT FROM 'GP-COOP-SESSION/1' OR p_id IS NULL OR p_id = ''
    OR p_hash IS NULL OR p_hash !~ '^[0-9a-f]{64}$' OR p_ready IS NULL THEN
    RAISE EXCEPTION 'Invalid storage command lookup' USING ERRCODE = '22023';
  END IF;
  SELECT * INTO s FROM vnext_private.session_anchors
    WHERE session_id = p_session AND match_id = p_match FOR SHARE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Storage session missing' USING ERRCODE = '22023'; END IF;
  PERFORM vnext_private.storage_check_open(s);
  IF s.owner_id IS DISTINCT FROM p_owner OR NOT EXISTS
    (SELECT 1 FROM vnext_private.session_members WHERE session_id = p_session
      AND match_id = p_match AND subject_id = p_subject) THEN
    RAISE EXCEPTION 'Storage lookup scope mismatch' USING ERRCODE = '42501';
  END IF;
  SELECT * INTO c FROM vnext_private.session_commands
    WHERE contract = p_contract AND session_id = p_session AND match_id = p_match
      AND subject_id = p_subject AND command_id = p_id;
  IF NOT FOUND THEN RETURN pg_catalog.jsonb_build_object('outcome', 'UNKNOWN',
    'id', p_id, 'payloadHash', p_hash); END IF;
  IF c.payload_hash IS DISTINCT FROM p_hash OR c.ready IS DISTINCT FROM p_ready THEN
    RAISE EXCEPTION 'Stored command identity collision' USING ERRCODE = '22023';
  END IF;
  RETURN pg_catalog.jsonb_build_object('outcome', 'RECORDED', 'id', c.command_id,
    'payloadHash', c.payload_hash, 'session', c.session_id, 'match', c.match_id,
    'subject', c.subject_id, 'owner', c.owner_id, 'stream', c.stream_id,
    'revision', c.result_revision);
END;
$$;

REVOKE ALL ON ALL FUNCTIONS IN SCHEMA vnext_private
  FROM PUBLIC, anon, authenticated, service_role, authenticator;
-- No GRANT, seed or bootstrap. Future admission must be a distinct reviewed
-- same-transaction finalizer, not exposure of these storage primitives.
COMMIT;
