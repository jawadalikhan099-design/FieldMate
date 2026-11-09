import fs from 'node:fs';import ts from 'typescript';import assert from 'node:assert/strict';
const scope=fs.readFileSync('lib/account-scope.ts','utf8');const admin=fs.readFileSync('lib/admin.ts','utf8').replace(/^import .*;\n/gm,'');const source=fs.readFileSync('app/api/admin/route.ts','utf8').replace(/^import .*;\n/gm,'');
const harness=`
let user=null;let inserted=[];let deleted=[];
const members='members',memberDays='days',subscriptions='payments';
const eq=(k,v)=>true;const gte=(k,v)=>true;
const getFieldMateUser=async()=>user;const ownerId=()=> 'owner';
const getDb=()=>({
 select:()=>({from:(table)=>{const rows=table==='members'?[{id:'member-1'}]:[];return {then:(ok)=>Promise.resolve(rows).then(ok),where:()=>({then:ok=>Promise.resolve(rows).then(ok),limit:async()=>rows})}}}),
 insert:()=>({values:async row=>inserted.push(row)}),
 delete:()=>({where:async()=>deleted.push(true)})
});
export function identity(u){user=u}
export function inspect(){return {inserted,deleted}}
`;
const api=await import('data:text/javascript;base64,'+Buffer.from(ts.transpile([scope,admin,harness,source].join('\n'),{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022})).toString('base64'));
const body={memberId:'member-1',paidOn:'2026-11-09',starts:'2026-11-09',ends:'2026-12-09',amount:1000,note:'Demo reference'};const post=b=>api.POST(new Request('https://test/api/admin',{method:'POST',body:JSON.stringify(b)}));
for(const user of [null,{userId:'visitor',email:'visitor@example.test'}]){api.identity(user);assert.equal((await api.GET()).status,403);assert.equal((await post(body)).status,403);assert.equal((await api.DELETE(new Request('https://test/api/admin?id=other'))).status,403)}
assert.deepEqual(api.inspect(),{inserted:[],deleted:[]});api.identity({userId:'owner',email:'owner@example.test'});assert.equal((await api.GET()).status,200);for(const bad of [null,{...body,amount:-10},{...body,ends:body.starts},{...body,starts:'2026-02-30'},{...body,note:'x'.repeat(501)}])assert.equal((await post(bad)).status,400);assert.equal((await post(body)).status,200);assert.equal(api.inspect().inserted[0].amount,'1000');assert.equal(api.inspect().inserted.length,1);assert.equal(api.pakistanDay(new Date('2026-11-08T20:00:00Z')),'2026-11-09');console.log('PASS: non-admin reads and mutations denied; valid payments persisted; invalid input rejected; Pakistan day boundary verified.');
