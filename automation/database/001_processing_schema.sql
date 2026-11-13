-- FOOTHIVE Activepieces processing backend (review-only migration).
-- Apply manually to the dedicated Netlify PostgreSQL database after review.
-- No website tables or frontend changes.
CREATE SCHEMA IF NOT EXISTS foothive_automation;

CREATE TABLE IF NOT EXISTS foothive_automation.visitor_processing (
 response_id text PRIMARY KEY,
 email text NOT NULL,
 source_site text NOT NULL DEFAULT 'google_forms',
 state text NOT NULL DEFAULT 'processing'
   CHECK (state IN ('processing','completed','failed','uncertain')),
 claim_token uuid NOT NULL DEFAULT gen_random_uuid(),
 claimed_at timestamptz NOT NULL DEFAULT now(),
 completed_at timestamptz,
 completion_number bigint UNIQUE,
 last_error text,
 CONSTRAINT email_nonempty CHECK (length(trim(email)) > 3)
);

CREATE TABLE IF NOT EXISTS foothive_automation.notification_attempts (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 response_id text NOT NULL REFERENCES foothive_automation.visitor_processing(response_id),
 channel text NOT NULL CHECK (channel IN ('whatsmcp','ntfy','gmail')),
 outcome text NOT NULL CHECK (outcome IN ('accepted','queued','failed','uncertain','draft','sent')),
 http_status integer,
 provider_message_id text,
 error_detail text,
 recorded_at timestamptz NOT NULL DEFAULT now(),
 idempotency_key text UNIQUE
);
CREATE INDEX IF NOT EXISTS notification_attempts_response_idx
 ON foothive_automation.notification_attempts(response_id);

CREATE TABLE IF NOT EXISTS foothive_automation.processing_counter (
 counter_name text PRIMARY KEY,
 completed_count bigint NOT NULL DEFAULT 0 CHECK (completed_count >= 0)
);
INSERT INTO foothive_automation.processing_counter(counter_name,completed_count)
 VALUES ('notification_processing',0) ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS foothive_automation.health_check_milestones (
 milestone_number bigint PRIMARY KEY CHECK (milestone_number > 0 AND milestone_number % 20 = 0),
 status text NOT NULL DEFAULT 'pending'
   CHECK (status IN ('pending','running','passed','failed','uncertain')),
 checked_at timestamptz,
 last_error text
);

-- Transactionally claim a response. A duplicate never receives a second claim.
-- Recovery of stale processing/uncertain claims requires a separate audited procedure.
CREATE OR REPLACE FUNCTION foothive_automation.claim_response(
 p_response_id text, p_email text, p_source_site text DEFAULT 'google_forms')
RETURNS TABLE(claimed boolean, token uuid, current_state text)
LANGUAGE plpgsql AS $$
DECLARE v foothive_automation.visitor_processing%ROWTYPE;
BEGIN
 IF nullif(trim(p_response_id),'') IS NULL OR nullif(trim(p_email),'') IS NULL THEN
   RAISE EXCEPTION 'response_id and email required';
 END IF;
 INSERT INTO foothive_automation.visitor_processing(response_id,email,source_site)
 VALUES (p_response_id,lower(trim(p_email)),coalesce(nullif(trim(p_source_site),''),'google_forms'))
 ON CONFLICT (response_id) DO NOTHING;
 IF FOUND THEN
   SELECT * INTO v FROM foothive_automation.visitor_processing WHERE response_id=p_response_id;
   RETURN QUERY SELECT true,v.claim_token,v.state;
 ELSE
   SELECT * INTO v FROM foothive_automation.visitor_processing WHERE response_id=p_response_id;
   RETURN QUERY SELECT false,NULL::uuid,v.state;
 END IF;
END $$;

-- Mark a completed notification-processing attempt exactly once, assigning a
-- gap-free counter milestone under a row lock. Call after final routing outcome.
CREATE OR REPLACE FUNCTION foothive_automation.complete_response(
 p_response_id text, p_claim_token uuid, p_state text DEFAULT 'completed',
 p_error text DEFAULT NULL)
RETURNS TABLE(new_completion boolean, completion_number bigint, health_check_due boolean)
LANGUAGE plpgsql AS $$
DECLARE v foothive_automation.visitor_processing%ROWTYPE;
DECLARE n bigint;
BEGIN
 IF p_state NOT IN ('completed','failed','uncertain') THEN
   RAISE EXCEPTION 'invalid final processing state';
 END IF;
 SELECT * INTO v FROM foothive_automation.visitor_processing
  WHERE response_id=p_response_id FOR UPDATE;
 IF NOT FOUND OR v.claim_token IS DISTINCT FROM p_claim_token THEN
   RAISE EXCEPTION 'claim not found or token mismatch';
 END IF;
 IF v.completion_number IS NOT NULL THEN
   RETURN QUERY SELECT false,v.completion_number,false;
   RETURN;
 END IF;
 UPDATE foothive_automation.processing_counter
   SET completed_count=completed_count+1 WHERE counter_name='notification_processing'
   RETURNING completed_count INTO n;
 UPDATE foothive_automation.visitor_processing
   SET state=p_state,completed_at=now(),completion_number=n,last_error=p_error
   WHERE response_id=p_response_id;
 IF n % 20 = 0 THEN
   INSERT INTO foothive_automation.health_check_milestones(milestone_number)
   VALUES(n) ON CONFLICT DO NOTHING;
 END IF;
 RETURN QUERY SELECT true,n,(n % 20 = 0);
END $$;

-- Security: revoke default public access; only the trusted server-side role
-- should receive explicit schema/table/function privileges after provisioning.
REVOKE ALL ON SCHEMA foothive_automation FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA foothive_automation FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA foothive_automation FROM PUBLIC;
