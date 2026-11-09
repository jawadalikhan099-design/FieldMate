import {ownerId} from '../app/fieldmate-auth';
export function isAdmin(user:{userId:string,email:string}|null){return !!user&&!!ownerId()&&user.userId===ownerId();}
export function pakistanDay(now=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Karachi',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);}
