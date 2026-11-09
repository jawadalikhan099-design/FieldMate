import {getFieldMateUser} from '../../fieldmate-auth';
import {accountScope} from '../../../lib/account-scope';
import {isAdmin,pakistanDay} from '../../../lib/admin';
import {getDb} from '../../../db';
import {members,memberDays} from '../../../db/schema';
export const dynamic='force-dynamic';
export async function GET(){const user=await getFieldMateUser();const options={headers:{'Cache-Control':'private, no-store'}};if(!user)return Response.json({error:'Sign in required'},{status:401,...options});const now=new Date().toISOString();try{const db=getDb();await db.insert(members).values({id:user.userId,email:user.email,name:user.fullName||user.email,firstSeen:now,lastSeen:now}).onConflictDoUpdate({target:members.id,set:{email:user.email,name:user.fullName||user.email,lastSeen:now}});const day=pakistanDay();await db.insert(memberDays).values({id:user.userId+':'+day,memberId:user.userId,day}).onConflictDoNothing();}catch{return Response.json({error:'Unable to record account activity'},{status:503,...options});}return Response.json({name:user.fullName||user.email,email:user.email,original:false,isAdmin:isAdmin(user)},options);}
