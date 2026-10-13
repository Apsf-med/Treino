/* ================= COACH 3D (personagem) ================= */
var Coach=(function(){
var D=Math.PI/180,T=window.THREE;
var r,sc,cam,canvas,chr,J={},MK={},propG,dyn=[],cur=null,curId=null,t0=0,tPaused=0,paused=false,speed=1,raf=0,running=false,orbit={yaw:0,pitch:0},anchorRef=null,ring,lastRep=-1,onRep=null;
function std(c,ro,me){return new T.MeshStandardMaterial({color:new T.Color(c).convertSRGBToLinear(),roughness:ro==null?.6:ro,metalness:me||0})}
var M;
function mats(){M={skin:std(0xd8a17c,.55),skinD:std(0xc98f6a,.6),top:std(0xff6b2c,.55),topD:std(0xe85a1e,.6),shorts:std(0x1c2430,.75),shoe:std(0xf4f6f9,.42),sole:std(0xff6b2c,.5),hair:std(0x18120e,.9),eye:std(0x0b0b0d,.2),band:std(0xc6ff3d,.5),sock:std(0xffffff,.85),metal:std(0xb7c0ca,.25,.9),frame:std(0x2b323d,.45,.55),pad:std(0x14181e,.75),acc:std(0xff6b2c,.4,.2),plate:std(0x1a1d22,.5,.3),cable:std(0x0c0e11,.5)}}
function G(p,x,y,z){var g=new T.Group();g.position.set(x||0,y||0,z||0);if(p)p.add(g);return g}
function ms(geo,mat,p,x,y,z,sx,sy,sz){var m=new T.Mesh(geo,mat);m.position.set(x||0,y||0,z||0);if(sx!=null)m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;if(p)p.add(m);return m}
function capsule(r1,r2,len,mat){var pts=[],n=8,i,a;
  for(i=0;i<=n;i++){a=-Math.PI/2+(i/n)*Math.PI/2;pts.push(new T.Vector2(Math.max(1e-4,r2*Math.cos(a)),-len+r2*Math.sin(a)))}
  for(i=0;i<=n;i++){a=(i/n)*Math.PI/2;pts.push(new T.Vector2(Math.max(1e-4,r1*Math.cos(a)),r1*Math.sin(a)))}
  var m=new T.Mesh(new T.LatheGeometry(pts,22),mat);m.castShadow=true;return m}
var SPH=null;function sph(){return SPH||(SPH=new T.SphereGeometry(1,28,20))}
function mk(p,name,x,y,z){var o=G(p,x,y,z);MK[name]=o;return o}

function buildChar(){
  var root=new T.Group();J.root=root;root.rotation.order="YXZ";
  ms(sph(),M.shorts,root,0,-.02,0,.168,.125,.118);
  // waistband
  ms(new T.CylinderGeometry(.156,.16,.03,26),M.band,root,0,.075,0,1,1,.74);
  var sp=G(root,0,.06,0);J.sp=sp;
  ms(new T.CylinderGeometry(.142,.155,.2,26),M.top,sp,0,.07,0,1,1,.74);
  var ch=G(sp,0,.15,0);J.ch=ch;
  var pts=[[.142,0],[.16,.05],[.19,.13],[.205,.2],[.198,.25],[.17,.29],[.11,.325],[.05,.338],[.001,.34]].map(function(p){return new T.Vector2(p[0],p[1])});
  var tor=new T.Mesh(new T.LatheGeometry(pts,30),M.top);tor.scale.z=.64;tor.castShadow=true;ch.add(tor);
  // pec shading line / tank straps
  ms(sph(),M.topD,ch,.07,.205,.075,.075,.06,.04);ms(sph(),M.topD,ch,-.07,.205,.075,.075,.06,.04);
  // neck & head
  var nk=G(ch,0,.32,0);J.nk=nk;
  ms(new T.CylinderGeometry(.05,.056,.12,18),M.skin,nk,0,.03,0);
  var hd=G(nk,0,.08,0);J.hd=hd;
  ms(sph(),M.skin,hd,0,.1,.005,.105,.122,.112);
  ms(sph(),M.skin,hd,0,.045,.03,.075,.06,.075); // jaw
  var hair=new T.Mesh(new T.SphereGeometry(.118,28,16,0,Math.PI*2,0,1.45),M.hair);hair.position.set(0,.112,-.006);hair.rotation.x=-.42;hair.scale.set(.96,1.06,1);hair.castShadow=true;hd.add(hair);
  ms(sph(),M.hair,hd,0,.195,.02,.09,.035,.09);
  [-1,1].forEach(function(s){
    ms(sph(),M.eye,hd,.038*s,.112,.102,.014,.019,.008);
    ms(new T.BoxGeometry(.036,.009,.01),M.hair,hd,.04*s,.142,.103).rotation.z=-.12*s;
    ms(sph(),M.skinD,hd,.105*s,.1,0,.018,.03,.024);
  });
  ms(sph(),M.skinD,hd,0,.088,.113,.014,.02,.014);
  ms(new T.TorusGeometry(.022,.004,8,16,Math.PI),M.skinD,hd,0,.064,.106).rotation.z=Math.PI;
  // arms
  ["L","R"].forEach(function(S){var s=S==="L"?1:-1;
    var sh=G(ch,.205*s,.255,0);J["sh"+S]=sh;
    ms(sph(),M.skin,sh,0,-.015,0,.075,.072,.07);
    var tw=G(sh);J["tw"+S]=tw;
    var ua=capsule(.058,.046,.27,M.skin);tw.add(ua);
    var el=G(tw,0,-.28,0);J["el"+S]=el;
    var fa=capsule(.048,.036,.235,M.skin);el.add(fa);
    ms(new T.CylinderGeometry(.04,.04,.04,16),M.band,el,0,-.22,0);
    var hand=G(el,0,-.29,0);J["hand"+S]=hand;
    ms(sph(),M.skin,hand,0,0,.005,.034,.05,.026);
    ms(sph(),M.skin,hand,.026*s,.012,.016,.012,.026,.012);
    mk(hand,"grip"+S,0,-.005,0);
  });
  // legs
  ["L","R"].forEach(function(S){var s=S==="L"?1:-1;
    var hp=G(root,.088*s,-.06,0);J["hp"+S]=hp;
    hp.add(capsule(.084,.058,.41,M.skin));
    var sl=capsule(.1,.09,.16,M.shorts);sl.position.y=.02;hp.add(sl);
    var kn=G(hp,0,-.43,0);J["kn"+S]=kn;
    kn.add(capsule(.062,.042,.4,M.skin));
    ms(new T.CylinderGeometry(.047,.045,.07,16),M.sock,kn,0,-.385,0);
    mk(kn,"knee"+S,0,-.01,.065);
    var an=G(kn,0,-.42,0);J["an"+S]=an;
    ms(sph(),M.shoe,an,0,-.03,.05,.058,.05,.122);
    ms(new T.BoxGeometry(.115,.022,.26),M.sole,an,0,-.069,.052);
    ms(new T.BoxGeometry(.004,.03,.12),M.sole,an,.058*s,-.035,.05);
    mk(an,"heel"+S,0,-.08,-.07);mk(an,"toe"+S,0,-.08,.17);
  });
  root.traverse(function(o){if(o.isMesh){o.castShadow=true}});
  return root;
}

/* ---------- poses ---------- */
function v3(a){return a==null?[0,0,0]:(typeof a==="number"?[a,0,0]:[a[0]||0,a[1]||0,a[2]||0])}
function resolve(p){var o={root:Object.assign({x:0,y:.93,z:0,rx:0,ry:0,rz:0},p.root||{})};
  ["sp","ch","nk"].forEach(function(k){o[k]=v3(p[k])});
  ["sh","el","hp","kn","an"].forEach(function(k){
    o[k+"L"]=v3(p[k+"L"]!=null?p[k+"L"]:p[k]);
    var R=v3(p[k+"R"]!=null?p[k+"R"]:p[k]);o[k+"R"]=[R[0],-R[1],-R[2]]});
  o.twL=p.twL!=null?p.twL:(p.tw||0);o.twR=-(p.twR!=null?p.twR:(p.tw||0));return o}
function lerpP(A,B,t){var o={root:{}},k,i;
  for(k in A.root)o.root[k]=A.root[k]+(B.root[k]-A.root[k])*t;
  for(k in A){if(k==="root")continue;if(typeof A[k]==="number")o[k]=A[k]+(B[k]-A[k])*t;else{o[k]=[];for(i=0;i<3;i++)o[k][i]=A[k][i]+(B[k][i]-A[k][i])*t}}return o}
function applyP(P){var R=P.root;J.root.position.set(R.x,R.y,R.z);J.root.rotation.set(R.rx*D,R.ry*D,R.rz*D);
  ["sp","ch","nk","shL","shR","elL","elR","hpL","hpR","knL","knR","anL","anR"].forEach(function(k){var a=P[k];J[k].rotation.set(a[0]*D,a[1]*D,a[2]*D)});
  J.twL.rotation.y=P.twL*D;J.twR.rotation.y=P.twR*D}
var _v=null;function wp(name){return MK[name].getWorldPosition(new T.Vector3())}
function avg(names){var s=new T.Vector3();names.forEach(function(n){s.add(wp(n))});return s.multiplyScalar(1/names.length)}
var ANCH={toes:["toeL","toeR"],feet:["heelL","toeL","heelR","toeR"],hands:["gripL","gripR"],footL:["heelL","toeL"],knees:["kneeL","kneeR","toeL","toeR"]};
var GROUND=["heelL","toeL","heelR","toeR","kneeL","kneeR"];
function solve(def,P){applyP(P);chr.updateMatrixWorld(true);
  if(def.anchor){var a=avg(ANCH[def.anchor]);
    if(def.anchorAt){J.root.position.x+=def.anchorAt[0]-a.x;J.root.position.y+=def.anchorAt[1]-a.y;J.root.position.z+=def.anchorAt[2]-a.z}
    else if(anchorRef){J.root.position.x+=anchorRef.x-a.x;J.root.position.z+=anchorRef.z-a.z}
    chr.updateMatrixWorld(true)}
  if(def.ground){var mn=1e9;GROUND.forEach(function(n){mn=Math.min(mn,wp(n).y)});J.root.position.y-=mn;chr.updateMatrixWorld(true)}}

/* ---------- props ---------- */
function box(p,s,mat,par){return ms(new T.BoxGeometry(s[0],s[1],s[2]),mat,par||propG,p[0],p[1],p[2])}
function cyl(r1,len,mat,par,axis){var m=ms(new T.CylinderGeometry(r1,r1,len,24),mat,par);if(axis==="x")m.rotation.z=Math.PI/2;if(axis==="z")m.rotation.x=Math.PI/2;return m}
function makeBar(o){var g=new T.Group(),L=o.len||1.6,pr=o.pr||.2;cyl(.015,L,M.metal,g,"x");
  if(o.plates!==false){[-1,1].forEach(function(s){var x=(L/2-.2)*s;
    var p1=cyl(pr,.055,M.plate,g,"x");p1.position.x=x;var p2=cyl(pr*.78,.045,M.acc,g,"x");p2.position.x=x+.05*s;
    var c=cyl(.03,.04,M.metal,g,"x");c.position.x=(L/2-.27)*s;})}
  g.traverse(function(o){if(o.isMesh)o.castShadow=true});return g}
function makeDB(axis){var g=new T.Group();cyl(.016,.15,M.metal,g,"x");
  [-1,1].forEach(function(s){var h=cyl(.058,.065,M.plate,g,"x");h.position.x=.105*s;var c=cyl(.06,.012,M.acc,g,"x");c.position.x=.07*s});
  if(axis==="z")g.rotation.y=Math.PI/2;if(axis==="y")g.rotation.z=Math.PI/2;return g}
function tower(p,h,ang){var g=G(propG,p[0],0,p[2]);box([0,h/2,0],[.16,h,.16],M.frame,g);box([0,h-.06,0],[.2,.1,.2],M.acc,g);box([0,.03,0],[.5,.06,.5],M.frame,g);if(ang)g.rotation.y=ang*D;return g}
function bench(p,s){var g=G(propG,p[0],0,p[2]);box([0,s[1]-.04,0],[s[0],.08,s[2]],M.pad,g);box([0,s[1]-.09,0],[s[0]*.9,.02,s[2]*.96],M.acc,g);
  var lx=s[0]>s[2];[-1,1].forEach(function(k){box(lx?[k*(s[0]/2-.08),(s[1]-.1)/2,0]:[0,(s[1]-.1)/2,k*(s[2]/2-.1)],lx?[.06,s[1]-.1,s[2]*.8]:[s[0]*.8,s[1]-.1,.06],M.frame,g)});return g}
function seg(m,a,b){var d=new T.Vector3().subVectors(b,a),L=d.length();m.position.copy(a).addScaledVector(d,.5);m.scale.set(1,L||.001,1);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize())}
function buildProps(def){
  while(propG.children.length)propG.remove(propG.children[0]);dyn=[];
  ["L","R"].forEach(function(S){var h=J["hand"+S];for(var i=h.children.length-1;i>=0;i--)if(h.children[i].userData.prop)h.remove(h.children[i]);
    var k=J["kn"+S];for(i=k.children.length-1;i>=0;i--)if(k.children[i].userData.prop)k.remove(k.children[i])});
  (def.props||[]).forEach(function(p){
    if(p.t==="bench")bench(p.p,p.s);
    else if(p.t==="box"){var b=box(p.p,p.s,p.m==="acc"?M.acc:p.m==="pad"?M.pad:M.frame);if(p.rx)b.rotation.x=p.rx*D}
    else if(p.t==="tower")tower(p.p,p.h||2.1,p.ry);
    else if(p.t==="pullbar"){var g=G(propG,p.p[0],p.p[1],p.p[2]);cyl(.02,1.5,M.metal,g,"x");[-1,1].forEach(function(s){var c=box([.75*s,-p.p[1]/2,0],[.08,p.p[1],.08],M.frame,g)})}
    else if(p.t==="mat")box([0,.01,p.z||0],[.7,.02,1.9],M.pad);
    else if(p.t==="bar"){var bar=makeBar(p);propG.add(bar);dyn.push({k:"bar",o:bar,p:p})}
    else if(p.t==="db"){(p.hands||["L","R"]).forEach(function(S){var d=makeDB(p.axis);d.userData.prop=1;d.traverse(function(o){o.userData.prop=1});J["hand"+S].add(d)})}
    else if(p.t==="grips"){["L","R"].forEach(function(S){var c=cyl(.022,.13,M.pad,null,"z");c.rotation.set(0,0,0);c.userData.prop=1;J["hand"+S].add(c)})}
    else if(p.t==="band"){var bd=ms(new T.CylinderGeometry(.009,.009,1,8),M.acc,propG);dyn.push({k:"band",o:bd})}
    else if(p.t==="bars"){var bg=G(propG,0,0,p.z||0);[-1,1].forEach(function(s){var c=cyl(.022,.9,M.metal,bg,"z");c.position.set(.29*s,p.h,0);[-1,1].forEach(function(k){box([.29*s,p.h/2,.4*k],[.05,p.h,.05],M.frame,bg)})})}
    else if(p.t==="shinpad"){["L","R"].forEach(function(S){var c=cyl(.05,.16,M.pad,null,"x");c.position.set(0,-.33,p.back?-.08:.085);c.userData.prop=1;J["kn"+S].add(c)})}
    else if(p.t==="cable"){var lines=(p.each?["L","R"]:["M"]).map(function(S,i){var m=ms(new T.CylinderGeometry(.007,.007,1,8),M.cable,propG);var from=p.each?p.from[i]:p.from;
        ms(sph(),M.metal,propG,from[0],from[1],from[2],.04,.04,.04);return {m:m,S:S,from:new T.Vector3(from[0],from[1],from[2])}});
      if(!p.each&&p.rope){var rp=ms(new T.CylinderGeometry(.012,.012,1,8),M.cable,propG);dyn.push({k:"rope",o:rp})}
      dyn.push({k:"cable",lines:lines,p:p})}
    else if(p.t==="platform"){var pl=G(propG);box([0,0,0],[.6,.55,.05],M.frame,pl);box([0,0,.03],[.5,.45,.02],M.acc,pl);dyn.push({k:"platform",o:pl})}
    else if(p.t==="sled"){var sl=G(propG,0,0,p.z||0);var rail=box([0,0,0],[.5,.06,1.6],M.frame,sl);rail.position.set(0,.85,.95);rail.rotation.x=-45*D}
    else if(p.t==="seat"){var sg=G(propG,p.p[0],0,p.p[2]);box([0,p.h-.04,0],[.42,.08,.42],M.pad,sg);box([0,(p.h-.08)/2,0],[.08,p.h-.08,.08],M.frame,sg);box([0,.03,0],[.5,.06,.5],M.frame,sg);
      if(p.back!=null){var bk=box([0,0,0],[.42,.62,.08],M.pad,sg);var a=p.back*D;bk.rotation.x=a;bk.position.set(0,p.h+.3*Math.cos(a)+.02,-.24+.3*Math.sin(a));}}
    else if(p.t==="incline"){var ig=G(propG,0,0,0),o=p.o,a=p.ang*D;box([0,.42,o[2]+.12],[.34,.07,.42],M.pad,ig);box([0,.2,o[2]+.1],[.08,.4,.08],M.frame,ig);
      var bp=box([0,0,0],[.34,.9,.07],M.pad,ig);bp.rotation.x=a;var up=new T.Vector3(0,Math.cos(a),Math.sin(a)),bk2=new T.Vector3(0,Math.sin(a),-Math.cos(a));
      bp.position.set(0,o[1],o[2]).addScaledVector(up,.38).addScaledVector(bk2,.13);box([0,.03,o[2]-.2],[.5,.06,1],M.frame,ig);
      var st=box([0,0,0],[.06,.7,.06],M.frame,ig);st.position.set(0,.35,o[2]-.45)}
  });
  propG.traverse(function(o){if(o.isMesh){o.castShadow=true;o.receiveShadow=true}})}
function updProps(){dyn.forEach(function(d){
  if(d.k==="bar"){var a,b;if(d.p.at==="hips"){var q=J.root.getWorldQuaternion(new T.Quaternion());var c=J.root.localToWorld(new T.Vector3(0,-.02,.17));d.o.position.copy(c);d.o.quaternion.copy(q);return}
    a=wp("gripR");b=wp("gripL");var mid=a.clone().add(b).multiplyScalar(.5);if(d.p.off)mid.add(new T.Vector3().fromArray(d.p.off));d.o.position.copy(mid);
    var dir=b.clone().sub(a).normalize();d.o.quaternion.setFromUnitVectors(new T.Vector3(1,0,0),dir)}
  else if(d.k==="cable"){d.lines.forEach(function(l){var h=d.p.to?J[d.p.to].getWorldPosition(new T.Vector3()):l.S==="M"?avg(["gripL","gripR"]):wp("grip"+l.S);seg(l.m,l.from,h)})}
  else if(d.k==="rope"||d.k==="band"){seg(d.o,wp("gripL"),wp("gripR"))}
  else if(d.k==="platform"){var f=avg(["heelL","toeL","heelR","toeR"]);var n=new T.Vector3(0,-.7071,-.7071);d.o.position.copy(f).addScaledVector(n,.03);d.o.rotation.set(-45*D,0,0)}
})}

/* ---------- exercícios ---------- */
var BENCHLEG={hp:35,kn:55,an:0};
function L(o,b){for(var k in b)if(o[k]==null)o[k]=b[k];return o}
var EX={
bench:{cam:[62,16,3.3,.7],props:[{t:"bench",p:[0,0,-.18],s:[.34,.45,1.25]},{t:"bar",len:1.75}],
  A:L({root:{y:.575,z:.33,rx:-90},sh:[22,0,64],el:-96},BENCHLEG),B:L({root:{y:.575,z:.33,rx:-90},sh:[-86,0,14],el:-6},BENCHLEG)},
incline:{cam:[66,14,3.2,.85],props:[{t:"incline",o:[0,.55,.12],ang:-55},{t:"db",axis:"x"}],
  A:{root:{y:.55,z:.12,rx:-55},sh:[16,0,62],el:-96,hp:-35,kn:90},B:{root:{y:.55,z:.12,rx:-55},sh:[-112,0,12],el:-6,hp:-35,kn:90}},
cablefly:{cam:[28,10,3.6,1],ground:1,anchor:"feet",props:[{t:"tower",p:[1,0,-.25]},{t:"tower",p:[-1,0,-.25]},{t:"cable",each:1,from:[[.95,2.02,-.2],[-.95,2.02,-.2]]}],
  A:{sp:12,sh:[-28,0,76],el:-22,hpL:-14,knL:14,hpR:12,knR:6},B:{sp:12,sh:[-82,0,10],el:-16,hpL:-14,knL:14,hpR:12,knR:6}},
pushdown:{cam:[72,8,3.4,1],ground:1,anchor:"feet",props:[{t:"tower",p:[0,0,.72]},{t:"cable",from:[0,2,.62],rope:1}],
  A:{sp:12,sh:[-20,0,10],el:-108,kn:6,hp:-6},B:{sp:12,sh:[-14,0,10],el:-6,kn:6,hp:-6}},
skull:{cam:[62,16,3.3,.7],props:[{t:"bench",p:[0,0,-.18],s:[.34,.45,1.25]},{t:"bar",len:1.25,pr:.13}],
  A:L({root:{y:.575,z:.33,rx:-90},sh:[-108,0,7],el:-118},BENCHLEG),B:L({root:{y:.575,z:.33,rx:-90},sh:[-84,0,7],el:-5},BENCHLEG)},
benchdip:{cam:[70,10,3.4,.6],anchor:"hands",anchorAt:[0,.49,-.3],props:[{t:"bench",p:[0,0,-.42],s:[1.1,.45,.34]}],
  A:{sh:[26,0,8],el:0,hp:-52,kn:0,an:-8},B:{sh:[76,0,8],el:-78,hp:-66,kn:4,an:-12}},
pulldown:{cam:[34,10,3.5,1.15],props:[{t:"seat",p:[0,0,0],h:.47},{t:"box",p:[0,.72,.2],s:[.4,.08,.08],m:"pad"},{t:"tower",p:[0,0,-.5],h:2.45},{t:"cable",from:[0,2.38,-.1]},{t:"bar",len:1.3,plates:false}],
  A:{root:{y:.59,rx:-8},sh:[0,0,166],tw:90,el:-14,hp:-82,kn:90},B:{root:{y:.59,rx:-14},sh:[-14,0,42],tw:90,el:-126,hp:-76,kn:90,nk:6}},
bbrow:{cam:[74,8,3.5,.75],ground:1,anchor:"feet",props:[{t:"bar",len:1.75}],
  A:{root:{rx:50},hp:-62,kn:22,an:-10,sh:[-50,0,8],el:0,nk:-26},B:{root:{rx:50},hp:-62,kn:22,an:-10,sh:[18,0,22],el:-70,nk:-26}},
dbrow:{cam:[-62,10,3.5,.75],ground:1,anchor:"feet",props:[{t:"bench",p:[.22,0,.62],s:[.34,.42,.8]},{t:"db",hands:["R"],axis:"z"}],
  A:{root:{rx:68},hpL:-95,knL:34,anL:-7,hpR:-58,knR:6,anR:-16,shL:[-68,0,2],elL:0,shR:[-70,0,4],elR:0,nk:-28},
  B:{root:{rx:68},hpL:-95,knL:34,anL:-7,hpR:-58,knR:6,anR:-16,shL:[-68,0,2],elL:0,shR:[12,0,10],elR:-82,nk:-28}},
cablerow:{cam:[78,10,3.5,.7],props:[{t:"box",p:[0,.21,-.05],s:[.34,.42,.62],m:"pad"},{t:"box",p:[0,.2,.9],s:[.5,.4,.06]},{t:"tower",p:[0,0,1.2],h:1},{t:"cable",from:[0,.78,1.15],rope:1}],
  A:{root:{y:.53},sp:18,sh:[-108,0,8],el:0,hp:-84,kn:24,an:-18},B:{root:{y:.53},sp:-4,sh:[38,0,12],el:-124,hp:-84,kn:24,an:-18}},
curl:{cam:[40,8,3.3,1],ground:1,anchor:"feet",props:[{t:"bar",len:1.25,pr:.13}],
  A:{sh:[-4,0,8],el:-6,kn:4},B:{sh:[-18,0,8],el:-140,kn:4}},
hammer:{cam:[40,8,3.3,1],ground:1,anchor:"feet",props:[{t:"db",axis:"z"}],
  A:{sh:[-3,0,6],el:-6,kn:4},B:{sh:[-16,0,6],el:-138,kn:4}},
squat:{cam:[60,10,3.6,.9],ground:1,anchor:"feet",props:[{t:"bar",len:1.75,off:[0,.03,-.07]}],
  A:{sh:[-50,0,70],tw:90,el:-120,hp:[0,0,8],kn:3},B:{root:{rx:40},sh:[-50,0,70],tw:90,el:-120,hp:[-120,0,10],kn:106,an:-26,nk:-28}},
airsquat:{cam:[48,10,3.6,.9],ground:1,anchor:"feet",props:[],
  A:{sh:[0,0,6],hp:[0,0,8],kn:3},B:{root:{rx:40},sh:[-130,0,10],hp:[-120,0,10],kn:106,an:-26,nk:-28}},
legpress:{cam:[82,10,3.8,.9],props:[{t:"incline",o:[0,.52,0],ang:-55},{t:"platform"},{t:"sled"}],
  A:{root:{y:.52,rx:-55},hp:[-118,0,10],kn:94,an:-58,sh:[-18,0,26],el:-20},B:{root:{y:.52,rx:-55},hp:[-80,0,10],kn:4,an:-2,sh:[-18,0,26],el:-20}},
legext:{cam:[74,10,3.4,.75],props:[{t:"seat",p:[0,0,.02],h:.47,back:-10},{t:"shinpad"}],
  A:{root:{y:.59,rx:-10},hp:-80,kn:88,sh:[-10,0,26],el:-30},B:{root:{y:.59,rx:-10},hp:-80,kn:4,an:6,sh:[-10,0,26],el:-30}},
seatcurl:{cam:[74,10,3.4,.75],props:[{t:"seat",p:[0,0,.02],h:.47,back:-10},{t:"shinpad",back:1}],
  A:{root:{y:.59,rx:-10},hp:-80,kn:4,sh:[-10,0,26],el:-30},B:{root:{y:.59,rx:-10},hp:-80,kn:100,sh:[-10,0,26],el:-30}},
legcurl:{cam:[68,16,3.6,.6],props:[{t:"bench",p:[0,0,.05],s:[.36,.5,1.25]},{t:"shinpad",back:1}],
  A:{root:{y:.64,z:-.08,rx:90},hp:0,kn:4,sh:[-150,0,22],el:-30,nk:-30},B:{root:{y:.64,z:-.08,rx:90},hp:0,kn:110,sh:[-150,0,22],el:-30,nk:-30}},
calf:{cam:[64,6,3.2,.8],ground:1,anchor:"feet",props:[],
  A:{sh:[0,0,12],el:-22,an:-12},B:{sh:[0,0,12],el:-22,an:34}},
ohp:{cam:[34,10,3.5,1.15],ground:1,anchor:"feet",props:[{t:"db",axis:"x"}],
  A:{sh:[-10,0,82],tw:90,el:-96,kn:3},B:{sh:[-4,0,168],tw:90,el:-8,kn:3}},
latraise:{cam:[20,8,3.4,1.05],ground:1,anchor:"feet",props:[{t:"db",axis:"z"}],
  A:{sp:6,sh:[-6,0,10],el:-12,kn:4},B:{sp:6,sh:[-6,0,86],el:-12,kn:4}},
facepull:{cam:[52,10,3.6,1.15],ground:1,anchor:"feet",props:[{t:"tower",p:[0,0,1.15]},{t:"cable",from:[0,1.6,1.05],rope:1}],
  A:{sp:-4,sh:[-94,0,8],el:-4,hpL:-12,knL:10,hpR:10,knR:4},B:{sp:-4,sh:[-6,0,88],tw:90,el:-100,hpL:-12,knL:10,hpR:10,knR:4}},
revfly:{cam:[30,14,3.5,.8],ground:1,anchor:"feet",props:[{t:"db",axis:"z"}],
  A:{root:{rx:65},hp:-75,kn:18,an:-8,sh:[-65,0,10],el:-12,nk:-26},B:{root:{rx:65},hp:-75,kn:18,an:-8,sh:[-65,0,84],el:-16,nk:-26}},
cablecrunch:{cam:[72,10,3.6,.7],ground:1,anchor:"knees",props:[{t:"tower",p:[0,0,1.3],h:2.2},{t:"cable",from:[0,2.1,1.2],rope:1}],
  A:{sp:6,sh:[-150,0,24],el:-118,hp:0,kn:92,an:58},B:{root:{rx:18},sp:38,ch:20,nk:10,sh:[-150,0,24],el:-118,hp:-24,kn:92,an:58}},
legraise:{cam:[70,16,3.4,.35],props:[{t:"mat"}],
  A:{root:{y:.13,z:-.15,rx:-90},hp:-6,kn:3,sh:[-8,0,10],an:8},B:{root:{y:.13,z:-.15,rx:-90},hp:-88,kn:3,sh:[-8,0,10],an:8}},
rdl:{cam:[74,8,3.5,.8],ground:1,anchor:"feet",props:[{t:"bar",len:1.75}],
  A:{sh:[-4,0,9],el:0,kn:6},B:{root:{rx:72},hp:-94,kn:26,an:-4,sh:[-72,0,9],el:0,nk:-18}},
hipthrust:{cam:[70,12,3.6,.55],ground:1,anchor:"feet",props:[{t:"bench",p:[0,0,-.62],s:[1.1,.42,.34]},{t:"bar",at:"hips",len:1.75}],
  A:{root:{rx:-52},hp:-62,kn:114,an:0,sh:[-14,0,42],el:-18,nk:20},B:{root:{rx:-92},hp:2,kn:90,an:0,sh:[-14,0,42],el:-18,nk:30}},
bulgarian:{cam:[72,8,3.6,.75],ground:1,anchor:"footL",props:[{t:"bench",p:[-.09,0,-.78],s:[.36,.45,.4]},{t:"db",axis:"z"}],
  A:{sp:10,hpL:-16,knL:12,anL:4,hpR:22,knR:70,anR:88,sh:[-10,0,6],el:-4},B:{sp:16,hpL:-82,knL:96,anL:-14,hpR:2,knR:104,anR:76,sh:[-16,0,6],el:-4}},
abduction:{cam:[14,22,3.3,.7],props:[{t:"seat",p:[0,0,.02],h:.47,back:-10}],
  A:{root:{y:.59,rx:-10},hp:[-80,0,4],kn:86,sh:[-14,0,22],el:-40},B:{root:{y:.59,rx:-10},hp:[-80,0,36],kn:86,sh:[-14,0,22],el:-40}},
pullup:{cam:[30,6,4.2,1.5],anchor:"hands",anchorAt:[0,2.3,0],props:[{t:"pullbar",p:[0,2.3,0]}],
  A:{sh:[-5,0,166],tw:90,el:-12,hp:-6,kn:26,an:20,nk:-6},B:{sh:[-16,0,40],tw:90,el:-128,hp:-18,kn:38,an:20,nk:10}},
pushup:{cam:[70,14,3.4,.4],anchor:"hands",anchorAt:[0,.045,.3],props:[{t:"mat"}],
  A:{root:{rx:81},sh:[-6,0,30],el:-74,an:9,nk:-10},B:{root:{rx:63},sh:[-63,0,12],el:0,an:27,nk:-10}},
climber:{cam:[66,14,3.4,.4],anchor:"hands",anchorAt:[0,.045,.3],tempo:[.32,.04,.32,.04],props:[{t:"mat"}],
  A:{root:{rx:64},sh:[-64,0,10],el:0,an:26,hpL:-100,knL:110,anL:10,nk:-12},B:{root:{rx:64},sh:[-64,0,10],el:0,an:26,hpR:-100,knR:110,anR:10,nk:-12}}
};

/* ---------- variações (alternativas) ---------- */
function VAR(base,o){var b=EX[base],r={},k;for(k in b)r[k]=b[k];for(k in o){if(k==="A"||k==="B")r[k]=Object.assign({},b[k],o[k]);else if(k==="AB"){r.A=Object.assign({},r.A||b.A,o.AB);r.B=Object.assign({},r.B||b.B,o.AB)}else r[k]=o[k]}return r}
var BENCHP={t:"bench",p:[0,0,-.18],s:[.34,.45,1.25]},SEATB={t:"seat",p:[0,0,.02],h:.47,back:-8},SEATED={root:{y:.59,rx:-8},hp:-82,kn:90};
function SX(o){return Object.assign({},SEATED,o)}
var NEW={
dbbench:VAR("bench",{props:[BENCHP,{t:"db",axis:"x"}]}),
dbfly:VAR("bench",{props:[BENCHP,{t:"db",axis:"z"}],A:{sh:[6,0,84],el:-24},B:{sh:[-86,0,10],el:-16}}),
chestpress:{cam:[64,12,3.4,.95],props:[SEATB,{t:"tower",p:[0,0,-.55],h:1.9},{t:"grips"}],A:SX({sh:[12,0,62],el:-98}),B:SX({sh:[-84,0,14],el:-6})},
pecdeck:{cam:[30,12,3.4,.95],props:[SEATB,{t:"tower",p:[0,0,-.55],h:1.9},{t:"grips"}],A:SX({sh:[-22,0,82],el:-26}),B:SX({sh:[-84,0,12],el:-22})},
inclinebar:VAR("incline",{props:[{t:"incline",o:[0,.55,.12],ang:-55},{t:"bar",len:1.75}]}),
ohext:{cam:[62,8,3.4,1.1],ground:1,anchor:"feet",props:[{t:"db",hands:["R"],axis:"y"}],A:{sh:[-164,0,8],el:-136,kn:3},B:{sh:[-170,0,8],el:-8,kn:3}},
dips:{cam:[66,8,3.8,1.1],anchor:"hands",anchorAt:[0,1.29,0],props:[{t:"bars",h:1.25}],A:{sh:[6,0,8],el:0,hp:-14,kn:70,an:20},B:{sp:14,sh:[70,0,12],el:-84,hp:-20,kn:72,an:20}},
invrow:{cam:[72,12,3.7,.6],anchor:"hands",anchorAt:[0,1.02,0],props:[{t:"pullbar",p:[0,1.02,0]}],A:{root:{rx:-74},sh:[-106,0,12],el:0,an:-10},B:{root:{rx:-58},sh:[-24,0,40],el:-108,an:-24}},
dbbentrow:VAR("bbrow",{props:[{t:"db",axis:"z"}]}),
dbcurl:VAR("curl",{props:[{t:"db",axis:"x"}]}),
cablecurl:VAR("curl",{props:[{t:"tower",p:[0,0,.75],h:.35},{t:"cable",from:[0,.22,.66]},{t:"bar",len:.7,plates:false}]}),
cablehammer:VAR("hammer",{props:[{t:"tower",p:[0,0,.75],h:.35},{t:"cable",from:[0,.22,.66],rope:1}]}),
goblet:VAR("airsquat",{props:[{t:"bar",len:.3,pr:.075,off:[0,0,.03]}],A:{sh:[-28,0,14],tw:-50,el:-128,hp:[0,0,10],kn:3},B:{root:{rx:32},sh:[-60,0,14],tw:-50,el:-122,hp:[-118,0,12],kn:108,an:-26,nk:-24}}),
sumo:VAR("airsquat",{props:[{t:"bar",len:.3,pr:.075}],A:{sh:[-4,0,-19],el:-4,hp:[0,0,22],kn:3,an:[0,-20,0]},B:{root:{rx:22},sh:[-24,0,-19],el:-4,hp:[-100,0,26],kn:96,an:[-22,-20,0],nk:-16}}),
lunge:{cam:[74,8,3.6,.8],ground:1,anchor:"footL",props:[{t:"db",axis:"z"}],A:{sp:4,hpL:-14,knL:10,anL:4,hpR:18,knR:8,anR:26,sh:[-4,0,6]},B:{sp:6,hpL:-84,knL:94,anL:-10,hpR:6,knR:98,anR:48,sh:[-8,0,6]}},
rdldb:VAR("rdl",{props:[{t:"db",axis:"x"}]}),
calfuni:VAR("calf",{props:[{t:"db",hands:["R"],axis:"z"}],A:{sh:[0,0,12],el:-22,an:-12,hpL:-14,knL:70,anL:10},B:{sh:[0,0,12],el:-22,an:34,hpL:-14,knL:70,anL:10}}),
calfbar:VAR("calf",{props:[{t:"bar",len:1.75,off:[0,.03,-.07]}],AB:{sh:[-50,0,70],tw:90,el:-120}}),
lpcalf:VAR("legpress",{A:{hp:[-80,0,10],kn:3,an:-16},B:{hp:[-80,0,10],kn:3,an:30}}),
ohpbar:VAR("ohp",{props:[{t:"bar",len:1.5,pr:.17}]}),
ohpseat:{cam:[34,10,3.6,1.2],props:[{t:"seat",p:[0,0,.02],h:.47,back:-2},{t:"db",axis:"x"}],A:{root:{y:.59,rx:-2},hp:-88,kn:88,sh:[-10,0,82],tw:90,el:-96},B:{root:{y:.59,rx:-2},hp:-88,kn:88,sh:[-4,0,168],tw:90,el:-8}},
latseat:{cam:[20,10,3.5,1],props:[{t:"seat",p:[0,0,.02],h:.47},{t:"db",axis:"z"}],A:{root:{y:.59},hp:-88,kn:88,sh:[-6,0,10],el:-12},B:{root:{y:.59},hp:-88,kn:88,sh:[-6,0,86],el:-12}},
cablelat:{cam:[20,8,3.6,1],ground:1,anchor:"feet",props:[{t:"cable",each:1,from:[[-.3,.12,.08],[.3,.12,.08]]}],A:{sp:4,sh:[-6,0,12],el:-12,kn:4},B:{sp:4,sh:[-6,0,84],el:-12,kn:4}},
uprow:{cam:[30,8,3.4,1.05],ground:1,anchor:"feet",props:[{t:"bar",len:1.25,pr:.13}],A:{sh:[-4,0,6],el:-4,kn:3},B:{sh:[-8,0,94],tw:-90,el:-128,kn:3}},
revpec:{cam:[36,14,3.5,1],props:[{t:"seat",p:[0,0,.02],h:.47},{t:"box",p:[0,1.0,.26],s:[.32,.5,.08],m:"pad"},{t:"grips"}],A:{root:{y:.59},hp:-88,kn:88,sh:[-88,0,10],el:-10},B:{root:{y:.59},hp:-88,kn:88,sh:[-88,0,82],el:-14}},
bandpull:{cam:[34,8,3.5,1.1],ground:1,anchor:"feet",props:[{t:"band"}],A:{sh:[-88,0,12],el:-4,kn:3},B:{sh:[-88,0,84],el:-6,kn:3}},
crunch:{cam:[72,18,3.3,.35],props:[{t:"mat"}],A:{root:{y:.12,z:-.2,rx:-90},hp:-45,kn:105,an:30,sh:[-150,0,30],el:-120},B:{root:{y:.12,z:-.2,rx:-90},sp:30,ch:18,nk:10,hp:-45,kn:105,an:30,sh:[-150,0,30],el:-120}},
hangraise:{cam:[60,6,4.2,1.4],anchor:"hands",anchorAt:[0,2.3,0],props:[{t:"pullbar",p:[0,2.3,0]}],A:{sh:[-5,0,164],tw:90,el:-10,hp:-6,kn:10,an:20},B:{sh:[-5,0,164],tw:90,el:-10,hp:-96,kn:24,an:20}},
plank:{cam:[66,14,3.4,.4],anchor:"hands",anchorAt:[0,.05,.32],tempo:[1.6,.2,1.6,.2],props:[{t:"mat"}],A:{root:{rx:79},sh:[-79,0,8],el:-90,an:12,nk:-12},B:{root:{rx:79},sp:-3,sh:[-79,0,8],el:-90,an:12,nk:-8}},
bridge:{cam:[70,14,3.4,.35],ground:1,anchor:"feet",props:[{t:"mat"}],A:{root:{rx:-92},hp:-48,kn:112,an:26,sh:[2,0,14],nk:12},B:{root:{rx:-112},hp:12,kn:96,an:16,sh:[22,0,14],nk:30}},
hipthrustdb:VAR("hipthrust",{props:[{t:"bench",p:[0,0,-.62],s:[1.1,.42,.34]},{t:"bar",at:"hips",len:.36,pr:.075}]}),
cableabd:{cam:[8,10,3.4,.8],ground:1,anchor:"footL",props:[{t:"tower",p:[-.65,0,.1],h:1.1},{t:"cable",from:[-.6,.1,.05],to:"anR"}],A:{shL:[-20,0,40],elL:-30,hpR:[0,0,4],knR:4},B:{shL:[-20,0,40],elL:-30,hpR:[0,0,40],knR:4,sp:[0,0,-6]}},
chinup:VAR("pullup",{A:{sh:[-168,0,12],tw:0,el:-10,hp:-6,kn:26,an:20},B:{sh:[-22,0,14],tw:0,el:-142,hp:-18,kn:38,an:20,nk:10}}),
pushinc:{cam:[70,12,3.5,.6],anchor:"hands",anchorAt:[0,.5,.42],props:[{t:"bench",p:[0,0,.45],s:[1,.45,.34]}],A:{root:{rx:58},sh:[-6,0,32],el:-76,an:20,nk:-10},B:{root:{rx:44},sh:[-44,0,12],el:0,an:30,nk:-10}}
};
for(var nk in NEW)EX[nk]=NEW[nk];

/* ---------- motor ---------- */
function ease(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2}
function blendAt(time,def){var tp=def.tempo||[1.05,.35,1.35,.45],Tt=tp[0]+tp[1]+tp[2]+tp[3],rep=Math.floor(time/Tt),t=time-rep*Tt;
  var b=t<tp[0]?ease(t/tp[0]):t<tp[0]+tp[1]?1:t<tp[0]+tp[1]+tp[2]?1-ease((t-tp[0]-tp[1])/tp[2]):0;return {b:b,rep:rep}}
function setEx(id){var def=EX[id];if(!def)return;cur={def:def,A:resolve(def.A),B:resolve(def.B)};curId=id;
  buildProps(def);anchorRef=(def.anchor&&!def.anchorAt)?new T.Vector3(def.anchor==="footL"?.09:0,0,def.az||0):null;solve(def,cur.A);updProps();orbit.yaw=0;orbit.pitch=0;t0=performance.now();tPaused=0;lastRep=-1}
function pose(b){if(!cur)return;solve(cur.def,lerpP(cur.A,cur.B,b));updProps()}
function camUpd(){if(!cur)return;var c=cur.def.cam,yw=(c[0]+orbit.yaw)*D,pt=Math.max(-5,Math.min(70,c[1]+orbit.pitch))*D,ds=c[2]*(canvas.clientWidth<500?1.12:1);
  cam.position.set(Math.sin(yw)*Math.cos(pt)*ds,c[3]+Math.sin(pt)*ds,Math.cos(yw)*Math.cos(pt)*ds);cam.lookAt(0,c[3],0)}
function size(){if(!r)return;var w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
function frame(now){raf=requestAnimationFrame(frame);if(!cur)return;
  var tt=paused?tPaused:((now-t0)/1000*speed);if(!paused)tPaused=tt;
  var s=blendAt(tt,cur.def);pose(s.b);if(s.rep!==lastRep){lastRep=s.rep;onRep&&onRep(s.rep)}
  if(ring)ring.rotation.z+=.003;camUpd();r.render(sc,cam)}
function init(cv){if(r||!T)return !!r;canvas=cv;
  try{r=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true})}catch(e){return false}
  r.setPixelRatio(Math.min(window.devicePixelRatio||1,2));r.outputEncoding=T.sRGBEncoding;r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=1.05;
  r.shadowMap.enabled=true;r.shadowMap.type=T.PCFSoftShadowMap;
  sc=new T.Scene();cam=new T.PerspectiveCamera(36,1,.05,50);mats();
  sc.add(new T.HemisphereLight(0xcfe3ff,0x2a1a10,.75));
  var key=new T.DirectionalLight(0xfff1e6,1.5);key.position.set(2.5,5,3.5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);
  var sc2=key.shadow.camera;sc2.left=-2.2;sc2.right=2.2;sc2.top=2.8;sc2.bottom=-1;sc2.near=.5;sc2.far=14;key.shadow.bias=-.0004;key.shadow.radius=4;sc.add(key);
  var rim=new T.DirectionalLight(0x6fd3ff,1.1);rim.position.set(-3,3,-4);sc.add(rim);
  var rim2=new T.PointLight(0xff6b2c,1.2,8);rim2.position.set(2.5,1.2,-2.5);sc.add(rim2);
  var fl=new T.Mesh(new T.CircleGeometry(2.4,64),new T.MeshStandardMaterial({color:new T.Color(0x161d27).convertSRGBToLinear(),roughness:.85}));fl.rotation.x=-Math.PI/2;fl.receiveShadow=true;sc.add(fl);
  ring=new T.Mesh(new T.RingGeometry(2.2,2.24,96),new T.MeshBasicMaterial({color:0xff6b2c,transparent:true,opacity:.75}));ring.rotation.x=-Math.PI/2;ring.position.y=.003;sc.add(ring);
  var r2=new T.Mesh(new T.RingGeometry(1.2,1.215,96),new T.MeshBasicMaterial({color:0xc6ff3d,transparent:true,opacity:.25}));r2.rotation.x=-Math.PI/2;r2.position.y=.003;sc.add(r2);
  propG=new T.Group();sc.add(propG);chr=G(sc);chr.add(buildChar());
  window.addEventListener("resize",size);
  var drag=null;cv.addEventListener("pointerdown",function(e){drag={x:e.clientX,y:e.clientY,yw:orbit.yaw,pt:orbit.pitch};try{cv.setPointerCapture(e.pointerId)}catch(_){}});
  cv.addEventListener("pointermove",function(e){if(!drag)return;orbit.yaw=drag.yw-(e.clientX-drag.x)*.45;orbit.pitch=drag.pt+(e.clientY-drag.y)*.25});
  cv.addEventListener("pointerup",function(){drag=null});cv.addEventListener("pointercancel",function(){drag=null});
  return true}
function start(){if(running)return;running=true;size();raf=requestAnimationFrame(frame)}
function stop(){running=false;cancelAnimationFrame(raf)}
return {init:init,play:function(id){setEx(id);size()},start:start,stop:stop,
  pause:function(p){paused=p;if(!p)t0=performance.now()-tPaused/speed*1000},isPaused:function(){return paused},
  setSpeed:function(s){var tt=tPaused;speed=s;t0=performance.now()-tt/speed*1000},
  resetView:function(){orbit.yaw=0;orbit.pitch=0},onRep:function(f){onRep=f},has:function(id){return !!EX[id]},
  debug:function(id,b){setEx(id);size();pose(b);camUpd();r.render(sc,cam)}};
})();
