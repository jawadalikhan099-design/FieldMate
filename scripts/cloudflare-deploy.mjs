// Run from Cloudflare Workers Builds or a locally authenticated Wrangler session.
// Creates or reuses only this project's D1 database; never resets existing data.
import {spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
const cli='node_modules/wrangler/bin/wrangler.js';
function run(args,capture=false){const r=spawnSync(process.execPath,[cli,...args],{encoding:'utf8',stdio:capture?['ignore','pipe','inherit']:'inherit'});if(r.error)throw r.error;if(r.status!==0)throw Error('Cloudflare step failed: '+args.slice(0,2).join(' '));return r.stdout;}
function ensureDatabase(){const config=JSON.parse(readFileSync('wrangler.jsonc','utf8'));const binding=config.d1_databases?.find(x=>x.binding==='DB');if(!binding)throw Error('DB binding is missing');if(binding.database_id!=='00000000-0000-4000-8000-000000000000')return;const raw=run(['d1','list','--json','--config','wrangler.jsonc'],true);const databases=JSON.parse(raw);const existing=databases.filter(d=>d.name===binding.database_name);if(existing.length>1)throw Error('More than one matching database; select the intended database manually.');if(existing.length===1){if(!/^[0-9a-f-]{36}$/i.test(existing[0].uuid))throw Error('Unexpected database identifier');binding.database_id=existing[0].uuid;writeFileSync('wrangler.jsonc',JSON.stringify(config,null,2)+'\n');return;}run(['d1','create',binding.database_name,'--binding','DB','--update-config','--config','wrangler.jsonc']);}
ensureDatabase();
run(['d1','migrations','apply','fieldmate','--remote','--config','wrangler.jsonc']);
const build=spawnSync(process.execPath,['node_modules/vite/bin/vite.js','build'],{stdio:'inherit'});if(build.status!==0)throw Error('Production build failed; no Worker was deployed.');
run(['deploy','--config','dist/server/wrangler.json','--keep-vars']);
console.log('Deployment command finished. Verify the actual returned URL and complete the sign-in checks before sharing it.');
