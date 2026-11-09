import {database} from './database';
export async function isAdmin(user:{userId:string,email:string}|null){if(!user)return false;try{return (await database('fm_admins','select=user_id&user_id=eq.'+encodeURIComponent(user.userId))).length===1;}catch{return false;}}
export function pakistanDay(now=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Karachi',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);}
