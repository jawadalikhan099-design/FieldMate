// Administrative provisioning only. Never ship a service-role key to the browser.
import {readFileSync} from 'node:fs';
const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
if(!url||!key)throw Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your local shell.');
const {email,password,name}=JSON.parse(readFileSync(0,'utf8'));
if(typeof email!=='string'||!email.includes('@')||typeof password!=='string'||password.length<12||password.length>128)throw Error('Provide a valid email and a 12–128 character password via stdin.');
const r=await fetch(new URL('/auth/v1/admin/users',url),{method:'POST',headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({email,password,email_confirm:true,user_metadata:{full_name:name||email}})});
if(!r.ok)throw Error('User creation failed (HTTP '+r.status+').');const u=await r.json();console.log(JSON.stringify({id:u.id,email:u.email}));
