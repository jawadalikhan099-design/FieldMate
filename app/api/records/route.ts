import {getDb} from '../../../db';
import {records} from '../../../db/schema';
import {and,eq} from 'drizzle-orm';
import {getFieldMateUser} from '../../fieldmate-auth';
import {accountScope,scopedRecordId} from '../../../lib/account-scope';
export const dynamic='force-dynamic';
const options={headers:{'Cache-Control':'private, no-store'}};
const kinds=['Sales','Customers','Areas','Expenses','Targets','Visits','SalesPlans','Incentive','AreaSales','PSP Drs','Salary','MonthlyExpenses','ExpenseRoutes'];
async function scope(){return accountScope(await getFieldMateUser());}
export async function GET(){const ownerId=await scope();if(!ownerId)return Response.json({error:'Sign in required'},{status:401,...options});try{const rows=await getDb().select().from(records).where(eq(records.ownerId,ownerId));return Response.json(rows.map(({ownerId,...r})=>r),options);}catch{return Response.json({error:'Unable to load records'},{status:500,...options});}}
export async function POST(req:Request){const ownerId=await scope();if(!ownerId)return Response.json({error:'Sign in required'},{status:401,...options});try{const b:any=await req.json();if(!kinds.includes(b.kind)||!b.data||typeof b.data!=='object'||Array.isArray(b.data)||(b.id!==undefined&&(typeof b.id!=='string'||b.id.length>2000)))return Response.json({error:'Invalid record'},{status:400,...options});const db=getDb();const requested=b.id||crypto.randomUUID();const existing=await db.select().from(records).where(and(eq(records.ownerId,ownerId),eq(records.id,requested))).limit(1);const id=existing[0]?.id||scopedRecordId(ownerId,requested);await db.insert(records).values({id,ownerId,kind:b.kind,data:JSON.stringify(b.data)}).onConflictDoUpdate({target:records.id,set:{data:JSON.stringify(b.data)},setWhere:eq(records.ownerId,ownerId)});return Response.json({id},options);}catch{return Response.json({error:'Unable to save'},{status:500,...options});}}
export async function DELETE(req:Request){const ownerId=await scope();if(!ownerId)return Response.json({error:'Sign in required'},{status:401,...options});const requested=new URL(req.url).searchParams.get('id');if(!requested)return Response.json({error:'Missing id'},{status:400,...options});const db=getDb();await db.delete(records).where(and(eq(records.ownerId,ownerId),eq(records.id,requested)));return Response.json({ok:true},options);}
