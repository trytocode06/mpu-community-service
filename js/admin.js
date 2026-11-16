"use strict";
/* Admin panel (password checked in the page: a light lock only) */
var ADMIN_PW="12345",armed=false,armedSort=false,admGm="quiz";
function admClose(){$("#adm").classList.remove("on")}
async function admSortInfo(){
 await sortReady;armedSort=false;$("#admSortReset").textContent="RESET SORT IT RIGHT PROGRESS";
 var s=ST.stars.reduce(function(a,b){return a+b},0);
 $("#admSort").textContent="Sort It Right: stage "+ST.unlocked+" unlocked, "+s+"/15 stars";
}
async function admList(){
 var data=sortBoard(await load(admGm)),box=$("#admList");box.innerHTML="";armed=false;$("#admClear").textContent="CLEAR ALL SCORES";admSortInfo();
 $("#admTQ").className="btn sm"+(admGm==="quiz"?"":" alt");$("#admTU").className="btn sm"+(admGm==="unl"?"":" alt");
 if(!data.length)box.innerHTML='<div class="cap">No scores yet.</div>';
 data.forEach(function(e){
  var r=document.createElement("div");r.className="arow";
  var nm=document.createElement("input"),sc=document.createElement("input"),sv=document.createElement("button"),del=document.createElement("button");
  nm.value=e.name;nm.maxLength=16;nm.className="ain";nm.setAttribute("aria-label","Name");
  sc.type="number";sc.min=0;sc.value=e.score;sc.className="ain sc";sc.setAttribute("aria-label","Score");
  sv.className="btn sm";sv.textContent="SAVE";del.className="btn sm red";del.textContent="DELETE";
  sv.onclick=async function(){ // edit a player's name and/or score
   var n=nm.value.trim(),s=Math.floor(Number(sc.value));
   if(!/^\w{3,16}$/.test(n)){$("#admCap").textContent="Name: 3–16 letters, numbers or underscores.";return}
   if(!isFinite(s)||s<0){$("#admCap").textContent="Score must be 0 or more.";return}
   var all=await load(admGm);
   if(all.some(function(x){return x.name!==e.name&&x.name.toLowerCase()===n.toLowerCase()})){$("#admCap").textContent="That name is already on the board.";return}
   all.forEach(function(x){if(x.name===e.name){x.name=n;x.score=s}});
   await save(admGm,sortBoard(all).slice(0,10));admList();
  };
  del.onclick=async function(){var all=await load(admGm);await save(admGm,all.filter(function(x){return x.name!==e.name}));admList()};
  r.appendChild(nm);r.appendChild(sc);r.appendChild(sv);r.appendChild(del);box.appendChild(r);
 });
 $("#admCap").textContent=store()==="shared"?"Board: shared with all players":"Board: this device only";
}
function admTry(){
 if($("#admPw").value===ADMIN_PW){$("#admLogin").style.display="none";$("#admPanel").style.display="block";admList()}
 else $("#admErr").textContent="Wrong password.";
}
