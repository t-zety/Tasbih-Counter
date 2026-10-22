var DHIKR=[["سُبْحَانَ ٱللّٰه","SubhanAllah"],["ٱلْحَمْدُ لِلّٰه","Alhamdulillah"],["ٱللّٰهُ أَكْبَر","Allahu Akbar"],["لَا إِلٰهَ إِلَّا ٱللّٰه","La ilaha illallah"],["أَسْتَغْفِرُ ٱللّٰه","Astaghfirullah"],["يَا بَارِك","Ya Barik",40],["يَا فَتَّاح","Ya Fattah",40],["يَا رَزَّاق","Ya Razzaq",40],["يَا غَنِيّ","Ya Ghoni",40],["يَا مُغْنِي","Ya Mughni",40]];
var GOALS=[33,40,99,100,1000];
var S={n:0,goal:33,d:0,total:0,buzz:true};
try{var saved=JSON.parse(localStorage.getItem("tasbih")||"null");if(saved&&typeof saved==="object"){S.n=Math.min(1000,+saved.n||0);S.goal=GOALS.indexOf(saved.goal)>=0?saved.goal:33;S.d=+saved.d>=0&&+saved.d<DHIKR.length?+saved.d:0;S.total=+saved.total||0;S.buzz=saved.buzz!==false}}catch(e){}
var $=function(i){return document.getElementById(i)};
var faces=["(˶ᵔ ᵕ ᵔ˶)","(◕‿◕)","(˘▾˘)♡","(ᵔ◡ᵔ)","(◠‿◠)✿"];
function save(){try{localStorage.setItem("tasbih",JSON.stringify(S))}catch(e){}}
function buzz(ms){if(S.buzz&&navigator.vibrate){try{navigator.vibrate(ms)}catch(e){}}}
function chips(){
  $("dhikrs").innerHTML="";$("goals").innerHTML="";
  DHIKR.forEach(function(d,i){var b=document.createElement("button");b.className="chip"+(i===S.d?" on":"");b.textContent=d[1];b.onclick=function(){S.d=i;if(d[2]){S.goal=d[2]}save();render()};$("dhikrs").appendChild(b)});
  GOALS.forEach(function(g){var b=document.createElement("button");b.className="chip"+(g===S.goal?" on":"");b.textContent="🎯 "+g;b.onclick=function(){S.goal=g;save();render()};$("goals").appendChild(b)});
}
function render(){
  $("ar").textContent=DHIKR[S.d][0];$("tr").textContent=DHIKR[S.d][1];
  $("count").textContent=S.n;$("of").textContent="of "+S.goal+" · max 1000";
  var p=Math.min(1,(S.n%S.goal===0&&S.n>0)?1:(S.n%S.goal)/S.goal);
  $("bar").style.strokeDashoffset=741.4*(1-p);
  $("face").textContent=S.n>=1000?"(๑>ᴗ<๑)🎉":faces[Math.floor(S.n/Math.max(1,S.goal/5))%5];
  $("mute").textContent=S.buzz?"🔔 Sound On":"🔕 Sound Off";
  $("tot").textContent="Lifetime taps: "+S.total;
  chips();
}
function ring(big){if(!S.buzz)return;try{var C=window.AudioContext||window.webkitAudioContext;if(!C)return;window._ac=window._ac||new C();var a=window._ac;var notes=big?[523,659,784,1047,1319]:[784,988,1175];notes.forEach(function(f,i){var o=a.createOscillator(),g=a.createGain();o.type="sine";o.frequency.value=f;var t=a.currentTime+i*.16;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.25,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+.5);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+.55)})}catch(e){}}
function msg(t){$("msg").textContent=t}
$("tap").addEventListener("click",function(){
  if(S.n>=1000){msg("🎉 You reached 1000! Reset to start again 🌸");buzz([60,40,60]);return}
  S.n++;S.total++;
  var b=$("tap");b.classList.add("pop");setTimeout(function(){b.classList.remove("pop")},80);
  if(S.n===1000){msg("🎉 Masha’Allah! 1000 complete ✨");buzz([100,50,100,50,200]);ring(true)}
  else if(S.n%S.goal===0){msg("🌸 Round of "+S.goal+" complete! ("+(S.n/S.goal)+"×)");buzz([80,40,80]);ring(false)}
  else{msg("");buzz(12)}
  save();render();
});
$("undo").onclick=function(){if(S.n>0){S.n--;msg("");save();render()}};
$("reset").onclick=function(){if(S.n===0)return;if(S.n<10||confirm("Reset counter to 0?")){S.n=0;msg("Fresh start 🌱");save();render()}};
$("mute").onclick=function(){S.buzz=!S.buzz;save();render()};
render();
