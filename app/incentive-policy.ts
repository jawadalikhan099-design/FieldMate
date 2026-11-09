export const policy = [
{product:'CANTER 125mg SYP',name:'Canter 125mg / 5ml Susp.',tp:363.8,rates:[3,6.65,7.5,9.5,10.45]},
{product:'CANTER 250mg TAB',name:'Canter 250mg Tab.',tp:382.5,rates:[3.05,6.09,7,9,10]},
{product:'CANTER 500mg TAB',name:'Canter 500mg Tab.',tp:612,rates:[5,10.01,11.44,15,16.5]},
{product:'CANTER DS 250mg SYP',name:'Canter DS 250mg / 5ml Susp.',tp:593.3,rates:[5.25,10.5,12,15.25,16.5]},
{product:'PARABAC 500mg INJ',name:'Parabac 500mg',tp:212.5,rates:[5,8,10,13,17]},
{product:'DYCLO-P 50mg TAB',name:'Dyclo-P 50mg Tab.',tp:227.8,rates:[0,4.55,5.2,6.5,7.15]},
{product:'EXEF 1g INJ',name:'Exef 1g Inj.',tp:250.75,rates:[2.5,5.2,5.7,7.1,7.85]},
{product:'EXEF 250mg INJ',name:'Exef 250mg Inj.',tp:108.8,rates:[0,2.45,2.8,3.5,4]},
{product:'EXEF 500mg INJ',name:'Exef 500mg Inj.',tp:154.38,rates:[0,3.5,4,5,5.5]},
{product:'FLATOX INFUSION',name:'Flatox Infusion',tp:153.84,rates:[0,2.8,3.2,4,4.4]},
{product:'INDOFER SYP 120ML',name:'Indofer Syp 120ml',tp:250.75,rates:[22,null,null,null,22]},
{product:'OFLOX 200mg TAB',name:'Oflox 200mg Tab.',tp:209.95,rates:[0,1.4,1.6,2,2.2]},
{product:'OFLOX 400mg TAB',name:'Oflox 400mg Tab.',tp:234.6,rates:[0,1.4,1.6,2,2.2]},
{product:'PARABAC 1g INJ',name:'Parabac 1gm',tp:362.1,rates:[3.15,6.3,7.2,12,14.5]},
{product:'PARABAC 2g INJ',name:'Parabac 2gm',tp:484.5,rates:[5,9,10,14,15]}
];
export const slabLabels=['0–79.99%','80–89.99%','90–99.99%','100–104.99%','105% & above'];
export function calculate(target:number,sales:number,rates:(number|null)[]){if(target<=0)return {achievement:null,slab:null,rate:null,amount:null};const achievement=sales/target*100;const slab=achievement>=105?4:achievement>=100?3:achievement>=90?2:achievement>=80?1:0;const rate=rates[slab];return {achievement,slab,rate,amount:rate===null?null:rate*sales};}
