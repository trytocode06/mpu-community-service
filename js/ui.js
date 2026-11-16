"use strict";
/* Shared helpers: screens, animations, bin and medal drawings, leaderboard rows, confetti */
var $=function(s){return document.querySelector(s)};
var reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
/* ---- helpers ---- */
function show(id){
 document.querySelectorAll(".screen").forEach(function(s){s.classList.toggle("on",s.id===id)});
 $("#xp").classList.toggle("on",id==="s-game"&&S.gm==="quiz");
 $("#adminBtn").style.display=(id==="s-game"||id==="s-sort")?"none":"block";scrollTo(0,0);
}
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function fmt(n){return n>=1000?(n/1000).toFixed(1)+"k":n}
function anim(el,c){el.classList.remove(c);void el.offsetWidth;el.classList.add(c)}
function pop(el,txt,col){
 var r=el.getBoundingClientRect(),p=document.createElement("div");p.className="pop";p.textContent=txt;if(col)p.style.color=col;
 p.style.left=(r.left+r.width/2-30)+"px";p.style.top=(r.top-10)+"px";document.body.appendChild(p);setTimeout(function(){p.remove()},950);
}
/* bin: handle, lid, tapered body, gloss, symbol badge */
function binSVG(k){
 var b=BINS[k],o='stroke="#1b1f3b" stroke-width="5" stroke-linejoin="round"';
 return '<svg viewBox="0 0 100 112" aria-hidden="true">'+
  '<rect x="38" y="4" width="24" height="13" rx="5" fill="'+b.dark+'" '+o+'/>'+
  '<path d="M16 32 L84 32 L78 104 Q77.5 108 73 108 L27 108 Q22.5 108 22 104 Z" fill="'+b.col+'" '+o+'/>'+
  '<path d="M25 40 L75 40 L73 50 L27 50 Z" fill="#fff" opacity=".25"/>'+
  '<rect x="8" y="14" width="84" height="18" rx="7" fill="'+b.dark+'" '+o+'/>'+
  '<circle cx="50" cy="72" r="21" fill="#fff" stroke="#1b1f3b" stroke-width="3"/>'+
  '<text x="50" y="81" text-anchor="middle" font-size="26">'+b.icon+'</text></svg>';
}
/* medal badge for ranks 1-3: gold, silver, bronze with different ribbons */
function medal(i){
 var c=["#ffc81e","#d3d9e6","#cd7f32"][i],r=["#ef4a4a","#2f7df6","#38c85a"][i];
 return '<svg viewBox="0 0 34 44"><path d="M8 0h8l3 14h-8zM26 0h-8l-3 14h8z" fill="'+r+'" stroke="#1b1f3b" stroke-width="2" stroke-linejoin="round"/>'+
  '<circle cx="17" cy="28" r="13" fill="'+c+'" stroke="#1b1f3b" stroke-width="3"/><circle cx="17" cy="28" r="8.5" fill="none" stroke="#1b1f3b" stroke-opacity=".35" stroke-width="2"/>'+
  '<text x="17" y="33" text-anchor="middle" font-size="14" font-weight="700" font-family="Fredoka,sans-serif" fill="#1b1f3b">'+(i+1)+'</text></svg>';
}
/* shared row renderer (leaderboard screen + in-game list); ranks 4+ are plain black numbers */
function renderRows(el,data,me,compact){
 el.innerHTML="";
 if(!data.length){el.innerHTML='<div class="empty">No scores yet – be the first!</div>';return}
 data.forEach(function(e,i){
  var r=document.createElement("div");r.className="row"+(compact?" c":"")+(me&&e.name.toLowerCase()===me?" me":"");
  var rk=document.createElement("div");rk.className="rk";if(i<3)rk.innerHTML=medal(i);else rk.textContent=i+1;
  var nm=document.createElement("div");nm.className="nm";nm.textContent=e.name;
  var sc=document.createElement("div");sc.textContent=e.score+" 🪙";
  r.appendChild(rk);r.appendChild(nm);r.appendChild(sc);
  if(!compact){var tm=document.createElement("div");tm.textContent=(e.time/1000).toFixed(1)+"s";r.appendChild(tm)}
  el.appendChild(r);
 });
}

function confetti(){
 if(reduce)return;var c=["#ff4a4a","#ffc81e","#38c85a","#2f7df6","#ff8a1f","#c056ff"];
 for(var i=0;i<60;i++){var d=document.createElement("div");d.className="conf";d.style.left=Math.random()*100+"vw";d.style.background=c[i%6];
  d.style.animationDuration=(1.8+Math.random()*1.8)+"s";d.style.animationDelay=Math.random()*.5+"s";document.body.appendChild(d);
  (function(x){setTimeout(function(){x.remove()},4500)})(d)}
}
