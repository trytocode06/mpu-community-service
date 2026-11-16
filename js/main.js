"use strict";
/* Button wiring for every screen */
$("#mainPlay").onclick=function(){show("s-modes")};
$("#cardQuiz").onclick=function(){show("s-home")};
$("#cardSort").onclick=openMap;
$("#modesBack").onclick=function(){show("s-menu")};
$("#hubBack").onclick=function(){show("s-modes")};
$("#mapBack").onclick=function(){show("s-modes")};
$("#mapBtn").onclick=openMap;
$("#popNext").onclick=function(){$("#pop").classList.remove("on");openMap()};
$("#retry").onclick=function(){ST.lives=MAX_LIVES;startStage(ST.stage)}; // retry the stage you lost, progress kept
$("#overMap").onclick=function(){ST.lives=MAX_LIVES;openMap()}; // back to the Sort It Right map, lives refilled
$("#overMenu").onclick=function(){ST.lives=MAX_LIVES;show("s-menu")}; // progress kept, lives refilled
$("#winAgain").onclick=function(){resetRun();openMap()};
$("#winMenu").onclick=function(){ST.lives=MAX_LIVES;show("s-menu")};


/* ---- wiring ---- */
$("#playQuiz").onclick=function(){S.gm="quiz";toName()};
$("#playUnl").onclick=function(){S.gm="unl";toName()};
$("#quitBtn").onclick=quitRound;
$("#lbHome").onclick=function(){board("s-home","quiz")};
$("#backName").onclick=function(){show("s-home")};
$("#play").onclick=start;
$("#uname").addEventListener("keydown",function(e){if(e.key==="Enter")start()});
$("#again").onclick=newRound;        // same player, same mode
$("#next").onclick=toName;           // next player, new username
$("#lb2").onclick=function(){board("s-result",S.gm)};
$("#home").onclick=function(){S.name="";show("s-home")};
$("#tabQ").onclick=function(){board(S.prev,"quiz")};
$("#tabU").onclick=function(){board(S.prev,"unl")};
$("#back").onclick=function(){show(S.prev)};
$("#adminBtn").onclick=function(){$("#admLogin").style.display="block";$("#admPanel").style.display="none";$("#admPw").value="";$("#admErr").textContent="";$("#adm").classList.add("on");$("#admPw").focus()};
$("#admGo").onclick=admTry;
$("#admPw").addEventListener("keydown",function(e){if(e.key==="Enter")admTry()});
$("#admX1").onclick=admClose;$("#admX2").onclick=admClose;
$("#admTQ").onclick=function(){admGm="quiz";admList()};
$("#admTU").onclick=function(){admGm="unl";admList()};
$("#admSortReset").onclick=function(){ // two taps to confirm, then wipe saved Sort It Right progress
 if(!armedSort){armedSort=true;this.textContent="TAP AGAIN TO CONFIRM";return}
 resetRun();admSortInfo();
};
$("#admClear").onclick=async function(){
 if(!armed){armed=true;this.textContent="TAP AGAIN TO CONFIRM";return}
 await save(admGm,[]);admList();
};
