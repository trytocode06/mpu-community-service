"use strict";
/* Sort It Right: 5 stages, fix the mixed-up bins */
var MAX_LIVES=3; // Sort It Right: lives for the whole run (shared across all 5 stages)
// per stage: difficulty of misplaced items, max difficulty of all items, number misplaced
var BAND=[[1],[1],[2],[2,3],[3]],MAXD=[1,1,2,3,3],MIS=[2,2,3,3,3];
var NODES=[[20,112],[68,92],[28,68],[72,44],[36,18]]; // map node positions (x, y in a 100x130 box)
/* Progress and lives live in this object only (no storage) */
var ST={lives:MAX_LIVES,unlocked:1,stars:[0,0,0,0,0],stage:1,items:[],sel:null,on:false};
function resetRun(){ST.lives=MAX_LIVES;ST.unlocked=1;ST.stars=[0,0,0,0,0];saveSort()}
var sortReady=loadSort(); // saved progress is applied before the map first opens
function starStr(n){return"★".repeat(n)+"☆".repeat(3-n)}

/* Build 12 items (3 per bin). Pick k bins, take one item from each, then rotate those items to the next
   chosen bin: every bin keeps 3 items and no misplaced item starts in its own bin. */
function buildStage(n){
 var keys=Object.keys(BINS),band=BAND[n-1],maxd=MAXD[n-1],k=MIS[n-1],items=[];
 var cand=shuffle(keys.filter(function(b){return POOL.some(function(x){return x.b===b&&band.indexOf(x.d)>-1})})).slice(0,k);
 var mis=cand.map(function(b){var p=POOL.filter(function(x){return x.b===b&&band.indexOf(x.d)>-1});return p[Math.floor(Math.random()*p.length)]});
 keys.forEach(function(b){
  var ci=cand.indexOf(b),own=ci>-1?[mis[ci]]:[];
  var rest=shuffle(POOL.filter(function(x){return x.b===b&&x.d<=maxd&&own.indexOf(x)<0}));
  own.concat(rest).slice(0,3).forEach(function(x){items.push({n:x.n,e:x.e,b:x.b,h:x.h,at:b})});
 });
 mis.forEach(function(m,i){items.forEach(function(x){if(x.n===m.n)x.at=cand[(i+1)%k]})});
 return shuffle(items);
}
function shud(broke){
 var h="";for(var i=0;i<MAX_LIVES;i++)h+='<span class="heart'+(broke&&i===ST.lives?" break":"")+'">'+(i<ST.lives?"❤️":"💔")+'</span>';
 $("#hearts").innerHTML=h;
}
function renderSort(animId,cls){
 Object.keys(BINS).forEach(function(k){
  var slot=$("#slot-"+k);slot.innerHTML="";
  ST.items.filter(function(x){return x.at===k}).forEach(function(x){
   var c=document.createElement("div");c.className="chip"+(x===ST.sel?" sel":"");c.innerHTML="<b>"+x.e+"</b><span>"+x.n+"</span>";
   wireChip(c,x);slot.appendChild(c);if(x.n===animId)anim(c,cls);
  });
 });
}
/* drag (mouse + touch) or tap-to-select on a chip */
function wireChip(el,item){
 el.addEventListener("click",function(e){e.stopPropagation()});
 el.addEventListener("pointerdown",function(e){
  e.preventDefault();if(!ST.on)return;
  var sx=e.clientX,sy=e.clientY,ghost=null,moved=false;
  try{el.setPointerCapture(e.pointerId)}catch(_){}
  function binAt(x,y){var t=document.elementFromPoint(x,y);return t&&t.closest?t.closest(".sbin"):null}
  function mv(ev){
   if(!moved&&Math.hypot(ev.clientX-sx,ev.clientY-sy)<8)return;
   if(!moved){moved=true;ghost=el.cloneNode(true);ghost.className="chip ghost";document.body.appendChild(ghost);el.classList.add("drag")}
   ghost.style.left=ev.clientX+"px";ghost.style.top=ev.clientY+"px";
   var b=binAt(ev.clientX,ev.clientY);document.querySelectorAll(".sbin").forEach(function(x){x.classList.toggle("over",x===b)});
  }
  function up(ev){
   el.removeEventListener("pointermove",mv);el.removeEventListener("pointerup",up);el.removeEventListener("pointercancel",up);
   document.querySelectorAll(".sbin").forEach(function(x){x.classList.remove("over")});
   if(!moved){ST.sel=ST.sel===item?null:item;renderSort();return}
   var b=binAt(ev.clientX,ev.clientY);ghost.remove();el.classList.remove("drag");
   if(b&&ev.type==="pointerup")place(item,b.dataset.bin);
  }
  el.addEventListener("pointermove",mv);el.addEventListener("pointerup",up);el.addEventListener("pointercancel",up);
 });
}
/* Correct bin: snap in. Any other bin: lose exactly 1 life, chip shakes and stays put. */
function place(item,k){
 if(!ST.on||item.at===k)return;
 var binEl=document.querySelector('.sbin[data-bin="'+k+'"]');
 if(k===item.b){
  item.at=k;ST.sel=null;renderSort(item.n,"bounce");anim(binEl,"bounce");pop(binEl,"✔","#7dff8f");
  if(ST.items.every(function(x){return x.at===x.b}))clearStage();
 }else{
  ST.sel=null;renderSort(item.n,"shake");pop(binEl,"💔","#ff8a8a");
  ST.lives--;shud(true);
  if(ST.lives<=0){ST.on=false;setTimeout(function(){show("s-over")},900)}
 }
}
/* Stars = lives left (scaled to MAX_LIVES). Stages 1-4 show a popup; stage 5 shows Victory. */
function clearStage(){
 ST.on=false;
 var n=ST.stage,st=Math.max(1,Math.round(3*ST.lives/MAX_LIVES));
 ST.stars[n-1]=Math.max(ST.stars[n-1],st);ST.unlocked=Math.max(ST.unlocked,Math.min(5,n+1));saveSort();
 if(n===5){$("#winStars").textContent=starStr(st);setTimeout(function(){show("s-win");confetti()},600)}
 else{$("#popTitle").textContent="STAGE "+n+" CLEAR!";$("#popStars").textContent=starStr(st);setTimeout(function(){$("#pop").classList.add("on")},600)}
}
function startStage(n){
 ST.lives=MAX_LIVES; // every new stage starts with full lives
 ST.stage=n;ST.items=buildStage(n);ST.sel=null;ST.on=true;
 $("#stg").textContent="STAGE "+n;shud(false);renderSort();show("s-sort");
}
async function openMap(){
 ST.on=false;await sortReady;
 var m=$("#map");m.querySelectorAll(".node").forEach(function(x){x.remove()});
 NODES.forEach(function(p,i){
  var n=i+1,locked=n>ST.unlocked,done=ST.stars[i]>0,b=document.createElement("button");
  b.className="node"+(locked?" lock":done?" done":" cur");
  b.style.left=p[0]+"%";b.style.top=(p[1]/130*100)+"%";
  b.innerHTML=(locked?"🔒":n)+(done?'<i class="nstars">'+starStr(ST.stars[i])+"</i>":"");
  b.setAttribute("aria-label","Stage "+n+(locked?" (locked)":""));
  b.onclick=function(){if(locked){anim(b,"nshake");return}startStage(n)};
  m.appendChild(b);
 });
 show("s-map");
}
(function(){ // build the 4 bins once; each bin accepts drops and taps
 var g=$("#sgrid");
 Object.keys(BINS).forEach(function(k){
  var d=document.createElement("div");d.className="sbin";d.dataset.bin=k;
  d.innerHTML=binSVG(k)+'<span class="lab">'+BINS[k].label+'</span><div class="slot" id="slot-'+k+'"></div>';
  d.addEventListener("click",function(){if(ST.sel&&ST.on)place(ST.sel,k)});
  g.appendChild(d);
 });
})();
