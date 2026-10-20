(()=>{'use strict';const KEY='percorso_salute_locale_v1';const $=id=>document.getElementById(id);const date=()=>new Date().toLocaleDateString('sv-SE');const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const base=()=>({version:1,weight:77,waist:88,water:{},meals:[],health:[],activities:[]});let data;try{data={...base(),...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch(e){data=base()}const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(data));$('message').textContent='Salvato su questo dispositivo.'}catch(e){$('message').textContent='Impossibile salvare. Esporta un backup e controlla lo spazio disponibile.'}};const workout=[['Lunedì','Camminata veloce · 35 minuti'],['Martedì','Forza leggera · 20 minuti'],['Mercoledì','Passeggiata · 15 minuti'],['Giovedì','Camminata veloce · 40 minuti'],['Venerdì','Forza leggera · 20 minuti'],['Sabato','Passeggiata · 45 minuti'],['Domenica','Recupero']];const DAYS=['Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato','Domenica'];
const TYPES=['Colazione','Spuntino','Pranzo','Merenda','Cena'];
const HOME=[
['Yogurt bianco senza lattosio 170 g, avena 40 g, 1 kiwi','1 kiwi e 15 g mandorle','Riso basmati 80 g (crudo), pollo 150 g, zucchine cotte 200 g, olio EVO 10 g','Yogurt senza lattosio 125 g e 2 gallette','Merluzzo 180 g, patate 220 g, carote cotte 200 g, olio EVO 10 g'],
['Pane 70 g, 2 uova, 1 kiwi','1 kiwi e 15 g noci','Pane 90 g con pollo grigliato 140 g e zucchine cotte','Yogurt senza lattosio 125 g e 15 g mandorle','Salmone 150 g, riso 70 g (crudo), carote cotte 200 g'],
['Yogurt senza lattosio 170 g, avena 40 g, 1 kiwi','1 kiwi e 15 g mandorle','Pasta 80 g (cruda) con tonno al naturale 100 g e zucchine 200 g','Yogurt senza lattosio 125 g e pane 40 g','Tacchino 160 g, patate 220 g, carote cotte 200 g'],
['Pane 70 g, ricotta senza lattosio 100 g, 1 kiwi','1 kiwi e 15 g noci','Riso 80 g (crudo), tacchino 150 g, carote cotte 200 g','Yogurt senza lattosio 125 g e 2 gallette','Orata 180 g, patate 220 g, zucchine cotte 200 g'],
['Yogurt senza lattosio 170 g, avena 40 g, 1 kiwi','1 kiwi e 2 gallette','Pane 90 g con pollo grigliato 140 g e zucchine cotte','Yogurt senza lattosio 125 g e 15 g noci','Pasta 80 g (cruda), pesce bianco 150 g, zucchine 200 g'],
['Pane 70 g, 2 uova, 1 kiwi','1 kiwi e 15 g mandorle','Riso 80 g (crudo), pollo 150 g, zucchine cotte 200 g','Yogurt senza lattosio 125 g e 2 gallette','Trota 180 g, patate 220 g, carote cotte 200 g'],
['Yogurt senza lattosio 170 g, avena 40 g, 1 kiwi','1 kiwi e 2 gallette','Pasta 80 g (cruda), tacchino 150 g e carote cotte 200 g','Yogurt senza lattosio 125 g e 15 g mandorle','Pesce bianco 180 g, riso 70 g (crudo), zucchine cotte 200 g']];
const OUT={
trattoria:['Yogurt bianco e pane tostato, 1 frutto tollerato','Frutta tollerata e piccola porzione di frutta secca','Pollo o pesce alla griglia 150–180 g, patate 200 g o riso semplice, verdure cotte e condimento a parte','Yogurt senza lattosio o frutta tollerata','Pesce o carne bianca 150–180 g, contorno di verdure cotte, pane 60–80 g'],
bar:['Yogurt senza lattosio e pane tostato, 1 frutto tollerato','Banana piccola o frutta tollerata','Panino 90–110 g con pollo o tacchino 120–150 g, senza salse; acqua naturale','Yogurt senza lattosio o frutta tollerata','Piatto semplice con proteine e contorno cotto; se non disponibile, panino non farcito con salse'],
autogrill:['Yogurt bianco e pane o fette biscottate','Frutta tollerata e 15 g mandorle','Panino semplice con pollo o tacchino; in alternativa riso semplice e proteine disponibili, acqua naturale','Yogurt senza lattosio o frutta tollerata','Secondo semplice con patate o riso e verdure cotte, se disponibili']};
const dow=()=>{const d=new Date().getDay();return (d+6)%7};
const plannedDate=index=>{const now=new Date(),offset=index-dow();now.setDate(now.getDate()+offset);return now.toLocaleDateString('sv-SE')};
const prefs=()=>{if(!data.plan||typeof data.plan!=='object')data.plan={};return data.plan};
const prefFor=i=>{const key=plannedDate(i);if(!prefs()[key])prefs()[key]={mode:'casa',place:'trattoria',overrides:{}};return prefs()[key]};
function planText(i,t){const p=prefFor(i),m=p.overrides[t]||p.mode;return m==='casa'?HOME[i][t]:OUT[p.place][t]}
// Valori calorici approssimativi per i menu proposti; non sono misurazioni nutrizionali.
const KCAL_HOME=[
[390,145,590,170,530],
[420,160,540,180,610],
[390,145,570,200,540],
[410,160,590,170,520],
[390,130,540,180,550],
[420,145,590,170,540],
[390,130,570,180,540]
];
const KCAL_OUT={
trattoria:[350,150,600,150,570],
bar:[350,110,550,150,520],
autogrill:[360,150,570,150,580]
};
function menuKcal(i,t){
 const p=prefFor(i),mode=p.overrides[t]||p.mode;
 return mode==='casa'?KCAL_HOME[i][t]:(KCAL_OUT[p.place]||KCAL_OUT.trattoria)[t];
}

 // Versione 3.2: migrazione conservativa dei pasti programmati senza stima.
 // Le calorie sono approssimazioni, non misurazioni delle porzioni consumate.
 function weekdayIndex(iso){const d=new Date(String(iso)+'T12:00:00');return Number.isNaN(d.getTime())?-1:(d.getDay()+6)%7}
 function estimateHistoricalMeal(m){
  if(!m||m.planFollowed!==true||m.calories!==null&&m.calories!==undefined&&m.calories!==''||!m.date)return null;
  const i=weekdayIndex(m.date),t=TYPES.indexOf(m.type);if(i<0||t<0)return null;
  const desc=String(m.text||'').trim();
  if(desc===HOME[i][t])return KCAL_HOME[i][t];
  const choices=Object.keys(OUT).filter(place=>OUT[place][t]===desc);
  if(choices.length){const amounts=[...new Set(choices.map(place=>KCAL_OUT[place][t]))];if(amounts.length===1)return amounts[0];
   if(m.place&&choices.includes(m.place))return KCAL_OUT[m.place][t];}
  return null;
 }
 function migrateEstimates(){let count=0;data.meals.forEach(m=>{const kcal=estimateHistoricalMeal(m);if(kcal!==null){m.calories=kcal;m.calorieEstimate=true;m.estimateRecovered=true;count++}});if(count)save();return count}
 function editMealCalories(index){const m=data.meals[index];if(!m)return;const current=m.calories===null||m.calories===undefined?'':String(m.calories);const response=prompt('Calorie del pasto (kcal). Inserisci una stima, oppure lascia vuoto per indicare che non è disponibile:',current);if(response===null)return;const val=response.trim().replace(',','.');if(val!==''&&(!Number.isFinite(Number(val))||Number(val)<0||Number(val)>5000)){alert('Inserisci un valore valido tra 0 e 5000 kcal.');return}m.calories=val===''?null:Number(val);m.calorieEstimate=val!=='';m.estimateRecovered=false;save();render();showMenu()}
function showMenu(){const i=$('day').selectedIndex,p=prefFor(i);$('dayMode').value=p.mode;$('outType').value=p.place;
 $('menu').innerHTML=TYPES.map((type,t)=>{const mode=p.overrides[t]||p.mode,description=planText(i,t),kcal=menuKcal(i,t);const matched=data.meals.some(m=>m.date===plannedDate(i)&&m.type===type&&m.planFollowed===true);return '<div class="meal-card"><h3>'+type+'</h3><label>Per questo pasto<select data-mode="'+t+'"><option value="casa" '+(mode==='casa'?'selected':'')+'>A casa</option><option value="fuori" '+(mode==='fuori'?'selected':'')+'>In trasferta</option></select></label><p>'+escape(description)+'</p><div class="small muted">Stima indicativa: circa '+kcal+' kcal (porzioni del menù)</div><div class="status">'+(matched?'✓ Menù seguito e registrato':'Non ancora registrato come seguito')+'</div><button class="secondary" data-follow="'+t+'" '+(matched?'disabled':'')+'>✓ Ho seguito questo menù</button></div>'}).join('');
 document.querySelectorAll('[data-mode]').forEach(el=>el.onchange=()=>{p.overrides[Number(el.dataset.mode)]=el.value;save();showMenu()});
 document.querySelectorAll('[data-follow]').forEach(el=>el.onclick=()=>{const t=Number(el.dataset.follow),day=plannedDate(i);if(!confirm('Registrare questo pasto come seguito per '+day+'?'))return;data.meals.push({date:day,type:TYPES[t],text:planText(i,t),calories:menuKcal(i,t),calorieEstimate:true,planFollowed:true,mode:p.overrides[t]||p.mode,place:p.place});save();render();showMenu()})}
function showOut(){showMenu()}
function showChart(){
 const box=$('weightChart'),note=$('weightChartNote');if(!box)return;
 const points=data.health.filter(v=>Number.isFinite(Number(v.weight))&&v.date).map(v=>({date:String(v.date),weight:Number(v.weight)})).slice(-20);
 if(!points.length){box.textContent='Registra il primo controllo nel Diario per visualizzare il grafico.';note.textContent='Obiettivo indicativo: 72 kg.';return}
 const vals=points.map(p=>p.weight).concat([72]),lo=Math.floor(Math.min(...vals)-1),hi=Math.ceil(Math.max(...vals)+1);
 const W=320,H=185,L=34,R=12,T=18,B=30;
 const x=i=>L+(points.length===1?(W-L-R)/2:i*(W-L-R)/(points.length-1));
 const y=v=>T+(hi-v)*(H-T-B)/(hi-lo);
 const path=points.map((p,i)=>x(i)+','+y(p.weight)).join(' ');
 const target=y(72);
 box.innerHTML='<svg class="weightline" viewBox="0 0 320 185" xmlns="http://www.w3.org/2000/svg">'+
 '<line x1="34" y1="'+target+'" x2="308" y2="'+target+'" stroke="#9fb7a8" stroke-dasharray="5 4"/>'+
 '<text x="36" y="'+Math.max(12,target-6)+'">Obiettivo 72 kg</text>'+
 '<polyline points="'+path+'" fill="none" stroke="#176b56" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'+
 points.map((p,i)=>'<circle cx="'+x(i)+'" cy="'+y(p.weight)+'" r="4" fill="#176b56"/>').join('')+
 '<text x="34" y="180">'+escape(points[0].date)+'</text><text x="230" y="180">'+escape(points[points.length-1].date)+'</text></svg>';
 note.textContent='Ultima rilevazione: '+points[points.length-1].weight+' kg ('+points[points.length-1].date+'). Le oscillazioni giornaliere sono normali.';
}
function render(){showChart();const week=DAYS.map((_,i)=>plannedDate(i));const followed=data.meals.filter(m=>week.includes(m.date)&&m.planFollowed===true);const el=$('planSummary');if(el)el.textContent='Pasti del menù registrati questa settimana: '+followed.length+' su 35. Puoi selezionare A casa o In trasferta per ogni pasto.';const today=date(),todayMeals=data.meals.filter(m=>m.date===today);$('headWeight').textContent=data.weight+' kg';$('headWaist').textContent=data.waist+' cm';$('countMeals').textContent=todayMeals.length;const known=todayMeals.filter(m=>m.calories!==null&&m.calories!==undefined&&Number.isFinite(Number(m.calories)));
const missing=todayMeals.length-known.length;
$('sumCal').textContent=known.reduce((s,m)=>s+Number(m.calories),0)+' kcal'+(missing?' · '+missing+' past'+(missing===1?'o':'i')+' senza stima':'');
 let breakdown=$('calorieBreakdown');if(!breakdown){breakdown=document.createElement('div');breakdown.id='calorieBreakdown';breakdown.className='small muted';$('sumCal').closest('.row')?.insertAdjacentElement('afterend',breakdown);if(!breakdown.parentElement)$('sumCal').parentElement.appendChild(breakdown)}
 breakdown.textContent=TYPES.filter(t=>todayMeals.some(m=>m.type===t)).map(t=>{const group=todayMeals.filter(m=>m.type===t),valid=group.filter(m=>m.calories!==null&&m.calories!==undefined&&m.calories!==''&&Number.isFinite(Number(m.calories)));return t+': '+(valid.length?valid.reduce((a,m)=>a+Number(m.calories),0)+' kcal':'stima mancante')+(group.length>valid.length&&valid.length?' (+ senza stima)':'')}).join(' · ');
$('waterCount').textContent=data.water[today]||0;$('doneMove').textContent=data.activities.length+'/7';$('weightProgress').style.width=Math.max(0,Math.min(100,(77-data.weight)/5*100))+'%';$('weight').value=data.weight;$('waist').value=data.waist;$('mealHistory').innerHTML=data.meals.map((m,index)=>({m,index})).slice(-15).reverse().map(({m,index})=>'<div class="row"><div><b>'+escape(m.type)+'</b><div class="small">'+escape(m.text)+'</div><div class="muted">'+escape(m.date)+(m.calories!==null&&m.calories!==undefined?' · '+escape(m.calories)+' kcal'+(m.calorieEstimate?' (stima)':''):' · senza stima')+'</div><button type="button" class="secondary" data-edit-calories="'+index+'" style="margin-top:6px">Modifica kcal</button></div></div>').join('');document.querySelectorAll('[data-edit-calories]').forEach(el=>el.onclick=()=>editMealCalories(Number(el.dataset.editCalories)));$('healthHistory').innerHTML=data.health.length?data.health.slice(-15).reverse().map(h=>'<div class="row"><div><b>'+escape(h.date)+' · '+h.weight+' kg</b><div class="small">Vita '+h.waist+' cm · Energia '+h.energy+'/5</div><div class="muted">'+escape(h.bloat)+' · '+escape(h.bowel)+'</div><div class="small">'+escape(h.notes)+'</div></div></div>').join(''):'Nessun controllo registrato.';$('activities').innerHTML=workout.map((w,i)=>'<label class="row"><span><b>'+w[0]+'</b><br><span class="muted">'+w[1]+'</span></span><input type="checkbox" data-activity="'+i+'" style="width:22px" '+(data.activities.includes(i)?'checked':'')+'></label>').join('');document.querySelectorAll('[data-activity]').forEach(el=>el.onchange=()=>{const i=Number(el.dataset.activity);data.activities=el.checked?[...new Set([...data.activities,i])]:data.activities.filter(n=>n!==i);save();render()})}document.querySelectorAll('[data-tab]').forEach(btn=>btn.onclick=()=>{document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b===btn));document.querySelectorAll('main>section').forEach(s=>s.classList.toggle('hide',s.id!==btn.dataset.tab))});$('day').selectedIndex=dow();$('day').onchange=showMenu;$('dayMode').onchange=()=>{const p=prefFor($('day').selectedIndex);p.mode=$('dayMode').value;p.overrides={};save();showMenu()};$('outType').onchange=()=>{prefFor($('day').selectedIndex).place=$('outType').value;save();showMenu()};$('addWater').onclick=()=>{data.water[date()]=Math.min(30,(data.water[date()]||0)+1);save();render()};$('mealForm').onsubmit=e=>{e.preventDefault();const raw=$('mealCalories').value;data.meals.push({date:date(),type:$('mealType').value,text:$('mealText').value.trim(),calories:raw===''?null:Number(raw)});save();e.target.reset();render()};$('healthForm').onsubmit=e=>{e.preventDefault();data.weight=Number($('weight').value);data.waist=Number($('waist').value);data.health.push({date:date(),weight:data.weight,waist:data.waist,energy:Number($('energy').value),bloat:$('bloat').value,bowel:$('bowel').value,notes:$('notes').value});save();render()};$('resetActivities').onclick=()=>{if(confirm('Azzerare le attività completate?')){data.activities=[];save();render()}};$('exportBackup').onclick=()=>{const blob=new Blob([JSON.stringify({...data,exportedAt:new Date().toISOString()},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='percorso-salute-backup-'+date()+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);$('message').textContent='Backup generato. Conserva il file in una posizione sicura.'};$('importBackup').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>5e6)throw Error('File troppo grande');const obj=JSON.parse(await file.text());if(obj.version!==1||!Array.isArray(obj.meals)||!Array.isArray(obj.health)||!Array.isArray(obj.activities)||typeof obj.water!=='object'||!Number.isFinite(Number(obj.weight))||!Number.isFinite(Number(obj.waist)))throw Error('Formato non valido');if(!confirm('Sostituire tutti i dati attuali con quelli del backup?'))return;data={...base(),weight:Number(obj.weight),waist:Number(obj.waist),water:obj.water,meals:obj.meals,health:obj.health,activities:obj.activities,plan:obj.plan&&typeof obj.plan==='object'?obj.plan:{}};save();render();showMenu();$('message').textContent='Backup ripristinato.'}catch(err){$('message').textContent='Ripristino non riuscito: '+err.message}finally{e.target.value=''}};$('clearAll').onclick=()=>{if(confirm('Eliminare DEFINITIVAMENTE tutti i dati salvati in questa app?')){data=base();save();render();showMenu()}};migrateEstimates();showMenu();render();if('serviceWorker'in navigator&&location.protocol==='https:')navigator.serviceWorker.register('./sw.js').catch(()=>{});})();
