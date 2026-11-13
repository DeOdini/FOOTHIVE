import test from 'node:test';
import assert from 'node:assert/strict';
import pg from 'pg';
import { handler } from '../netlify/functions/automation-api.mjs';

const originalQuery = pg.Pool.prototype.query;
const oldKey = process.env.FOOTHIVE_AUTOMATION_API_KEY;
const oldDb = process.env.FOOTHIVE_AUTOMATION_DATABASE_URL;
const key = 'development-only-test-secret-that-is-long-enough';
process.env.FOOTHIVE_AUTOMATION_API_KEY = key;
process.env.FOOTHIVE_AUTOMATION_DATABASE_URL = 'postgresql://invalid:invalid@127.0.0.1:1/test';
const request = (action, data = {}, auth = key) => handler({
  httpMethod: 'POST', headers: { authorization: 'Bearer ' + auth },
  body: JSON.stringify({ action, ...data })
});
const body = r => JSON.parse(r.body);
test.after(() => {
  pg.Pool.prototype.query = originalQuery;
  if (oldKey === undefined) delete process.env.FOOTHIVE_AUTOMATION_API_KEY;
  else process.env.FOOTHIVE_AUTOMATION_API_KEY = oldKey;
  if (oldDb === undefined) delete process.env.FOOTHIVE_AUTOMATION_DATABASE_URL;
  else process.env.FOOTHIVE_AUTOMATION_DATABASE_URL = oldDb;
});
test('unauthorized requests cannot access database', async () => {
  const r = await request('claim', {}, 'wrong');
  assert.equal(r.statusCode,401);
});
test('invalid JSON rejected', async () => {
  const r = await handler({httpMethod:'POST',headers:{authorization:'Bearer '+key},body:'{'});
  assert.equal(r.statusCode,400);
});
test('GET cannot mutate', async () => {
  const r = await handler({httpMethod:'GET',headers:{authorization:'Bearer '+key}});
  assert.equal(r.statusCode,405);
});
test('claim rejects invalid email before database query', async () => {
  const r = await request('claim',{responseId:'resp1',email:'invalid'});
  assert.equal(r.statusCode,400);
});
test('claim returns opaque token and duplicate status', async () => {
  let calls=0;
  pg.Pool.prototype.query = async (sql,params) => {
    assert.match(sql,/claim_response/);
    assert.deepEqual(params,['response1','visitor@example.org','google_forms']);
    return {rows:[++calls===1
      ? {claimed:true,token:'8b8c9954-1bd8-4f72-a3a5-15dd68f82d54',current_state:'processing'}
      : {claimed:false,token:null,current_state:'processing'}]};
  };
  const a=body(await request('claim',{responseId:'response1',email:'visitor@example.org'}));
  const b=body(await request('claim',{responseId:'response1',email:'visitor@example.org'}));
  assert.equal(a.claimed,true);
  assert.equal(b.claimed,false);
  assert.equal(b.claimToken,null);
});
test('attempt records use parameterized SQL and token', async () => {
  pg.Pool.prototype.query = async (sql,params) => {
    assert.match(sql,/foothive_automation\\.record_attempt/);
    assert.equal(params[2],'whatsmcp');
    return {rows:[{recorded:true,duplicate:false}]};
  };
  const r=await request('record_attempt',{
    responseId:'response1',claimToken:'8b8c9954-1bd8-4f72-a3a5-15dd68f82d54',
    channel:'whatsmcp',outcome:'uncertain',idempotencyKey:'response1:whatsmcp:1'
  });
  assert.deepEqual(body(r),{recorded:true,duplicate:false});
});
test('completion returns milestone due only from SQL', async () => {
  pg.Pool.prototype.query = async () => ({rows:[{
    new_completion:true,completion_number:'20',health_check_due:true
  }]});
  const r=await request('complete',{responseId:'response1',
    claimToken:'8b8c9954-1bd8-4f72-a3a5-15dd68f82d54',state:'completed'});
  assert.equal(body(r).completionNumber,'20');
  assert.equal(body(r).healthCheckDue,true);
});
test('invalid health-check milestone rejected', async () => {
  const r=await request('finish_health_check',{milestoneNumber:19,
    leaseToken:'8b8c9954-1bd8-4f72-a3a5-15dd68f82d54',status:'passed'});
  assert.equal(r.statusCode,400);
});
test('database failures do not leak connection strings', async () => {
  pg.Pool.prototype.query = async () => {throw Object.assign(new Error('secret connection string'),{code:'08006'});};
  const r=await request('claim',{responseId:'response1',email:'visitor@example.org'});
  assert.equal(r.statusCode,503);
  assert.equal(r.body.includes('secret'),false);
});
