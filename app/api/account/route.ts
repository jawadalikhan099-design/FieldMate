import {getFieldMateUser} from '../../fieldmate-auth';
import {isAdmin,pakistanDay} from '../../../lib/admin';
import {database,filter} from '../../../lib/database';
export const dynamic='force-dynamic';
export async function GET(){const user=await getFieldMateUser();const options={headers:{'Cache-Control':'private, no-store'}};if(!user)return Response.json({error:'Sign in required'},{status:401,...options});try{await database('rpc/fm_touch_account','','POST',{});return Response.json({name:user.fullName||user.email,email:user.email,original:false,isAdmin:await isAdmin(user)},options);}catch{return Response.json({error:'Unable to record account activity'},{status:503,...options});}}
