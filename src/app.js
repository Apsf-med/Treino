/* =====================================================================
   APP — Plano de Treino v3
   ===================================================================== */
/* ================= UTIL ================= */
function $(s){return document.querySelector(s)}
function $$(s){return document.querySelectorAll(s)}
var store={get:function(k,d){try{var v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}},
  set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},
  del:function(k){try{localStorage.removeItem(k)}catch(e){}}};
function pad(n){return String(n).padStart(2,"0")}
function today(){var d=new Date();return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())}
function dmy(iso){var p=iso.split("-");return p[2]+"/"+p[1]}
function fmt(s){s=Math.max(0,Math.ceil(s));var h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return (h?h+":"+pad(m):m)+":"+pad(x)}
function fmtShort(s){return s<60?s+" s":(s%60?Math.floor(s/60)+":"+pad(s%60):(s/60)+" min")}
function esc(t){return String(t==null?"":t).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function uid(){try{return crypto.randomUUID()}catch(e){return "id-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,10)}}
function vib(p){if(!store.get("soundOn",true))return;try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}}
var ac=null;
function ensureAudio(){if(!ac){try{ac=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(ac&&ac.state==="suspended")ac.resume().catch(function(){})}
function beep(f,d){if(!ac||!store.get("soundOn",true))return;try{var o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime;o.type="sine";o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.45,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+d+.05)}catch(e){}}
var wl=null;
function requestWake(){try{if("wakeLock" in navigator&&!wl&&!document.hidden){navigator.wakeLock.request("screen").then(function(l){wl=l;l.addEventListener("release",function(){wl=null})}).catch(function(){})}}catch(e){}}
var toastT;
function toast(m,ms){var t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove("show")},ms||2800)}
function confetti(){var cols=["#ff6b2c","#c6ff3d","#4cc9ff","#ffffff","#ff4d5e"];for(var i=0;i<60;i++){var c=document.createElement("i");c.className="cf";c.style.left=Math.random()*100+"vw";c.style.background=cols[i%cols.length];c.style.animationDuration=(1.8+Math.random()*1.8)+"s";c.style.animationDelay=Math.random()*.5+"s";document.body.appendChild(c);setTimeout(function(el){return function(){el.remove()}}(c),4200)}}
var DEVICE=store.get("device",null);if(!DEVICE){DEVICE=uid();store.set("device",DEVICE)}
var ONLINE_APP=location.protocol==="https:"||location.hostname==="localhost"||location.hostname==="127.0.0.1";

/* ================= 3D DECORATIVO (hero / AMRAP) ================= */
function scene3d(canvas,kind){
  if(!window.THREE||!canvas)return;
  var r;try{r=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:true})}catch(e){return}
  r.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  var sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(38,1,.1,100);cam.position.set(0,0,kind==="kb"?5.2:7);
  sc.add(new THREE.AmbientLight(0xffffff,.35));
  var l1=new THREE.PointLight(0xff6b2c,2.4,30);l1.position.set(4,3,5);sc.add(l1);
  var l2=new THREE.PointLight(0x4cc9ff,1.6,30);l2.position.set(-5,-2,4);sc.add(l2);
  var l3=new THREE.DirectionalLight(0xffffff,.7);l3.position.set(0,5,5);sc.add(l3);
  var metal=new THREE.MeshStandardMaterial({color:0xa9b2bd,metalness:.95,roughness:.22});
  var dark=new THREE.MeshStandardMaterial({color:0x1c2129,metalness:.6,roughness:.38});
  var accent=new THREE.MeshStandardMaterial({color:0xff6b2c,metalness:.45,roughness:.3});
  var g=new THREE.Group();
  function cyl(rt,h,m,x){var c=new THREE.Mesh(new THREE.CylinderGeometry(rt,rt,h,40),m);c.rotation.z=Math.PI/2;c.position.x=x||0;g.add(c);return c}
  if(kind==="dumbbell"){cyl(.1,2.9,metal);cyl(.13,1.1,dark);
    [[.86,.78,.22,dark],[1.09,.62,.2,accent],[1.29,.46,.16,dark]].forEach(function(p){[-1,1].forEach(function(s){cyl(p[1],p[2],p[3],p[0]*s)})});
    [-1,1].forEach(function(s){cyl(.18,.12,metal,.68*s)});
  }else{var body=new THREE.Mesh(new THREE.SphereGeometry(1,48,36),accent);body.scale.set(1,.93,1);g.add(body);
    var base=new THREE.Mesh(new THREE.CylinderGeometry(.62,.68,.16,40),dark);base.position.y=-.88;g.add(base);
    var handle=new THREE.Mesh(new THREE.TorusGeometry(.58,.13,24,60,Math.PI),dark);handle.position.y=.62;g.add(handle);
    [-1,1].forEach(function(s){var leg=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.3,20),dark);leg.position.set(.58*s,.5,0);g.add(leg)})}
  sc.add(g);
  var N=kind==="kb"?80:260,pos=new Float32Array(N*3);
  for(var i=0;i<N;i++){pos[i*3]=(Math.random()-.5)*14;pos[i*3+1]=(Math.random()-.5)*8;pos[i*3+2]=(Math.random()-.5)*6-1}
  var pg=new THREE.BufferGeometry();pg.setAttribute("position",new THREE.BufferAttribute(pos,3));
  var pts=new THREE.Points(pg,new THREE.PointsMaterial({color:0xc6ff3d,size:.04,transparent:true,opacity:.65}));sc.add(pts);
  var tx=0,ty=0,baseY=0,spin=0;
  window.addEventListener("pointermove",function(e){tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5},{passive:true});
  canvas.addEventListener("pointerdown",function(){spin=6});
  function size(){var w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();
    if(kind==="dumbbell"){var m=w<600;g.scale.setScalar(m?.72:1);g.position.x=m?.9:2.4;baseY=m?-.95:-.2}else{baseY=0}}
  size();window.addEventListener("resize",size);
  var vis=true;if("IntersectionObserver" in window){new IntersectionObserver(function(es){vis=es[0].isIntersecting}).observe(canvas)}
  var clock=new THREE.Clock();
  (function loop(){requestAnimationFrame(loop);if(!vis||!canvas.clientWidth||document.hidden)return;
    var dt=clock.getDelta(),t=clock.elapsedTime;spin*=.95;
    g.rotation.y+=dt*(.6+spin);g.rotation.x=Math.sin(t*.7)*.25+ty*.5;g.rotation.z=(kind==="dumbbell"?Math.sin(t*.5)*.15:0)+tx*.3;
    g.position.y=baseY+Math.sin(t*1.3)*.12;pts.rotation.y=t*.03;r.render(sc,cam)})();
}

/* ================= CICLO / SEMANA ================= */
function weekUI(){var s=store.get("cycle_start",null),b=$("#weekBox");
  var html;
  if(!s){html='<button class="chip" id="cycleBtn">📅 Iniciar ciclo hoje</button>'}
  else{var w=Math.floor((Date.now()-s)/(7*864e5))+1;
    html='<span class="chip">Semana '+w+' do ciclo</span>'+(w>=4?'<span class="chip warn">🔄 Deload sugerido (sem. 4–6)</span>':'')+'<button class="chip ghostchip" id="cycleBtn">↺ Novo ciclo</button>'}
  html+='<button class="chip ghostchip" id="appChip">🔔 App</button>';
  b.innerHTML=html;
  $("#cycleBtn").onclick=function(){if(s&&!confirm("Começar um novo ciclo a partir de hoje?"))return;store.set("cycle_start",Date.now());weekUI();toast("Ciclo iniciado 💪")};
  $("#appChip").onclick=function(){showTab("prog");setTimeout(function(){var c=$("#btnNotif");c&&c.scrollIntoView({behavior:"smooth",block:"center"})},150)}}

/* ================= EXERCÍCIOS: dados resolvidos ================= */
var DAYEX={};DAYS.forEach(function(d){(d.ex||[]).forEach(function(e){if(!DAYEX[e.a])DAYEX[e.a]=e})});
STATIONS.forEach(function(s){if(!DAYEX[s[2]])DAYEX[s[2]]={a:s[2],n:s[0],r:s[1],c:s[3],s:0,rest:0}});
/* info completa de um exercício (opcionalmente prescrito no lugar de "plan") */
function info(id,plan){var x=EXDB[id]||{},de=DAYEX[id]||{};plan=plan||de;
  var rest=plan.rest!=null?plan.rest:60;
  return {id:id,a:x.anim||id,n:x.n||de.n||id,m:x.m||[],eq:x.eq||"",pat:x.pat||"",c:x.c||de.c||"",
    s:plan.s!=null?plan.s:3,r:(plan===de?(de.r||x.r):(x.r||plan.r))||"8–12",rest:rest,rt:plan.rt||fmtShort(rest),bs:plan.bs}}
function subsFor(dk){return store.get("sub_"+today()+"_"+dk,{})}
function curEx(d,k){var e=d.ex[k],s=subsFor(d.key)[k];return s?Object.assign(info(s,e),{plan:e,alt:true}):Object.assign(info(e.a,e),{plan:e,alt:false})}
function restFor(d,k){var v=store.get("rc_"+d.key+"_"+k,null);if(v!=null)return v;var e=d.ex[k];return e.bs==="A"?0:e.rest}
function kgGet(d,k,id){var v=store.get("kg_"+id,null);if(v==null&&id===d.ex[k].a)v=store.get("kg_"+d.key+"_"+k,"");return v==null?"":v}

/* ================= HISTÓRICO ================= */
function hist(){return store.get("hist",[])}
function histAdd(e){var h=hist();h.push(e);if(h.length>4000)h=h.slice(-4000);store.set("hist",h);syncSoon()}
function histRemove(d,dk,k,set){var h=hist();for(var i=h.length-1;i>=0;i--){var x=h[i];if(x.d===d&&x.day===dk&&x.k===k&&x.set===set){h.splice(i,1);break}}store.set("hist",h)}
function exSessions(id){var by={};hist().forEach(function(x){if(x.done!==id)return;var s=by[x.d]||(by[x.d]={d:x.d,sets:0,kg:0});s.sets++;if(+x.kg>s.kg)s.kg=+x.kg});
  return Object.keys(by).sort().map(function(k){return by[k]})}
function spark(vals){if(vals.length<2)return "";var w=84,h=26,mx=Math.max.apply(null,vals),mn=Math.min.apply(null,vals),rg=mx-mn||1;
  var pts=vals.map(function(v,i){return (i*(w-4)/(vals.length-1)+2).toFixed(1)+","+(h-3-(v-mn)/rg*(h-6)).toFixed(1)}).join(" ");
  return '<svg width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'" aria-hidden="true"><polyline points="'+pts+'" fill="none" stroke="#c6ff3d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'}
function histHTML(id){var ss=exSessions(id);if(!ss.length)return '<div class="histline">📈 Sem histórico ainda — registre a carga e conclua as séries.</div>';
  var last=ss.slice(-3).reverse().map(function(s){return "<span>"+(s.d===today()?"hoje":dmy(s.d))+" • "+(s.kg?s.kg+" kg":"—")+" × "+s.sets+"</span>"}).join("");
  var vals=ss.slice(-8).map(function(s){return s.kg}).filter(function(v){return v>0});
  return '<div class="histline">'+spark(vals)+'<div class="hs">'+last+'</div></div>'}

/* ================= TREINO ================= */
var cur=0,readyEx=null;
var todayIdx=[6,0,1,2,3,4,5][new Date().getDay()];
function getChecks(k){return store.get("chk_"+today()+"_"+k,{})}
function setChecks(k,v){store.set("chk_"+today()+"_"+k,v)}
function doneCount(arr){return (arr||[]).filter(Boolean).length}
function renderDays(){$("#days").innerHTML=DAYS.map(function(d,i){return '<button class="day'+(i===todayIdx?" today":"")+'" data-day="'+i+'"><b>'+d.short+'</b><small>'+(i===todayIdx?"hoje":d.title.split(" ")[0])+'</small></button>'}).join("");
  $("#days").onclick=function(e){var b=e.target.closest("[data-day]");if(b){renderDay(+b.dataset.day);b.scrollIntoView({inline:"center",behavior:"smooth",block:"nearest"})}}}
function swHTML(){return '<div class="sw"><div class="swlbl">Sessão</div><div id="swTime">'+fmt(swNow()/1000)+'</div><div class="swbtns"><button id="swToggle" aria-label="Iniciar ou pausar sessão">'+(sw.running?"❚❚":"▶")+'</button><button id="swReset" aria-label="Zerar sessão">↺</button></div></div>'}
var PRESETS=[30,45,60,90,120,180];
function exHTML(d,k,done){
  var e=d.ex[k],x=curEx(d,k),full=doneCount(done)>=e.s,nd=doneCount(done),rs=restFor(d,k);
  var sets="";for(var s=0;s<e.s;s++)sets+='<button class="set'+(done[s]?" done":"")+'" data-set="'+k+"-"+s+'" aria-label="Série '+(s+1)+'">'+(s+1)+'</button>';
  var isReady=readyEx&&readyEx.day===d.key&&readyEx.k===k&&!full;
  var label=full?"✓ Exercício concluído":(e.bs==="A"&&rs===0?"✓ Concluir série "+(nd+1)+"/"+e.s+" → ir para o bi-set B":"✓ Concluir série "+(nd+1)+"/"+e.s+" e iniciar descanso");
  var chips=PRESETS.map(function(p){return '<button data-rc="'+k+'" data-sec="'+p+'"'+(p===rs?' class="on"':'')+'>'+fmtShort(p)+'</button>'}).join("");
  var custom=PRESETS.indexOf(rs)<0;
  return '<article class="ex'+(e.bs?" is-bs":"")+(full?" complete":"")+(x.alt?" subbed":"")+(isReady?" ready":"")+'" id="ex'+k+'" style="--i:'+k+'">'+
  '<button class="v3d" data-v="'+k+'" aria-label="Ver em 3D">🧍 3D</button>'+
  '<div class="exnum">'+pad(k+1)+'</div><div class="exbody">'+
  (e.bs?'<span class="bs">Bi-set '+e.bs+(e.bs==="A"?" → sem descanso":" → depois descansa")+'</span>':"")+
  (x.alt?'<div class="subban">🔁 Hoje no lugar de <b>'+esc(e.n)+'</b><button data-back="'+k+'">Voltar ao original</button></div>':"")+
  '<h3>'+esc(x.n)+' — '+e.s+' × '+esc(x.r)+'</h3>'+
  '<div class="meta"><span>'+e.s+' séries</span><span>'+esc(x.r)+' reps</span><span>⏱ '+(rs?fmtShort(rs):"0 s → próximo")+'</span><span>'+nd+'/'+e.s+' feitas</span></div>'+
  '<div class="mus">'+x.m.map(function(m){return "<span>"+esc(m)+"</span>"}).join("")+'</div>'+
  '<p class="cue">'+esc(x.c)+'</p><div class="sets">'+sets+'</div>'+
  '<div class="exfoot"><label class="kg">Carga <input type="number" inputmode="decimal" step="0.5" min="0" placeholder="—" value="'+esc(kgGet(d,k,x.id))+'" data-kg="'+k+'"> kg</label>'+
  '<button class="restbtn" data-rest="'+k+'">⏱ '+fmtShort(rs||60)+'</button></div>'+
  histHTML(x.id)+
  '<div class="restcfg"><span>Descanso:</span>'+chips+'<button data-rcc="'+k+'"'+(custom?' class="on"':'')+'>⚙️ '+(custom?fmtShort(rs):"Outro")+'</button>'+
  '<span class="cust" id="cust'+k+'"><input type="number" inputmode="numeric" min="0" max="900" placeholder="seg" id="custIn'+k+'"><button data-rcset="'+k+'">OK</button></span></div>'+
  '<button class="donebtn" data-done="'+k+'"'+(full?" disabled":"")+'>'+label+'</button>'+
  '<div class="exbtns"><button data-v="'+k+'">🧍 Ver 3D</button><button class="busy" data-busy="'+k+'">🚧 Aparelho ocupado</button></div>'+
  '</div></article>'}
function renderDay(i,keepScroll){
  cur=i;var d=DAYS[i],h;
  $$(".day").forEach(function(b,j){b.classList.toggle("on",j===i)});
  h='<div class="dayhead"><div><div class="dname">'+d.name+(i===todayIdx?" • hoje":"")+'</div><h2>'+d.title+'</h2></div>'+(d.ex?swHTML():"")+'</div>';
  if(d.ex){
    var st=getChecks(d.key);
    h+='<div class="prog"><div class="bar"><i id="progBar"></i></div><span id="progTxt"></span></div>';
    h+='<button class="v3dall" data-vall="1"><span class="fig">🧍</span><span><b>Ver o treino em 3D</b><small>O personagem demonstra os '+d.ex.length+' exercícios do dia</small></span></button>';
    h+='<div class="warm"><b>🔥 Aquecimento específico</b><p>'+d.warm+'</p></div>';
    h+='<div class="quick"><span>Descanso livre:</span>'+PRESETS.map(function(s){return '<button data-q="'+s+'">'+fmtShort(s)+'</button>'}).join("")+'</div>';
    d.ex.forEach(function(e,k){h+=exHTML(d,k,st[k]||[])});
    h+='<div class="tipbox">💡 '+d.tip+'</div>';
    if(d.amrap)h+='<div class="card cta"><div><b>⚡ AMRAP 20 min (opcional)</b><div class="mut" style="font-size:13px">Só se a técnica estiver boa.</div></div><button class="primary" data-go="amrap">Abrir</button></div>';
    h+='<button class="ghost" id="resetDay">Zerar séries de hoje</button>';
  }else if(d.sat){
    h+='<button class="v3dall" data-vamrap="1"><span class="fig">🧍</span><span><b>Ver o circuito em 3D</b><small>Barra, flexão, agachamento e mountain climber</small></span></button>';
    h+='<div class="card cta"><div><b>⚡ Circuito AMRAP 20 min</b><div class="mut" style="font-size:13px">Barra • Flexão • Agachamento • Mountain climber</div></div><button class="primary" data-go="amrap">Começar</button></div>';
    h+='<div class="card"><h3>🧘 Mobilidade e recuperação ativa</h3><ul class="clean"><li>Rotação torácica no chão — 2 × 10 por lado</li><li>90/90 de quadril — 2 × 8 por lado</li><li>Mobilidade de tornozelo na parede — 2 × 10 por lado</li><li>Alongamento de peitoral e dorsal — 2 × 30 s</li><li>Caminhada leve de 20–30 min, se quiser</li></ul></div>';
    h+='<div class="quick"><span>Timer livre:</span>'+PRESETS.map(function(s){return '<button data-q="'+s+'">'+fmtShort(s)+'</button>'}).join("")+'</div>';
  }else{
    h+='<div class="card rest-day"><div class="big">😴</div><h3 style="margin:8px 0">Dia de descanso</h3><p class="mut">O músculo cresce na recuperação, não durante o treino.</p></div>';
    h+='<div class="card"><h3>Checklist de recuperação</h3><ul class="clean"><li>Dormir 7–9 h</li><li>Bater a meta de proteína do dia</li><li>Água: 35–40 ml/kg</li><li>Caminhada leve opcional</li><li>Revisar as cargas da semana e planejar a progressão</li></ul></div>';
  }
  var y=window.scrollY;$("#dayView").innerHTML=h;updateProg();if(keepScroll)window.scrollTo(0,y);
}
function rerenderCard(k){var d=DAYS[cur];if(!d.ex)return;var el=$("#ex"+k);if(!el)return;var w=document.createElement("div");w.innerHTML=exHTML(d,k,getChecks(d.key)[k]||[]);var n=w.firstChild;n.style.animation="none";el.replaceWith(n)}
function updateProg(){var d=DAYS[cur];if(!d.ex)return false;var st=getChecks(d.key),tot=0,dn=0;
  d.ex.forEach(function(e,k){tot+=e.s;dn+=doneCount(st[k])});
  var b=$("#progBar");if(b){b.style.width=(100*dn/tot)+"%";$("#progTxt").textContent=dn+"/"+tot+" séries"}return dn===tot}
function nextLabel(d,k,st){var e=d.ex[k];
  if(e.bs==="B"){var a=d.ex[k-1],ad=doneCount(st[k-1]);if(ad<a.s)return {k:k-1,t:"Próximo: "+curEx(d,k-1).n+" — série "+(ad+1)+"/"+a.s+" (bi-set)"}}
  var ed=doneCount(st[k]);if(ed<e.s)return {k:k,t:"Próximo: "+curEx(d,k).n+" — série "+(ed+1)+"/"+e.s};
  for(var j=0;j<d.ex.length;j++){if(j!==k&&doneCount(st[j])<d.ex[j].s)return {k:j,t:"Próximo: "+curEx(d,j).n+" — série "+(doneCount(st[j])+1)+"/"+d.ex[j].s}}
  return {k:null,t:"Último descanso — falta pouco!"}}
function onSet(k,s){
  ensureAudio();var d=DAYS[cur],e=d.ex[k],st=getChecks(d.key);st[k]=st[k]||[];st[k][s]=!st[k][s];setChecks(d.key,st);
  var x=curEx(d,k);
  if(st[k][s]){var kgv=$('[data-kg="'+k+'"]');histAdd({ts:Date.now(),d:today(),day:d.key,k:k,plan:e.a,done:x.id,kg:kgv&&kgv.value!==""?+kgv.value:null,set:s+1})}
  else histRemove(today(),d.key,k,s+1);
  if(readyEx&&readyEx.day===d.key&&readyEx.k===k)readyEx=null;
  rerenderCard(k);
  var all=updateProg();if(!st[k][s])return;
  vib(30);if(!sw.running&&!sw.acc)swStart();
  if(all){rtSkip(true);swPause();sessionDone(d);confetti();beep(880,.15);setTimeout(function(){beep(1175,.3)},160);toast("🏆 Treino concluído em "+fmt(swNow()/1000)+"!");return}
  var rs=restFor(d,k);
  if(e.bs==="A"&&rs===0){var nx=d.ex[k+1];readyEx={day:d.key,k:k+1};rerenderCard(k+1);toast("⚡ Bi-set: sem descanso → "+curEx(d,k+1).n);beep(880,.08);
    var c=$("#ex"+(k+1));c&&c.scrollIntoView({behavior:"smooth",block:"center"});return}
  if(rs>0){var nl=nextLabel(d,k,st);startRest(rs,{label:x.n,next:nl.t,day:d.key,di:cur,k:nl.k})}
}
function onDone(k){var d=DAYS[cur],st=getChecks(d.key),arr=st[k]||[];for(var s=0;s<d.ex[k].s;s++){if(!arr[s]){onSet(k,s);return}}}
function sessionDone(d){var ss=store.get("sessions",[]);var st=getChecks(d.key);
  ss.push({d:today(),day:d.key,title:d.title,dur:Math.round(swNow()/1000),items:d.ex.map(function(e,k){var x=curEx(d,k);return {plan:e.a,done:x.id,sets:doneCount(st[k])}})});
  if(ss.length>400)ss=ss.slice(-400);store.set("sessions",ss);syncSoon(true)}
$("#dayView").addEventListener("click",function(e){
  var t=e.target.closest("button");if(!t)return;var d=DAYS[cur];
  if(t.dataset.v!=null){var list=d.ex.map(function(x,k){return curEx(d,k)});openViewer(list,+t.dataset.v,d.name)}
  else if(t.dataset.vall){openViewer(d.ex.map(function(x,k){return curEx(d,k)}),0,d.name)}
  else if(t.dataset.vamrap){openViewer(ST_EX,0,"Circuito AMRAP")}
  else if(t.dataset.set){var p=t.dataset.set.split("-");onSet(+p[0],+p[1])}
  else if(t.dataset.done!=null){onDone(+t.dataset.done)}
  else if(t.dataset.busy!=null){openAlts(+t.dataset.busy)}
  else if(t.dataset.back!=null){setSub(+t.dataset.back,null)}
  else if(t.dataset.rest!=null){var k=+t.dataset.rest,x=curEx(d,k);ensureAudio();startRest(restFor(d,k)||60,{label:x.n,next:nextLabel(d,k,getChecks(d.key)).t,day:d.key,di:cur,k:k})}
  else if(t.dataset.rc!=null){var k2=+t.dataset.rc;store.set("rc_"+d.key+"_"+k2,+t.dataset.sec);rerenderCard(k2);toast("Descanso de "+curEx(d,k2).n+": "+fmtShort(+t.dataset.sec))}
  else if(t.dataset.rcc!=null){var c=$("#cust"+t.dataset.rcc);c.classList.toggle("show");if(c.classList.contains("show"))$("#custIn"+t.dataset.rcc).focus()}
  else if(t.dataset.rcset!=null){var k3=+t.dataset.rcset,v=parseInt($("#custIn"+k3).value,10);if(isNaN(v)||v<0||v>900){toast("Digite um tempo entre 0 e 900 segundos");return}store.set("rc_"+d.key+"_"+k3,v);rerenderCard(k3);toast("Descanso personalizado: "+fmtShort(v))}
  else if(t.dataset.q){ensureAudio();startRest(+t.dataset.q,{label:"Timer livre",next:"",day:d.key,di:cur,k:null})}
  else if(t.dataset.go){showTab(t.dataset.go)}
  else if(t.id==="resetDay"){if(confirm("Zerar as séries marcadas hoje? (o histórico de cargas é mantido para as séries já registradas)")){setChecks(d.key,{});renderDay(cur,true)}}
  else if(t.id==="swToggle"){sw.running?swPause():swStart()}
  else if(t.id==="swReset"){swReset()}
});
$("#dayView").addEventListener("input",function(e){var i=e.target;if(i.dataset.kg!=null){var d=DAYS[cur],k=+i.dataset.kg;store.set("kg_"+curEx(d,k).id,i.value)}});
$("#dayView").addEventListener("keydown",function(e){if(e.key==="Enter"&&e.target.id&&e.target.id.indexOf("custIn")===0){var b=document.querySelector('[data-rcset="'+e.target.id.slice(6)+'"]');b&&b.click()}});

/* ================= ALTERNATIVAS ================= */
var ALT={k:null,list:[]};
function openAlts(k,stationId){
  var d=DAYS[cur],plan,origId,curId;
  if(stationId){origId=stationId;curId=stationId;plan=DAYEX[stationId];ALT.k=null}
  else{plan=d.ex[k];origId=plan.a;curId=curEx(d,k).id;ALT.k=k}
  var o=info(origId,plan),subs=(SUBS[origId]||[]).slice().sort(function(a,b){return b[1]-a[1]});
  ALT.list=subs.map(function(s){return Object.assign(info(s[0],plan),{eqv:s[1],dif:s[2]})});
  $("#aName").textContent=o.n;
  var h='<div class="orig"><small>Exercício planejado</small><div class="presc">'+(plan.s?plan.s+" séries · ":"")+esc(o.r)+" reps"+(plan.rest?" · ⏱ "+fmtShort(plan.rest):"")+'</div>'+
    '<div class="meta"><span>🏋️ '+esc(o.eq)+'</span><span>↗ '+esc(o.pat)+'</span></div><div class="mus">'+o.m.map(function(m){return "<span>"+esc(m)+"</span>"}).join("")+'</div>'+
    (ALT.k!=null&&curId!==origId?'<button class="back" data-aback="1">↩ Voltar ao exercício original</button>':'')+'</div>';
  h+='<p class="legend"><b>Equivalência biomecânica</b>: quanto a alternativa reproduz músculos, padrão de movimento, amplitude e intensidade do original. A prescrição mantém séries e descanso do plano.</p>';
  if(!ALT.list.length)h+='<p class="mut">Sem alternativas cadastradas para este exercício.</p>';
  ALT.list.forEach(function(a,i){var c=eqColor(a.eqv),on=a.id===curId;
    h+='<div class="alt'+(on?" cur":"")+'" style="--i:'+i+';--c:'+c+'"><div class="alth"><b>'+(i+1)+'. '+esc(a.n)+'</b><span class="eqv">'+a.eqv+'% · '+eqLabel(a.eqv)+'</span></div>'+
      '<div class="eqbar"><i style="width:'+a.eqv+'%"></i></div>'+
      '<div class="meta"><span>🏋️ '+esc(a.eq)+'</span><span>↗ '+esc(a.pat)+'</span></div>'+
      '<div class="mus">'+a.m.map(function(m){return "<span>"+esc(m)+"</span>"}).join("")+'</div>'+
      '<div class="presc">'+(plan.s?plan.s+" séries · ":"")+esc(a.r)+" reps"+(plan.rest?" · ⏱ "+fmtShort(plan.rest):"")+'</div>'+
      '<p class="dif">'+esc(a.dif)+'</p>'+
      '<div class="altbtns"><button data-av="'+i+'">🧍 Ver 3D</button>'+(ALT.k!=null?(on?'<button disabled>✓ Em uso hoje</button>':'<button class="primary" data-use="'+i+'">Usar esta</button>'):'<span></span>')+'</div></div>'});
  $("#aBody").innerHTML=h;
  $("#alts").classList.add("open");$("#alts").setAttribute("aria-hidden","false");document.body.style.overflow="hidden";$("#alts .vpanel").scrollTop=0}
function closeAlts(){$("#alts").classList.remove("open");$("#alts").setAttribute("aria-hidden","true");if(!$("#viewer").classList.contains("open"))document.body.style.overflow=""}
function setSub(k,id){var d=DAYS[cur],s=subsFor(d.key),old=curEx(d,k).n;if(id)s[k]=id;else delete s[k];store.set("sub_"+today()+"_"+d.key,s);
  rerenderCard(k);var nn=curEx(d,k).n;toast(id?"🔁 Treino atualizado: "+nn+" no lugar de "+d.ex[k].n:"↩ De volta ao original: "+nn,3200);syncSoon()}
$("#aBody").addEventListener("click",function(e){var t=e.target.closest("button");if(!t)return;
  if(t.dataset.av!=null){openViewer(ALT.list,+t.dataset.av,"Alternativas")}
  else if(t.dataset.use!=null){var a=ALT.list[+t.dataset.use];setSub(ALT.k,a.id);closeAlts();var c=$("#ex"+ALT.k);c&&c.scrollIntoView({behavior:"smooth",block:"center"})}
  else if(t.dataset.aback){setSub(ALT.k,null);closeAlts()}});
$("#aClose").onclick=closeAlts;
$("#alts").addEventListener("click",function(e){if(e.target.id==="alts")closeAlts()});

/* ================= CRONÔMETRO DA SESSÃO ================= */
var sw=store.get("sw",{running:false,start:0,acc:0,d:null});
if(sw.d!==today()){sw={running:false,start:0,acc:0,d:today()}}
function swSave(){sw.d=today();store.set("sw",sw)}
function swNow(){return sw.acc+(sw.running?Date.now()-sw.start:0)}
function swUI(){var b=$("#swToggle");if(b)b.textContent=sw.running?"❚❚":"▶";var t=$("#swTime");if(t)t.textContent=fmt(swNow()/1000)}
function swStart(){if(sw.running)return;sw.running=true;sw.start=Date.now();swSave();requestWake();swUI()}
function swPause(){if(!sw.running)return;sw.acc+=Date.now()-sw.start;sw.running=false;swSave();swUI()}
function swReset(){sw.running=false;sw.acc=0;swSave();swUI()}

/* ================= DESCANSO INTELIGENTE (horário absoluto + persistência) ================= */
var RT={s:store.get("rest",null),beeped:-1,closeT:null};
var C=326.73,ring=$("#ring"),restEl=$("#rest");
var DONE_MSG="Descanso finalizado! Hora da próxima série. 💪";
function rtSave(){if(RT.s)store.set("rest",RT.s);else store.del("rest")}
function rtLeft(){var s=RT.s;if(!s)return 0;if(s.status==="run")return Math.max(0,s.end-Date.now());if(s.status==="pause")return s.remain;return 0}
function startRest(sec,ctx){ensureAudio();clearTimeout(RT.closeT);
  RT.s={id:uid(),total:sec*1000,end:Date.now()+sec*1000,remain:null,status:"run",label:ctx.label||"Descanso",next:ctx.next||"",day:ctx.day,di:ctx.di,k:ctx.k};
  RT.beeped=-1;rtSave();restEl.classList.remove("mini");$("#restMin").textContent="▾";rtTick();Push.schedule();requestWake()}
function rtPause(){var s=RT.s;if(!s||s.status!=="run")return;s.remain=Math.max(0,s.end-Date.now());s.end=null;s.status="pause";rtSave();Push.cancel();rtTick()}
function rtResume(){var s=RT.s;if(!s||s.status!=="pause")return;s.end=Date.now()+s.remain;s.remain=null;s.status="run";rtSave();Push.schedule();rtTick()}
function rtRestart(){var s=RT.s;if(!s)return;s.end=Date.now()+s.total;s.remain=null;s.status="run";RT.beeped=-1;rtSave();Push.schedule();rtTick()}
function rtAdd(sec){var s=RT.s;if(!s)return;clearTimeout(RT.closeT);
  if(s.status==="run"){s.end+=sec*1000;s.total+=sec*1000}
  else if(s.status==="pause"){s.remain+=sec*1000;s.total+=sec*1000}
  else{s.status="run";s.end=Date.now()+sec*1000;s.total=sec*1000;s.remain=null}
  rtSave();if(s.status==="run")Push.schedule();rtTick()}
function rtSkip(silent){clearTimeout(RT.closeT);if(RT.s&&RT.s.status!=="done")Push.cancel();RT.s=null;rtSave();restEl.classList.remove("open","mini","done","paused")}
function rtFinish(fresh){var s=RT.s;s.status="done";s.doneAt=s.end||Date.now();rtSave();
  if(fresh){beep(990,.45);setTimeout(function(){beep(1320,.35)},220);vib([250,120,250]);
    if(document.hidden&&!Push.on())localNotify(DONE_MSG,s.next)}
  if(s.k!=null&&s.day){readyEx={day:s.day,k:s.k};if(DAYS[cur].key===s.day)rerenderCard(s.k)}}
function rtTick(){var s=RT.s;
  if(!s){restEl.classList.remove("open");return}
  if(s.status==="done"&&Date.now()-(s.doneAt||0)>15*60*1000){rtSkip(true);return}
  var ms=rtLeft(),l=Math.ceil(ms/1000);
  if(s.status==="run"){if(l<=3&&l>0&&RT.beeped!==l){RT.beeped=l;if(!document.hidden){beep(660,.12);vib(40)}}
    if(ms<=0){rtFinish(Date.now()-s.end<4000)}}
  restEl.classList.add("open");restEl.classList.toggle("done",s.status==="done");restEl.classList.toggle("paused",s.status==="pause");
  $("#restTitle").textContent=s.status==="done"?"✅ Descanso finalizado":"⏱ "+s.label;
  if(s.status==="done"){$("#restTime").textContent="BORA";$("#restMiniTime").textContent="BORA! 💪";$("#restState").textContent="próxima série!";
    $("#restNext").textContent=s.next?s.next.replace(/^Próximo: /,"Próxima: "):DONE_MSG;ring.style.strokeDashoffset=0}
  else{var tx=fmt(l);$("#restTime").textContent=tx;$("#restMiniTime").textContent=(s.status==="pause"?"⏸ ":"")+tx;
    $("#restState").textContent=s.status==="pause"?"pausado":"restante";
    $("#restNext").textContent=s.next||"";ring.style.strokeDashoffset=C*(1-ms/(s.total||1))}
  $("#rPause").textContent=s.status==="pause"?"▶ Retomar":"⏸ Pausar";
  $("#rNotif").classList.toggle("show",s.status!=="done"&&!Push.on()&&!store.get("notifDismiss",false)&&Push.canAsk())}
setInterval(function(){if(RT.s)rtTick();var t=$("#swTime");if(t)t.textContent=fmt(swNow()/1000)},250);
$("#rPause").onclick=function(){RT.s&&RT.s.status==="pause"?rtResume():rtPause()};
$("#rRestart").onclick=rtRestart;
$("#restSkip").onclick=function(){rtSkip()};
$$("#rest [data-adj]").forEach(function(b){b.onclick=function(e){e.stopPropagation();rtAdd(+b.dataset.adj)}});
$("#restMin").onclick=function(e){e.stopPropagation();restEl.classList.toggle("mini");this.textContent=restEl.classList.contains("mini")?"▴":"▾"};
restEl.addEventListener("click",function(e){if(restEl.classList.contains("mini")&&!e.target.closest("#restMin")){restEl.classList.remove("mini");$("#restMin").textContent="▾"}});
$("#rNext").onclick=function(){var s=RT.s;rtSkip(true);if(!s)return;
  if(s.day){var di=DAYS.findIndex(function(d){return d.key===s.day});if(di>=0){showTab("treino");if(cur!==di)renderDay(di);
    if(s.k!=null){readyEx={day:s.day,k:s.k};rerenderCard(s.k);var c=$("#ex"+s.k);c&&c.scrollIntoView({behavior:"smooth",block:"center"})}}}};
$("#rNotif").onclick=function(){Push.enable().then(function(ok){if(ok)rtTick()})};
function localNotify(title,body){try{if(!("Notification" in window)||Notification.permission!=="granted")return;
  if(navigator.serviceWorker&&navigator.serviceWorker.controller){navigator.serviceWorker.ready.then(function(r){r.showNotification(title,{body:body||"",icon:"/icons/icon-192.png",badge:"/icons/badge-96.png",tag:"descanso",renotify:true,vibrate:[200,100,200]})})}
  else new Notification(title,{body:body||"",icon:"/icons/icon-192.png",tag:"descanso"})}catch(e){}}

/* ================= NOTIFICAÇÕES PUSH ================= */
var Push={key:null,backend:null,failT:0,
  isIOS:/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1),
  standalone:function(){return (window.matchMedia&&matchMedia("(display-mode: standalone)").matches)||navigator.standalone===true},
  supported:function(){return ONLINE_APP&&"serviceWorker" in navigator&&"PushManager" in window&&"Notification" in window},
  canAsk:function(){return ONLINE_APP&&(("Notification" in window&&Notification.permission!=="denied")||(Push.isIOS&&!Push.standalone()))},
  on:function(){return store.get("pushOn",false)&&"Notification" in window&&Notification.permission==="granted"},
  reg:function(){if(!("serviceWorker" in navigator))return Promise.resolve(null);return Promise.race([navigator.serviceWorker.ready,new Promise(function(r){setTimeout(function(){r(null)},4000)})])},
  checkBackend:function(){return fetch("/api/push/key",{cache:"no-store"}).then(function(r){if(!r.ok)throw new Error("HTTP "+r.status);return r.json()}).then(function(j){if(!j.publicKey)throw new Error("sem chave");Push.key=j.publicKey;Push.backend=true;return true}).catch(function(){Push.backend=false;return false})},
  enable:function(){
    if(!ONLINE_APP){toast("Notificações só funcionam com o site publicado (https).",4000);return Promise.resolve(false)}
    if(Push.isIOS&&!Push.standalone()){toast("No iPhone: instale o app na tela inicial (Compartilhar → Adicionar à Tela de Início) e ative por lá.",6000);showTab("prog");return Promise.resolve(false)}
    if(!("Notification" in window)){toast("Este navegador não suporta notificações.",4000);return Promise.resolve(false)}
    return Notification.requestPermission().then(function(p){
      if(p!=="granted"){toast(p==="denied"?"Permissão negada. Libere as notificações do site nas configurações do navegador/celular.":"Permissão não concedida.",5500);settingsUI();return false}
      if(!Push.supported()){store.set("pushOn",false);toast("Push não suportado aqui — você receberá alertas com o app aberto.",4500);settingsUI();return false}
      return Push.reg().then(function(reg){if(!reg){toast("Service worker indisponível. Recarregue a página e tente de novo.",4500);return false}
        return Push.checkBackend().then(function(ok){
          if(!ok){store.set("pushOn",false);toast("Servidor de push indisponível — alertas só com o app aberto. Veja o README.",5500);settingsUI();return false}
          return reg.pushManager.getSubscription().then(function(sub){
            if(sub&&store.get("pushKey","")!==Push.key)return sub.unsubscribe().then(function(){return null});return sub})
          .then(function(sub){return sub||reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64u(Push.key)})})
          .then(function(){store.set("pushOn",true);store.set("pushKey",Push.key);toast("🔔 Alertas de descanso ativados!");settingsUI();if(RT.s&&RT.s.status==="run")Push.schedule();return true})})})
    }).catch(function(e){toast("Não foi possível ativar: "+(e&&e.message||e),5000);settingsUI();return false})},
  disable:function(){store.set("pushOn",false);Push.cancel();Push.reg().then(function(r){return r&&r.pushManager.getSubscription()}).then(function(s){return s&&s.unsubscribe()}).catch(function(){}).then(function(){settingsUI();toast("Alertas em segundo plano desativados.")})},
  send:function(path,body){return fetch(path,{method:"POST",keepalive:true,headers:{"Content-Type":"application/json"},body:JSON.stringify(body)})},
  schedule:function(force){var s=RT.s;if(!Push.on()||!s||s.status!=="run")return;
    if(!force&&store.get("pushMode","always")==="background"&&!document.hidden)return;
    var end=s.end,id=s.id;
    Push.reg().then(function(reg){return reg&&reg.pushManager.getSubscription()}).then(function(sub){
      if(!sub){store.set("pushOn",false);settingsUI();return}
      return Push.send("/api/push/schedule",{device:DEVICE,sub:sub.toJSON(),endAt:end,title:DONE_MSG,body:s.next?s.next.replace(/^Próximo: /,"Próxima: "):"Volte ao treino.",url:"/?rest=1",timer:id})
        .then(function(r){if(!r.ok)throw new Error("HTTP "+r.status);if(RT.s&&RT.s.id===id)RT.s.pushed=end})})
    .catch(function(){if(Date.now()-Push.failT>60000){Push.failT=Date.now();toast("⚠️ Não consegui agendar o alerta no servidor — mantenha o app aberto neste descanso.",4500)}})},
  cancel:function(){if(!store.get("pushOn",false))return;Push.send("/api/push/cancel",{device:DEVICE}).catch(function(){})},
  test:function(){if(!Push.on()){toast("Ative as notificações primeiro.");return}
    Push.reg().then(function(reg){return reg&&reg.pushManager.getSubscription()}).then(function(sub){if(!sub)throw new Error("sem inscrição");
      return Push.send("/api/push/schedule",{device:DEVICE+"-test",sub:sub.toJSON(),endAt:Date.now()+5000,title:"Teste de notificação ✅",body:"Se você viu isto, os alertas de descanso vão chegar mesmo com a tela bloqueada.",url:"/"})})
    .then(function(r){if(!r.ok)throw new Error("HTTP "+r.status);toast("Teste agendado: bloqueie a tela e aguarde ~5 s.",5000)})
    .catch(function(e){toast("Falha no teste: "+(e&&e.message||e),5000)})}};
function b64u(s){var p="=".repeat((4-s.length%4)%4),b=atob((s+p).replace(/-/g,"+").replace(/_/g,"/")),a=new Uint8Array(b.length);for(var i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a}
document.addEventListener("visibilitychange",function(){
  if(document.hidden){if(RT.s&&RT.s.status==="run"&&store.get("pushMode","always")==="background")Push.schedule(true);syncSoon()}
  else{wl=null;if(RT.s){rtTick();if(RT.s&&RT.s.status==="run"&&store.get("pushMode","always")==="background")Push.cancel()}
    if(sw.running||am.running||(RT.s&&RT.s.status==="run"))requestWake();swUI()}});
window.addEventListener("pageshow",function(){if(RT.s)rtTick()});

/* ================= PWA: service worker + instalação ================= */
var deferredInstall=null;
if(ONLINE_APP&&"serviceWorker" in navigator){
  window.addEventListener("load",function(){navigator.serviceWorker.register("/sw.js").then(function(){settingsUI()}).catch(function(e){console.warn("SW:",e)})});
  navigator.serviceWorker.addEventListener("message",function(e){if(e.data&&e.data.type==="push"&&RT.s)rtTick()});
}
window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();deferredInstall=e;settingsUI()});
window.addEventListener("appinstalled",function(){deferredInstall=null;toast("App instalado! 🎉");settingsUI()});
$("#btnInstall").onclick=function(){if(!deferredInstall)return;deferredInstall.prompt();deferredInstall.userChoice.finally(function(){deferredInstall=null;settingsUI()})};

/* ================= BACKUP / SINCRONIZAÇÃO ================= */
var SKIP_KEYS={device:1,pushOn:1,pushKey:1,rest:1,syncAt:1};
function exportData(){var o={};for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(!SKIP_KEYS[k])o[k]=localStorage.getItem(k)}return {v:3,app:"plano-treino",at:Date.now(),items:o}}
function importData(j){if(!j||!j.items)throw new Error("arquivo inválido");Object.keys(j.items).forEach(function(k){if(!SKIP_KEYS[k])try{localStorage.setItem(k,j.items[k])}catch(e){}})}
function syncId(){return store.get("syncId",DEVICE)}
var syncT=null,syncBusy=false;
function syncSoon(now){clearTimeout(syncT);syncT=setTimeout(syncUp,now?300:20000)}
function syncUp(manual){if(!ONLINE_APP||syncBusy)return Promise.resolve(false);syncBusy=true;
  return fetch("/api/sync",{method:"PUT",keepalive:!manual,headers:{"Content-Type":"application/json"},body:JSON.stringify({id:syncId(),data:exportData()})})
  .then(function(r){if(!r.ok)throw new Error("HTTP "+r.status);store.set("syncAt",Date.now());if(manual)toast("☁️ Backup enviado.");return true})
  .catch(function(e){if(manual)toast("Servidor indisponível: "+(e&&e.message||e),4500);return false})
  .finally(function(){syncBusy=false;settingsUI()})}
function syncDown(code){return fetch("/api/sync?id="+encodeURIComponent(code),{cache:"no-store"}).then(function(r){if(r.status===404)throw new Error("código não encontrado");if(!r.ok)throw new Error("HTTP "+r.status);return r.json()})
  .then(function(j){importData(j.data);store.set("syncId",code);toast("✅ Dados restaurados!");setTimeout(function(){location.reload()},900)})
  .catch(function(e){toast("Não foi possível restaurar: "+(e&&e.message||e),5000)})}
$("#btnSyncUp").onclick=function(){syncUp(true)};
$("#btnSyncDown").onclick=function(){var c=prompt("Cole o código de sincronização do outro aparelho:");if(c)syncDown(c.trim())};
$("#btnExport").onclick=function(){var b=new Blob([JSON.stringify(exportData(),null,1)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="treino-backup-"+today()+".json";document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500)};
$("#fileImport").onchange=function(){var f=this.files[0];if(!f)return;f.text().then(function(t){importData(JSON.parse(t));toast("✅ Backup importado!");setTimeout(function(){location.reload()},900)}).catch(function(e){toast("Arquivo inválido: "+(e&&e.message||e),4500)})};

/* ================= TELA: PROGRESSO + CONFIGURAÇÕES ================= */
function pill(id,cls,txt){var p=$(id);p.className="pill "+cls;p.textContent=txt}
function settingsUI(){
  var inst=Push.standalone();
  pill("#instPill",inst?"ok":"warn",inst?"Instalado":"No navegador");
  $("#instHint").textContent=inst?"Abrindo como aplicativo.":(Push.isIOS?"No iPhone, o push só funciona com o app instalado.":(deferredInstall?"Toque em Instalar app.":"Use o menu do navegador → Instalar app / Adicionar à tela inicial."));
  $("#btnInstall").style.display=deferredInstall&&!inst?"":"none";$("#iosSteps").style.display=Push.isIOS&&!inst?"":"none";
  var perm=!ONLINE_APP?"indisponível":("Notification" in window?Notification.permission:(Push.isIOS&&!inst?"instale primeiro":"sem suporte"));
  pill("#permPill",perm==="granted"?"ok":perm==="denied"?"bad":"warn",{granted:"Permitida",denied:"Bloqueada",default:"Não pedida"}[perm]||perm);
  $("#permHint").textContent=perm==="denied"?"Libere em Ajustes → Notificações (iPhone) ou nas configurações do site (Android).":perm==="granted"?"O app pode mostrar alertas.":"Toque em Ativar notificações.";
  var po=Push.on();pill("#pushPill",po?"ok":Push.backend===false?"bad":"warn",po?"Ativo":Push.backend===false?"Sem servidor":"Inativo");
  $("#pushHint").textContent=po?"O servidor avisa no fim do descanso, mesmo com a tela bloqueada.":Push.backend===false?"Backend não encontrado: alertas só com o app aberto.":"Ative para receber o aviso em segundo plano.";
  $("#pushMode").value=store.get("pushMode","always");$("#soundOn").checked=store.get("soundOn",true);
  $("#syncCode").textContent=syncId();var sa=store.get("syncAt",0);
  pill("#syncPill",sa?"ok":"warn",sa?"Sincronizado":"Local");$("#syncHint").textContent=sa?"Último backup: "+new Date(sa).toLocaleString("pt-BR"):"Seus dados ficam salvos neste aparelho."}
$("#btnNotif").onclick=function(){Push.enable()};
$("#btnNotifOff").onclick=function(){Push.disable()};
$("#btnTest").onclick=function(){Push.test()};
$("#pushMode").onchange=function(){store.set("pushMode",this.value);toast(this.value==="always"?"Push agendado a cada descanso.":"Push só quando o app sair da tela.")};
$("#soundOn").onchange=function(){store.set("soundOn",this.checked)};
function nameOf(id){return info(id).n}
function progUI(){
  var h=hist(),byS={};h.forEach(function(x){var key=x.d+"|"+x.day;var s=byS[key]||(byS[key]={d:x.d,day:x.day,sets:0,subs:{},ex:{}});s.sets++;s.ex[x.done]=1;if(x.plan!==x.done)s.subs[x.plan+">"+x.done]=1});
  var sess=Object.keys(byS).map(function(k){return byS[k]}).sort(function(a,b){return a.d<b.d?1:-1});
  var durs={};store.get("sessions",[]).forEach(function(s){durs[s.d+"|"+s.day]=s.dur});
  var month=today().slice(0,7),mSets=h.filter(function(x){return x.d.slice(0,7)===month}).length,nSubs=h.filter(function(x){return x.plan!==x.done}).length;
  $("#stats").innerHTML='<div><b>'+sess.length+'</b><small>'+(sess.length===1?'treino':'treinos')+'</small></div><div><b>'+mSets+'</b><small>séries no mês</small></div><div><b>'+nSubs+'</b><small>séries substituídas</small></div>';
  $("#sessList").innerHTML=sess.length?sess.slice(0,15).map(function(s){var day=DAYS.find(function(d){return d.key===s.day})||{};var du=durs[s.d+"|"+s.day];
    var subs=Object.keys(s.subs).map(function(k){var p=k.split(">");return nameOf(p[0])+" → "+nameOf(p[1])});
    return '<div class="sess"><div class="sh"><b>'+dmy(s.d)+' • '+esc(day.title||s.day)+'</b><span class="mut">'+s.sets+' séries'+(du?' • '+fmt(du):'')+'</span></div>'+
      '<div class="det">'+Object.keys(s.ex).map(nameOf).map(esc).join(" · ")+'</div>'+(subs.length?'<div class="sub">🔁 '+subs.map(esc).join(" · ")+'</div>':'')+'</div>'}).join(""):'<p class="mut">Nenhuma série registrada ainda. Conclua séries no treino para ver o histórico aqui.</p>';
  var best={};h.forEach(function(x){if(x.kg>0&&(!best[x.done]||x.kg>best[x.done].kg))best[x.done]={kg:x.kg,d:x.d}});
  var bl=Object.keys(best).sort(function(a,b){return best[b].kg-best[a].kg}).slice(0,10);
  $("#recList").innerHTML=bl.length?bl.map(function(id){return '<div class="rec"><span>'+esc(nameOf(id))+'</span><b>'+best[id].kg+' kg <span class="mut" style="font-weight:400">'+dmy(best[id].d)+'</span></b></div>'}).join(""):'<p class="mut">Registre a carga no campo "kg" ao concluir as séries.</p>';
  settingsUI()}

/* ================= AMRAP (persistente) ================= */
var am=Object.assign({dur:1200,left:1200,end:0,running:false,rounds:0,station:0},store.get("amrap",{}));am.int=null;
function amSave(){store.set("amrap",{dur:am.dur,left:am.left,end:am.end,running:am.running,rounds:am.rounds,station:am.station})}
function amUI(){$("#amClock").textContent=fmt(am.left);$("#amClock").classList.toggle("run",am.running);
  $("#amBar").style.width=(100*(1-am.left/am.dur))+"%";$("#amRounds").textContent=am.rounds;
  $("#amStart").textContent=am.running?"Pausar":(am.left>0&&am.left<am.dur?"Continuar":"Iniciar");
  $$("#amCirc li").forEach(function(li,i){li.classList.toggle("cur",i===am.station)});
  $$("#amDurs button").forEach(function(x){x.classList.toggle("on",+x.dataset.d*60===am.dur)});
  $("#amMinLbl").textContent=am.dur/60;
  var hist=store.get("amrap_hist",[]),best=hist.filter(function(h){return h.m===am.dur/60}).reduce(function(m,h){return Math.max(m,h.r)},0);
  $("#amBest").textContent=best?"🏆 Recorde em "+am.dur/60+" min: "+best+" rodadas":"Sem recorde ainda — bora estabelecer o seu!";
  $("#amHist").innerHTML=hist.length?hist.map(function(h){return "<li><span>"+h.d+" • "+h.m+" min</span><b>"+h.r+" rodadas</b></li>"}).join(""):'<li class="mut">Nenhum circuito registrado.</li>'}
function amTick(){var l=Math.max(0,Math.ceil((am.end-Date.now())/1000));
  if(l!==am.left){am.left=l;if(!document.hidden){if(l<=3&&l>0)beep(660,.12);else if(l>0&&l%60===0)beep(880,.08)}if(l===Math.floor(am.dur/2))toast("⏳ Metade do tempo!")}
  if(l<=0)amFinish(true);amUI()}
function amFinish(fresh){clearInterval(am.int);am.running=false;am.left=0;if(fresh){beep(990,.7);vib([300,150,300]);confetti();toast("🔥 Fim! "+am.rounds+" rodadas")}
  var hist=store.get("amrap_hist",[]),d=new Date();hist.unshift({d:d.getDate()+"/"+(d.getMonth()+1),r:am.rounds,m:am.dur/60});store.set("amrap_hist",hist.slice(0,12));amSave();syncSoon()}
function amRun(){clearInterval(am.int);am.int=setInterval(amTick,250)}
$("#amStart").onclick=function(){ensureAudio();
  if(am.running){clearInterval(am.int);am.left=Math.max(0,Math.ceil((am.end-Date.now())/1000));am.running=false}
  else{if(am.left<=0){am.left=am.dur;am.rounds=0;am.station=0}requestWake();am.end=Date.now()+am.left*1000;am.running=true;beep(880,.2);amRun()}amSave();amUI()};
$("#amReset").onclick=function(){clearInterval(am.int);am.running=false;am.left=am.dur;am.rounds=0;am.station=0;amSave();amUI()};
$("#amPlus").onclick=function(){am.rounds++;am.station=0;vib(30);amSave();amUI()};
$("#amMinus").onclick=function(){am.rounds=Math.max(0,am.rounds-1);amSave();amUI()};
$("#amStation").onclick=function(){vib(25);am.station++;if(am.station>=4){am.station=0;am.rounds++;beep(1046,.15);toast("✅ Rodada "+am.rounds+"!")}amSave();amUI()};
$("#amDurs").onclick=function(e){var b=e.target.closest("[data-d]");if(!b||am.running)return;am.dur=+b.dataset.d*60;am.left=am.dur;am.rounds=0;am.station=0;amSave();amUI()};
$("#amCirc").innerHTML=STATIONS.map(function(s,i){return "<li><span>"+s[0]+"</span><em>"+s[1]+"</em><button class=\"v3d\" data-v=\""+i+"\" aria-label=\"Ver em 3D\">🧍</button><button class=\"v3d\" data-alt=\""+i+"\" aria-label=\"Alternativas\">↔</button></li>"}).join("");
$("#amCirc").onclick=function(e){var b=e.target.closest("[data-v]");if(b){openViewer(ST_EX,+b.dataset.v,"Circuito AMRAP");return}
  var a=e.target.closest("[data-alt]");if(a){openAlts(null,STATIONS[+a.dataset.alt][2]);return}
  var li=e.target.closest("li");if(li){am.station=[].indexOf.call(this.children,li);amSave();amUI()}};
if(am.running){if(am.end>Date.now())amRun();else{am.left=0;amFinish(false)}}

/* ================= DICAS / NUTRIÇÃO ================= */
$("#flips").innerHTML=TIPS.map(function(t){return '<div class="flip"><div class="flip-in"><div class="face front"><div class="ic">'+t[0]+'</div><div><small>Toque para ver</small><br><b>'+t[1]+'</b></div></div><div class="face back">'+t[2]+'</div></div></div>'}).join("");
$("#flips").onclick=function(e){var f=e.target.closest(".flip");if(f)f.classList.toggle("on")};
$("#nutriTips").innerHTML=NTIPS.map(function(t){return "<li>"+t+"</li>"}).join("");
$("#recipes").innerHTML=RECIPES.map(function(g){return '<div class="grp">'+g.g+'</div>'+g.items.map(function(r){
  return '<details><summary><div><b>'+r[0]+'</b><small>'+r[1]+'</small></div>'+(r[2]!=="—"?'<span class="pt">'+r[2]+'</span>':"")+'</summary><div class="rec"><p><b>Ingredientes:</b> '+r[3]+'</p><p><b>Preparo:</b> '+r[4]+'</p></div></details>'}).join("")}).join("");
function calc(){var p=parseFloat(String($("#peso").value).replace(",","."));var o=$("#calcOut");
  if(!p||p<30||p>250){o.innerHTML='<div style="grid-column:1/-1" class="mut">Digite seu peso para ver suas metas diárias.</div>';return}
  store.set("peso",p);
  o.innerHTML='<div><small>Proteína/dia</small><b>'+Math.round(p*1.6)+'–'+Math.round(p*2.2)+' g</b></div><div><small>Água/dia</small><b>'+(p*.035).toFixed(1).replace(".",",")+'–'+(p*.04).toFixed(1).replace(".",",")+' L</b></div><div><small>Proteína/refeição (4×)</small><b>~'+Math.round(p*1.9/4)+' g</b></div><div><small>Ovos equivalentes</small><b>~'+Math.round(p*1.9/6)+'</b></div>'}
$("#peso").value=store.get("peso","");$("#peso").addEventListener("input",calc);calc();

/* ================= ABAS ================= */
function showTab(name){$$(".tab").forEach(function(s){s.classList.toggle("active",s.id==="tab-"+name)});
  $$("#nav button").forEach(function(b){b.classList.toggle("on",b.dataset.tab===name)});
  $("#pageTreino").style.display=name==="treino"?"":"none";window.scrollTo({top:0});
  setTimeout(function(){window.dispatchEvent(new Event("resize"))},30);if(name==="amrap")amUI();if(name==="prog")progUI();if(name==="treino"&&DAYS[cur].ex)renderDay(cur)}
$("#nav").onclick=function(e){var b=e.target.closest("[data-tab]");if(b)showTab(b.dataset.tab)};

/* ================= VISUALIZADOR 3D ================= */
var ST_EX=STATIONS.map(function(s){return info(s[2])});
var V={list:[],i:0,ok:null,label:"",speeds:[1,.5,1.5],si:0};
function openViewer(list,i,label){
  if(V.ok===null)V.ok=!!(window.THREE&&Coach.init($("#coach3d")));
  if(!V.ok){toast("O 3D não carregou neste aparelho/conexão.");return}
  V.list=list.filter(function(e){return e.a&&Coach.has(e.a)});V.i=Math.max(0,V.list.indexOf(list[i]));V.label=label;
  $("#viewer").classList.add("open");$("#viewer").setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
  requestAnimationFrame(function(){vShow();Coach.start()})}
function vShow(){var e=V.list[V.i];$("#vName").textContent=e.n;$("#vDay").textContent=V.label+" • "+(V.i+1)+"/"+V.list.length;
  $("#vCue").textContent=e.c;$("#vMeta").innerHTML=(e.eqv?"<span>Equivalência "+e.eqv+"%</span>":"")+(e.s?"<span>"+e.s+" séries</span>":"")+"<span>"+esc(e.r)+" reps</span>"+(e.rest?"<span>⏱ "+fmtShort(e.rest)+"</span>":"")+(e.bs?"<span>Bi-set "+e.bs+"</span>":"")+(e.eq?"<span>🏋️ "+esc(e.eq)+"</span>":"");
  $("#vMus").innerHTML=(e.m||[]).map(function(m){return "<span>"+esc(m)+"</span>"}).join("");
  Coach.play(e.a);Coach.pause(false);$("#vPlay").textContent="❚❚ Pausar";$("#vRep").textContent="1"}
function closeViewer(){Coach.stop();$("#viewer").classList.remove("open");$("#viewer").setAttribute("aria-hidden","true");if(!$("#alts").classList.contains("open"))document.body.style.overflow=""}
Coach.onRep(function(n){var el=$("#vRep");if(el)el.textContent=n+1});
$("#vClose").onclick=closeViewer;
$("#viewer").addEventListener("click",function(e){if(e.target.id==="viewer")closeViewer()});
document.addEventListener("keydown",function(e){if(e.key!=="Escape")return;if($("#viewer").classList.contains("open"))closeViewer();else if($("#alts").classList.contains("open"))closeAlts()});
$("#vPrev").onclick=function(){V.i=(V.i-1+V.list.length)%V.list.length;vShow()};
$("#vNext").onclick=function(){V.i=(V.i+1)%V.list.length;vShow()};
$("#vPlay").onclick=function(){var p=!Coach.isPaused();Coach.pause(p);this.textContent=p?"▶ Play":"❚❚ Pausar"};
$("#vSpeed").onclick=function(){V.si=(V.si+1)%V.speeds.length;var sp=V.speeds[V.si];Coach.setSpeed(sp);this.textContent=(sp+"x").replace(".",",")};

/* ================= INIT ================= */
weekUI();renderDays();renderDay(todayIdx);amUI();settingsUI();
scene3d($("#hero3d"),"dumbbell");scene3d($("#kb3d"),"kb");
if(RT.s){if(RT.s.status==="run"&&RT.s.end<=Date.now()){RT.s.status="done";RT.s.doneAt=RT.s.end;rtSave()}rtTick();if(RT.s&&RT.s.status==="done"&&RT.s.k!=null&&RT.s.day){readyEx={day:RT.s.day,k:RT.s.k};if(DAYS[cur].key===RT.s.day)rerenderCard(RT.s.k)}}
if(ONLINE_APP)Push.checkBackend().then(settingsUI);
setTimeout(function(){var b=document.querySelector(".day.on");if(b)b.scrollIntoView({inline:"center",block:"nearest"})},100);
