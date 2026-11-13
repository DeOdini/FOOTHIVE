import { randomUUID, timingSafeEqual } from 'node:crypto';
import pg from 'pg';

// Standalone function: deploy only after configuring the database and API secret.
// Never expose this key to the browser; only Activepieces server-side HTTP actions.
const { Pool } = pg;
let pool;
function database() {
  if (!pool) {
    const connectionString = process.env.FOOTHIVE_AUTOMATION_DATABASE_URL;
    if (!connectionString) throw new Error('database_not_configured');
    pool = new Pool({ connectionString, max: 5, connectionTimeoutMillis: 5000, idleTimeoutMillis: 30000 });
  }
  return pool;
}
const response = (status, body) => ({
  statusCode: status,
  headers: { 'content-type': 'application/json', 'cache-control': 'no-store',
    'x-content-type-options': 'nosniff' },
  body: JSON.stringify(body)
});
function authorize(headers = {}) {
  const secret = process.env.FOOTHIVE_AUTOMATION_API_KEY;
  const supplied = headers.authorization ?? headers.Authorization ?? '';
  if (!secret || secret.length < 32 || !supplied.startsWith('Bearer ')) return false;
  const expected = Buffer.from(secret);
  const actual = Buffer.from(supplied.slice(7));
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
function validId(x) { return typeof x === 'string' && x.length > 0 && x.length <= 200 && /^[\w.:/-]+$/.test(x); }
function validEmail(x) { return typeof x === 'string' && x.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x); }
function validToken(x) { return typeof x === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(x); }
function str(x, max = 1000) { return typeof x === 'string' ? x.slice(0,max) : null; }
const allowedChannels = new Set(['whatsmcp','ntfy','gmail']);
const allowedOutcomes = new Set(['accepted','queued','failed','uncertain','draft','sent']);
const allowedStates = new Set(['completed','failed','uncertain']);
const allowedHealth = new Set(['passed','failed','uncertain']);

export async function handler(event) {
  if (event.httpMethod !== 'POST') return response(405, {error:'method_not_allowed'});
  if (!authorize(event.headers)) return response(401, {error:'unauthorized'});
  if (Buffer.byteLength(event.body ?? '', 'utf8') > 16384) return response(413,{error:'body_too_large'});
  let body;
  try { body = JSON.parse(event.body || '{}'); } catch { return response(400,{error:'invalid_json'}); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return response(400,{error:'invalid_body'});
  try {
    const db = database();
    switch (body.action) {
      case 'claim': {
        if (!validId(body.responseId) || !validEmail(body.email)) return response(400,{error:'invalid_response'});
        const source = str(body.sourceSite,50) || 'google_forms';
        const { rows } = await db.query(
          'SELECT * FROM foothive_automation.claim_response($1,$2,$3)',
          [body.responseId,body.email,source]);
        return response(200,{claimed:rows[0].claimed,claimToken:rows[0].token,state:rows[0].current_state});
      }
      case 'record_attempt': {
        if (!validId(body.responseId) || !validToken(body.claimToken) ||
          !allowedChannels.has(body.channel) || !allowedOutcomes.has(body.outcome) ||
          !validId(body.idempotencyKey) ||
          (body.httpStatus != null && (!Number.isInteger(body.httpStatus) || body.httpStatus < 100 || body.httpStatus > 599)))
          return response(400,{error:'invalid_attempt'});
        // Only the current claimant may write attempts.
        const { rows } = await db.query(
          `INSERT INTO foothive_automation.notification_attempts
           (response_id,channel,outcome,http_status,provider_message_id,error_detail,idempotency_key)
           SELECT response_id,$3,$4,$5,$6,$7,$8
           FROM foothive_automation.visitor_processing
           WHERE response_id=$1 AND claim_token=$2 AND completion_number IS NULL
           ON CONFLICT (idempotency_key) DO NOTHING RETURNING id`,
          [body.responseId,body.claimToken,body.channel,body.outcome,
           body.httpStatus ?? null,str(body.providerMessageId,200),str(body.error,1000),body.idempotencyKey]);
        return response(200,{recorded:rows.length === 1});
      }
      case 'complete': {
        if (!validId(body.responseId) || !validToken(body.claimToken) || !allowedStates.has(body.state))
          return response(400,{error:'invalid_completion'});
        const { rows } = await db.query(
          'SELECT * FROM foothive_automation.complete_response($1,$2,$3,$4)',
          [body.responseId,body.claimToken,body.state,str(body.error)]);
        return response(200,{newCompletion:rows[0].new_completion,
          completionNumber:String(rows[0].completion_number),
          healthCheckDue:rows[0].health_check_due});
      }
      case 'claim_health_check': {
        const { rows } = await db.query('SELECT * FROM foothive_automation.claim_health_check()');
        return response(200,rows.length ? {due:true,milestoneNumber:String(rows[0].milestone_number),
          leaseToken:rows[0].lease_token} : {due:false});
      }
      case 'finish_health_check': {
        const milestone = Number(body.milestoneNumber);
        if (!Number.isSafeInteger(milestone) || milestone <= 0 || milestone % 20 !== 0 ||
          !validToken(body.leaseToken) || !allowedHealth.has(body.status) ||
          (body.httpStatus != null && (!Number.isInteger(body.httpStatus) || body.httpStatus < 100 || body.httpStatus > 599)))
          return response(400,{error:'invalid_health_result'});
        const { rows } = await db.query(
          'SELECT foothive_automation.finish_health_check($1,$2,$3,$4,$5) AS recorded',
          [milestone,body.leaseToken,body.status,body.httpStatus ?? null,str(body.error)]);
        return response(200,{recorded:rows[0].recorded});
      }
      default: return response(400,{error:'unknown_action'});
    }
  } catch (error) {
    // No SQL, connection strings or secrets in responses.
    console.error('foothive_automation_api_error', error?.code || 'internal');
    return response(503,{error:'backend_unavailable'});
  }
}
