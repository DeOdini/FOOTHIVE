-- Phase 2 hardening. Apply only after 001 and 002 in an approved environment.
-- Lock parent row when recording attempts, so a concurrent completion cannot
-- overtake a notification record. A duplicate idempotency key is rejected
-- unless it belongs to the same response and channel.
CREATE OR REPLACE FUNCTION foothive_automation.record_attempt(
 p_response_id text, p_claim_token uuid, p_channel text,
 p_outcome text, p_http_status integer, p_provider_message_id text,
 p_error_detail text, p_idempotency_key text)
RETURNS TABLE(recorded boolean, duplicate boolean)
LANGUAGE plpgsql AS $$
DECLARE v foothive_automation.visitor_processing%ROWTYPE;
DECLARE prior foothive_automation.notification_attempts%ROWTYPE;
BEGIN
 IF p_channel NOT IN ('whatsmcp','ntfy','gmail')
    OR p_outcome NOT IN ('accepted','queued','failed','uncertain','draft','sent')
    OR nullif(trim(p_idempotency_key),'') IS NULL THEN
   RAISE EXCEPTION 'invalid attempt';
 END IF;
 SELECT * INTO v FROM foothive_automation.visitor_processing
 WHERE response_id=p_response_id FOR UPDATE;
 IF NOT FOUND OR v.claim_token IS DISTINCT FROM p_claim_token THEN
   RAISE EXCEPTION 'invalid claim';
 END IF;
 SELECT * INTO prior FROM foothive_automation.notification_attempts
 WHERE idempotency_key=p_idempotency_key;
 IF FOUND THEN
   IF prior.response_id <> p_response_id OR prior.channel <> p_channel
      OR prior.outcome <> p_outcome THEN
     RAISE EXCEPTION 'idempotency key reused for different attempt';
   END IF;
   RETURN QUERY SELECT false,true;
   RETURN;
 END IF;
 IF v.completion_number IS NOT NULL THEN
   RAISE EXCEPTION 'response already completed';
 END IF;
 INSERT INTO foothive_automation.notification_attempts
 (response_id,channel,outcome,http_status,provider_message_id,error_detail,idempotency_key)
 VALUES(p_response_id,p_channel,p_outcome,p_http_status,
        left(p_provider_message_id,200),left(p_error_detail,1000),p_idempotency_key);
 RETURN QUERY SELECT true,false;
END $$;
REVOKE ALL ON FUNCTION foothive_automation.record_attempt(
 text,uuid,text,text,integer,text,text,text) FROM PUBLIC;
