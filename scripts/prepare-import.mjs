// Converts a private exported backup into SQL; never runs a remote write automatically.
import fs from 'node:fs';
const [backup,userId,output]=process.argv.slice(2);
if(!backup||!output||!/^[-a-zA-Z0-9]{20,100}$/.test(userId||''))throw Error('Usage: node scripts/prepare-import.mjs PRIVATE_BACKUP.json VERIFIED_OWNER_UUID private-import.sql');
const rows=JSON.parse(fs.readFileSync(backup,'utf8'));if(!Array.isArray(rows)||rows.length>100000)throw Error('Invalid backup');
const allowed=['Sales','Customers','Areas','Expenses','Targets','Visits','SalesPlans','Incentive','AreaSales','PSP Drs','Salary','MonthlyExpenses','ExpenseRoutes'];const q=s=>"'"+String(s).replaceAll("'","''")+"'";
let sql='-- Private data: do not publish this file. Existing matching records are retained.\n';
for(const r of rows){if(typeof r.id!=='string'||!allowed.includes(r.kind)||!r.data)throw Error('Invalid record');const data=typeof r.data==='string'?JSON.parse(r.data):r.data;if(!data||typeof data!=='object'||Array.isArray(data))throw Error('Invalid data');const id='user-record:'+encodeURIComponent(userId)+':'+encodeURIComponent(r.id);sql+=`INSERT OR IGNORE INTO records (id,owner_id,kind,data) VALUES (${q(id)},${q(userId)},${q(r.kind)},${q(JSON.stringify(data))});\n`;}
fs.writeFileSync(output,sql,{mode:0o600});console.log('Prepared '+rows.length+' records. Import into the NEW independent database only.');
