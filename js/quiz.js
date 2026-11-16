"use strict";
/* Quiz It Right: Quiz mode (10 items) and Unlimited mode (3 lives) */
/* gm = game mode: "quiz" (10 items) or "unl" (unlimited, 3 lives) */
var S={gm:"quiz",name:"",score:0,streak:0,best:0,mistakes:0,correct:0,lives:3,t0:0,tick:null,sel:false,queue:[],cur:null,nxt:null,last:null,prev:"s-home",over:false};

/* ---- flow: home -> name -> game -> results ---- */
function toName(){
 $("#modeTag").textContent=S.gm==="quiz"?"QUIZ MODE – sort 10 items":"UNLIMITED MODE – 3 lives, endless items";
 $("#uname").value="";$("#uerr").textContent="";show("s-name");$("#uname").focus();
}
function start(){
 var n=$("#uname").value.trim();
 if(!/^\w{3,16}$/.test(n)){$("#uerr").textContent="Oops! Use 3–16 letters, numbers or underscores (no spaces).";$("#uname").focus();return}
 $("#uerr").textContent="";S.name=n;newRound();
}
function pick(){ // unlimited: random item, never the same twice in a row
 var it;do{it=ITEMS[Math.floor(Math.random()*ITEMS.length)]}while(it===S.last);S.last=it;return it;
}
function newRound(){
 S.score=0;S.streak=0;S.best=0;S.mistakes=0;S.correct=0;S.lives=3;S.over=false;S.last=null;
 if(S.gm==="quiz"){S.queue=shuffle(ITEMS.slice());S.cur=S.queue.shift();S.nxt=S.queue.shift()}
 else{S.cur=pick();S.nxt=pick()}
 $("#lifeBox").style.display=S.gm==="unl"?"block":"none";
 $("#xpbar").style.width="0";$("#hint").classList.remove("show");
 draw();hud();show("s-game");
 clearInterval(S.tick);S.t0=performance.now();$("#timer").textContent="0.0";
 S.tick=setInterval(function(){$("#timer").textContent=((performance.now()-S.t0)/1000).toFixed(1)},100);
 load(S.gm).then(function(d){renderRows($("#miniList"),sortBoard(d).slice(0,10),"",true)});
}
function draw(){
 $("#curName").textContent=S.cur.n;$("#cur").innerHTML="<b>"+S.cur.e+"</b>";anim($("#cur"),"pin");
 $("#nextc").innerHTML="<b>"+(S.nxt?S.nxt.e:"🏁")+"</b>";select(false);
}
function advance(){S.cur=S.nxt;S.nxt=S.gm==="unl"?pick():(S.queue.shift()||null);draw()}
function mult(){return Math.min(1+Math.floor(S.streak/3),5)} // unlimited: x2 after 3 in a row, x3 after 6... max x5
function hud(){
 $("#score").textContent=fmt(S.score);
 $("#lifeBox").textContent=new Array(S.lives+1).join("❤️")+new Array(4-S.lives).join("🖤")+"  🔥 x"+mult();
}
function select(v){S.sel=v;$("#cur").classList.toggle("sel",v)}

/* Called once per drop (drag or tap). Quiz: 10/15/20/25 streak ladder, -5 wrong.
   Unlimited: 10 x multiplier, wrong = lose a life + streak reset. */
function onItemDropped(item,bin){
 if(S.over)return;
 var binEl=document.querySelector('.bin[data-bin="'+bin+'"]'),hint=$("#hint");
 if(item.b===bin){
  var pts,m=mult();
  if(S.gm==="quiz"){S.streak++;pts=Math.min(10+(S.streak-1)*5,25)}else{pts=10*m;S.streak++}
  S.best=Math.max(S.best,S.streak);S.score+=pts;S.correct++;
  anim(binEl,"bounce");pop(binEl,"+"+pts+(S.gm==="unl"?(m>1?" x"+m:""):(S.streak>1?" 🔥":" 🪙")));hint.classList.remove("show");
  if(S.gm==="quiz"){$("#xpbar").style.width=S.correct*10+"%";if(S.correct===10){hud();return onRoundComplete()}}
  advance();
 }else{
  S.score=Math.max(0,S.score-5);S.streak=0;S.mistakes++;
  anim(binEl,"shake");pop(binEl,"-5","#ff8a8a");hint.textContent="💡 "+item.h;hint.classList.add("show");
  if(S.gm==="unl"){S.lives--;if(S.lives<=0){hud();return onRoundComplete()}}
  select(false);
 }
 hud();
}
/* Quiz: +50 perfect sweep if no mistakes. Both modes: save best run per username. */
async function onRoundComplete(){
 S.over=true;clearInterval(S.tick);
 var ms=performance.now()-S.t0,bonus=0,quiz=S.gm==="quiz";
 if(quiz&&S.mistakes===0){bonus=50;S.score+=bonus}
 var board=await load(S.gm),key=S.name.toLowerCase(),ex=board.filter(function(e){return e.name.toLowerCase()===key})[0];
 if(!ex)board.push({name:S.name,score:S.score,time:ms});
 else if(S.score>ex.score||(S.score===ex.score&&ms<ex.time)){ex.name=S.name;ex.score=S.score;ex.time=ms}
 sortBoard(board);board=board.slice(0,10);await save(S.gm,board);
 var pos=board.findIndex(function(e){return e.name.toLowerCase()===key});
 $("#rTitle").textContent=quiz?"ROUND COMPLETE!":"GAME OVER!";
 $("#rScore").textContent=S.score;$("#rCorrect").textContent=quiz?S.correct+"/10":S.correct;
 $("#rTime").textContent=(ms/1000).toFixed(1)+"s";
 $("#rL4").textContent=quiz?"Perfect bonus":"Best streak";$("#rX").textContent=quiz?"+"+bonus:"🔥 "+S.best;
 $("#rRank").textContent=pos>=0?"🏆 Your best rank: #"+(pos+1):"Not in the top 10 yet – try again!";
 show("s-result");confetti();
}

/* ---- drag (mouse + touch) and tap-then-tap-bin on the current item ---- */
(function(){
 var el=$("#cur");
 el.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();select(!S.sel)}});
 el.addEventListener("pointerdown",function(e){
  e.preventDefault();if(S.over)return;
  var sx=e.clientX,sy=e.clientY,ghost=null,moved=false;
  try{el.setPointerCapture(e.pointerId)}catch(_){}
  function binAt(x,y){var t=document.elementFromPoint(x,y);return t&&t.closest?t.closest(".bin"):null}
  function mv(ev){
   if(!moved&&Math.hypot(ev.clientX-sx,ev.clientY-sy)<8)return;
   if(!moved){moved=true;ghost=el.cloneNode(true);ghost.removeAttribute("id");ghost.className="item ghost";document.body.appendChild(ghost);el.classList.add("drag")}
   ghost.style.left=ev.clientX+"px";ghost.style.top=ev.clientY+"px";
   var b=binAt(ev.clientX,ev.clientY);document.querySelectorAll(".bin").forEach(function(x){x.classList.toggle("over",x===b)});
  }
  function up(ev){
   el.removeEventListener("pointermove",mv);el.removeEventListener("pointerup",up);el.removeEventListener("pointercancel",up);
   document.querySelectorAll(".bin").forEach(function(x){x.classList.remove("over")});
   if(!moved){select(!S.sel);return}
   var b=binAt(ev.clientX,ev.clientY);ghost.remove();el.classList.remove("drag");
   if(b&&ev.type==="pointerup")onItemDropped(S.cur,b.dataset.bin);
  }
  el.addEventListener("pointermove",mv);el.addEventListener("pointerup",up);el.addEventListener("pointercancel",up);
 });
 Object.keys(BINS).forEach(function(k){
  var d=document.createElement("div");d.className="bin";d.dataset.bin=k;d.setAttribute("role","button");d.tabIndex=0;
  d.innerHTML=binSVG(k)+"<span>"+BINS[k].label+"</span>";
  d.addEventListener("click",function(){if(S.sel)onItemDropped(S.cur,k)});
  d.addEventListener("keydown",function(e){if((e.key==="Enter"||e.key===" ")&&S.sel){e.preventDefault();onItemDropped(S.cur,k)}});
  $("#bins").appendChild(d);
 });
})();

/* ---- leaderboard screen with two tabs ---- */
async function board(from,tab){
 S.prev=from;show("s-board");
 $("#tabQ").className="btn sm"+(tab==="quiz"?"":" alt");$("#tabU").className="btn sm"+(tab==="unl"?"":" alt");
 var data=sortBoard(await load(tab)).slice(0,10);
 renderRows($("#list"),data,(from==="s-result"&&tab===S.gm)?S.name.toLowerCase():"",false);
 $("#bcap").textContent=store()==="shared"?"Leaderboard: shared with all players":"Leaderboard: this device only";
}
