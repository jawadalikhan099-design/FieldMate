import {accessToken} from '../app/fieldmate-auth';
export async function database(table:string,query='',method='GET',body?:unknown,prefer?:string){
 const token=await accessToken();if(!token)throw Error('Sign in required');
 const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key)throw Error('Database is not configured');
 const response=await fetch(url+'/rest/v1/'+table+(query?'?'+query:''),{method,headers:{apikey:key,Authorization:'Bearer '+token,'Content-Type':'application/json',...(prefer?{Prefer:prefer}:{})},...(body===undefined?{}:{body:JSON.stringify(body)}),cache:'no-store'});
 if(!response.ok)throw Error('Database request failed: '+response.status);
 return response.status===204?null:response.text().then(s=>s?JSON.parse(s):null);
}
export const filter=(value:string)=>encodeURIComponent(value);
export function sameOrigin(req:Request){return req.headers.get('origin')===new URL(req.url).origin;}
