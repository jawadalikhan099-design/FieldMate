const areaMap:Record<string,string>={'Charbagh+Manglor':'Charbagh','K.Khela':'Khwaza khela','Madyan':'Madyan','Mingora':'Mingora','Puran':'Puran','Saidu':'Saidu'};
const names:Record<string,string>={'INDOFER 120ML SYP':'INDOFER SYP 120ML'};
const productNames=['CANTER 125mg SYP','CANTER 250mg TAB','CANTER 500mg TAB','CANTER DS 250mg SYP','INDOFER SYP 120ML','DYCLO-P 50mg TAB','EXEF 1g INJ','EXEF 250mg INJ','EXEF 500mg INJ','FLATOX INFUSION','OFLOX 200mg TAB','OFLOX 400mg TAB','PARABAC 1g INJ','PARABAC 2g INJ','PARABAC 500mg INJ'];
const canonical=(name:string)=>{const key=names[name.toUpperCase()]||name.toUpperCase();return productNames.find(p=>p.toUpperCase()===key)||name;};
export function linkAreaSales(rows:any[]){const result=rows.map(r=>({...r,data:{...r.data}}));for(const sheet of rows.filter(r=>r.kind==='AreaSales')){
 const month=sheet.data.Month;const products=sheet.data.Products||[];
 for(const area of ['All areas',...Object.values(areaMap)]){
  if(area!=='All areas'&&!result.some(r=>r.kind==='Areas'&&r.data.Name===area))result.push({id:'linked-area:'+area,kind:'Areas',data:{Name:area}});
  const existing=result.filter(r=>r.kind==='SalesPlans'&&r.data.Month===month&&r.data.Area===area);
  // A saved area sheet is the source of sales, including blank/zero cells.
  for(const r of existing){r.data.Sales='0';r.data.SalesSource='Area Sales';}
  for(const p of products){const product=canonical(p.Name);const sale=Object.entries(p.Units||{}).reduce((sum,[column,units])=>sum+(area==='All areas'||areaMap[column]===area?Number(units||0):0),0);
   const prior=existing.find(r=>canonical(r.data.Product)===product);
   if(prior){prior.data.Sales=String(sale);prior.data.Price=String(p.Price??prior.data.Price??'');}
   else result.push({id:'sheet:'+encodeURIComponent(month+':'+area+':'+product),kind:'SalesPlans',data:{Product:product,Price:String(p.Price??''),Target:'',Sales:String(sale),SalesSource:'Area Sales',Month:month,Area:area,Date:month+'-01'}});
  }
 }
}return result;}
