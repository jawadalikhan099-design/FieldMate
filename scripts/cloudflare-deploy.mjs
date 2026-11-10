// Supabase stores all independent account data; no D1 provisioning is required.
import {spawnSync} from 'node:child_process';
for(const args of [['node_modules/vinext/dist/cli.js','build'],['node_modules/wrangler/bin/wrangler.js','deploy','--config','dist/server/wrangler.json','--keep-vars']]){
 const result=spawnSync(process.execPath,args,{stdio:'inherit'});
 if(result.error)throw result.error;
 if(result.status!==0)process.exit(result.status||1);
}
