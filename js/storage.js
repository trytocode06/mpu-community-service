"use strict";
/* Saving: shared artifact storage -> localStorage -> memory */
var KEY={quiz:"rr:board",unl:"rr:board:u"},memStore={};
/* ---- storage: shared -> localStorage -> memory ---- */
function store(){
 try{if(window.storage&&typeof window.storage.get==="function")return"shared"}catch(e){}
 try{localStorage.setItem("rr:t","1");localStorage.removeItem("rr:t");return"local"}catch(e){}
 return"memory";
}
async function load(gm){
 var m=store(),k=KEY[gm],raw=null;
 try{
  if(m==="shared"){var r=await window.storage.get(k,true);raw=r&&r.value}
  else if(m==="local")raw=localStorage.getItem(k);else raw=memStore[k];
 }catch(e){raw=null}
 try{var a=JSON.parse(raw||"[]");return Array.isArray(a)?a:[]}catch(e){return[]}
}
async function save(gm,list){
 var m=store(),k=KEY[gm],s=JSON.stringify(list);
 try{
  if(m==="shared")await window.storage.set(k,s,true);
  else if(m==="local")localStorage.setItem(k,s);else memStore[k]=s;
 }catch(e){memStore[k]=s}
}
function sortBoard(a){return a.sort(function(x,y){return y.score-x.score||x.time-y.time})}

/* Sort It Right progress (unlocked stage + stars) is saved with the same storage as the leaderboards.
   Lives are not saved: they refill each time the page is opened. */
async function loadSort(){
 var m=store(),raw=null;
 try{
  if(m==="shared"){var r=await window.storage.get("rr:sort",true);raw=r&&r.value}
  else if(m==="local")raw=localStorage.getItem("rr:sort");else raw=memStore["rr:sort"];
 }catch(e){raw=null}
 try{
  var d=JSON.parse(raw||"null");
  if(d&&d.stars&&d.stars.length===5){ST.unlocked=Math.min(5,Math.max(1,d.unlocked|0));ST.stars=d.stars.map(function(s){return Math.min(3,Math.max(0,s|0))})}
 }catch(e){}
}
async function saveSort(){
 var m=store(),s=JSON.stringify({unlocked:ST.unlocked,stars:ST.stars});
 try{
  if(m==="shared")await window.storage.set("rr:sort",s,true);
  else if(m==="local")localStorage.setItem("rr:sort",s);else memStore["rr:sort"]=s;
 }catch(e){memStore["rr:sort"]=s}
}
