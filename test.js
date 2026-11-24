import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {ElHydroClient, ElHydroApiError, API_BASE} from './index.js';
const json = (body, status=200, extra={}) => new Response(JSON.stringify(body), {status, headers:{'content-type':'application/json', ...extra}});
for (const route of ['prices','travel','hours','company','services','health']) test(route, async()=>{
  const client=new ElHydroClient({fetchImpl:async(url, options)=>{
    assert.equal(url.href,API_BASE+route); assert.equal(options.method,'GET'); assert.equal(options.credentials,'omit'); assert.equal(options.redirect,'error'); return json({route});
  }}); assert.deepEqual(await client[route](),{route});
});
test('search encodes params',async()=>{
  const client=new ElHydroClient({fetchImpl:async url=>{ assert.equal(url.pathname,'/wp-json/elh-agent/v1/search'); assert.equal(url.searchParams.get('q'),'woda & zawór'); assert.equal(url.searchParams.get('limit'),'5'); return json({wyniki:[]}); }});
  assert.deepEqual(await client.search('woda & zawór',{limit:5}),{wyniki:[]});
});
test('invalid searches do not fetch',()=>{const c=new ElHydroClient({fetchImpl:()=>assert.fail('fetch called')}); for(const q of ['',null,'---','ą'.repeat(61)]) assert.throws(()=>c.search(q)); for(const limit of [0,31,1.2,'5']) assert.throws(()=>c.search('woda',{limit}));});
for(const status of [400,404,429,503]) test(`JSON error ${status}`, async()=>{const c=new ElHydroClient({fetchImpl:async()=>json({code:'example',message:'test'},status,{'retry-after':'5'})});await assert.rejects(c.health(),e=>e instanceof ElHydroApiError && e.status===status && e.code==='example' && e.retryAfter==='5');});
test('HTML error',async()=>{const c=new ElHydroClient({fetchImpl:async()=>new Response('<html>',{status:502,headers:{'content-type':'text/html'}})});await assert.rejects(c.health(),{code:'invalid_response',status:502});});
test('network error',async()=>{const c=new ElHydroClient({fetchImpl:async()=>{throw new Error('offline')}});await assert.rejects(c.health(),{code:'network_error'});});
test('timeout',async()=>{const c=new ElHydroClient({timeoutMs:5,fetchImpl:async(u,{signal})=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>resolve(json({})),100);signal.addEventListener('abort',()=>{clearTimeout(timer);reject(signal.reason)},{once:true});})});await assert.rejects(c.health(),{code:'timeout'});});
test('CLI help',()=>{const r=spawnSync(process.execPath,['cli.js','--help'],{encoding:'utf8'});assert.equal(r.status,0);assert.match(r.stdout,/search/);});
test('CLI invalid command',()=>{const r=spawnSync(process.execPath,['cli.js','bogus'],{encoding:'utf8'});assert.equal(r.status,1);assert.equal(JSON.parse(r.stderr).code,'invalid_arguments');});
