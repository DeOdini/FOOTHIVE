-- Apply AFTER 001_processing_schema.sql, in the same database, following review.
ALTER TABLE foothive_automation.health_check_milestones
 ADD COLUMN IF NOT EXISTS lease_token uuid,
 ADD COLUMN IF NOT EXISTS leased_until timestamptz,
 ADD COLUMN IF NOT EXISTS attempt_count integer NOT NULL DEFAULT 0,
 ADD COLUMN IF NOT EXISTS http_status integer;

-- A lease makes concurrent health-check workers safe. Expired leases may be
-- reclaimed, but a timed-out external GET can run twice (GET is read-only).
CREATE OR REPLACE FUNCTION foothive_automation.claim_health_check()
RETURNS TABLE(milestone_number bigint, lease_token uuid)
LANGUAGE plpgsql AS $$
DECLARE v foothive_automation.health_check_milestones%ROWTYPE;
BEGIN
 SELECT * INTO v FROM foothive_automation.health_check_milestones h
 WHERE h.status='pending'
    OR (h.status='running' AND h.leased_until < now())
 ORDER BY h.milestone_number
 FOR UPDATE SKIP LOCKED LIMIT 1;
 IF NOT FOUND THEN RETURN; END IF;
 UPDATE foothive_automation.health_check_milestones h
 SET status='running',lease_token=gen_random_uuid(),
     leased_until=now()+interval '2 minutes',
     attempt_count=attempt_count+1
 WHERE h.milestone_number=v.milestone_number
 RETURNING h.* INTO v;
 RETURN QUERY SELECT v.milestone_number,v.lease_token;
END $$;

CREATE OR REPLACE FUNCTION foothive_automation.finish_health_check(
 p_milestone bigint,p_lease_token uuid,p_status text,p_http_status integer DEFAULT NULL,
 p_error text DEFAULT NULL)
RETURNS boolean LANGUAGE plpgsql AS $$
BEGIN
 IF p_status NOT IN ('passed','failed','uncertain') THEN
   RAISE EXCEPTION 'invalid health check outcome';
 END IF;
 UPDATE foothive_automation.health_check_milestones
 SET status=p_status,checked_at=now(),http_status=p_http_status,
     last_error=left(p_error,1000),leased_until=NULL,lease_token=NULL
 WHERE milestone_number=p_milestone AND lease_token=p_lease_token
   AND status='running';
 RETURN FOUND;
END $$;

REVOKE ALL ON ALL FUNCTIONS IN SCHEMA foothive_automation FROM PUBLIC;
