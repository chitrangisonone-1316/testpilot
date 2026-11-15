var SAMPLE=[
{id:"s1",title:"Basic Programming",mins:5,pass:60,qs:[
{q:"Which data structure works on a Last-In, First-Out basis?",o:["Queue","Stack","Array","Graph"],a:1,e:"A stack removes the most recently added item first."},
{q:"What is the time complexity of binary search on a sorted array?",o:["O(n)","O(n log n)","O(log n)","O(1)"],a:2,e:"Each step halves the search range."},
{q:"Which keyword declares a constant in JavaScript?",o:["var","let","const","static"],a:2,e:"const creates a binding that cannot be reassigned."},
{q:"What does SQL stand for?",o:["Structured Query Language","Simple Question Language","Sequential Query Logic","Stored Query List"],a:0,e:"SQL is the standard language for relational databases."},
{q:"Which symbol is used for single-line comments in Python?",o:["//","#","--","/*"],a:1,e:"Python comments start with #."}]},
{id:"s2",title:"General Knowledge",mins:4,pass:60,qs:[
{q:"What is the capital of India?",o:["Mumbai","Kolkata","New Delhi","Chennai"],a:2,e:"New Delhi is the seat of the Government of India."},
{q:"Which planet is known as the Red Planet?",o:["Venus","Mars","Jupiter","Mercury"],a:1,e:"Iron oxide on its surface gives Mars its colour."},
{q:"How many continents are there on Earth?",o:["5","6","7","8"],a:2,e:"Africa, Antarctica, Asia, Australia, Europe, North America, South America."},
{q:"Who wrote the national anthem of India?",o:["Bankim Chandra Chatterjee","Rabindranath Tagore","Sarojini Naidu","Mahatma Gandhi"],a:1,e:"Jana Gana Mana was written by Rabindranath Tagore."}]}];
var S={custom:[],results:[],users:[],session:null},cur=null,tick=null,app=document.getElementById("app");
try{var d=JSON.parse(localStorage.getItem("testpilot")||"null");if(d){S.custom=d.custom||[];S.results=d.results||[];S.users=d.users||[];S.session=d.session||null}}catch(e){}
function save(){try{localStorage.setItem("testpilot",JSON.stringify(S))}catch(e){}}
function all(){return SAMPLE.concat(S.custom)}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function go(v){clearInterval(tick);
  if(!S.session&&v!="register")v="login";
  if(S.session&&(v=="login"||v=="register"))v="home";
  if(v=="create"&&S.session.role!="teacher")v="home";
  renderNav();
  if(v=="home")home();if(v=="create")create();if(v=="login")loginView();if(v=="register")registerView();window.scrollTo(0,0)}
function home(){
  var u=S.session,teacher=u.role=="teacher";
  var h='<h1>Welcome, '+esc(u.name)+'.</h1><p class="lead">'+(teacher?'Create tests and see how students score.':'Pick a test, answer before the timer runs out, and review every answer afterwards.')+'</p><h2>Available tests</h2>';
  all().forEach(function(t){h+='<div class="test"><div><h3>'+esc(t.title)+'</h3><small>'+t.qs.length+' questions · '+t.mins+' min · pass mark '+t.pass+'%</small></div><div class="row"><button class="pri" onclick="start(\''+t.id+'\')">Start test</button>'+(t.id[0]=="c"&&teacher&&t.owner==u.email?'<button onclick="del(\''+t.id+'\')">Delete</button>':'')+'</div></div>'});
  var list=teacher?S.results:S.results.filter(function(r){return r.user==u.email});
  h+='<h2>'+(teacher?'All student results':'Your results')+'</h2>';
  if(!list.length)h+='<div class="empty">No attempts yet. '+(teacher?'Results appear here once students finish a test.':'Start a test above and your scores will appear here.')+'</div>';
  else{h+='<div class="tbl"><table class="hist"><tr>'+(teacher?'<th>Student</th>':'')+'<th>Test</th><th>Score</th><th>Result</th><th>Date</th></tr>';
    list.slice().reverse().slice(0,15).forEach(function(r){h+='<tr>'+(teacher?'<td>'+esc(r.name||"-")+'</td>':'')+'<td>'+esc(r.title)+'</td><td>'+r.score+'/'+r.total+' ('+r.pct+'%)</td><td class="'+(r.pass?'pass':'fail')+'">'+(r.pass?'Passed':'Failed')+'</td><td>'+esc(r.date)+'</td></tr>'});
    h+='</table></div>'+(teacher?'':'<p><button onclick="clr()">Clear my results</button></p>')}
  app.innerHTML=h}
function del(id){S.custom=S.custom.filter(function(t){return t.id!=id});save();home()}
function clr(){S.results=S.results.filter(function(r){return r.user!=S.session.email});save();home()}
function start(id){var t=all().filter(function(x){return x.id==id})[0];cur={t:t,i:0,ans:new Array(t.qs.length).fill(-1),left:t.mins*60};
  clearInterval(tick);tick=setInterval(function(){cur.left--;var el=document.getElementById("tm");if(el){el.textContent=fmt(cur.left);el.className="timer"+(cur.left<=30?" low":"")}if(cur.left<=0)finish()},1000);quiz()}
function fmt(s){s=Math.max(0,s);return Math.floor(s/60)+":"+("0"+s%60).slice(-2)}
function quiz(){var t=cur.t,q=t.qs[cur.i],h='<div class="bar"><h2 style="margin:0">'+esc(t.title)+'</h2><span class="timer" id="tm">'+fmt(cur.left)+'</span></div>';
  h+='<div class="prog"><i style="width:'+((cur.i+1)/t.qs.length*100)+'%"></i></div><div class="q"><p style="margin:0 0 8px;color:var(--mute)">Question '+(cur.i+1)+' of '+t.qs.length+'</p><h3>'+esc(q.q)+'</h3>';
  q.o.forEach(function(o,k){h+='<button class="opt'+(cur.ans[cur.i]==k?' sel':'')+'" onclick="pick('+k+')"><span class="k">'+"ABCD"[k]+'</span><span>'+esc(o)+'</span></button>'});
  h+='</div><div class="dots">';
  t.qs.forEach(function(_,k){h+='<button class="'+(cur.ans[k]>=0?'done ':'')+(k==cur.i?'cur':'')+'" onclick="jump('+k+')" aria-label="Question '+(k+1)+'">'+(k+1)+'</button>'});
  h+='</div><div class="bar"><button onclick="jump(cur.i-1)"'+(cur.i==0?' disabled':'')+'>Previous</button>';
  h+=cur.i<t.qs.length-1?'<button class="pri" onclick="jump(cur.i+1)">Next</button>':'<button class="pri" onclick="submitT()">Submit test</button>';
  app.innerHTML=h+'</div>'}
function pick(k){cur.ans[cur.i]=k;quiz()}
function jump(k){if(k>=0&&k<cur.t.qs.length){cur.i=k;quiz()}}
function submitT(){var un=cur.ans.filter(function(a){return a<0}).length;if(un&&!confirm(un+" question(s) unanswered. Submit anyway?"))return;finish()}
function finish(){clearInterval(tick);var t=cur.t,sc=0;t.qs.forEach(function(q,k){if(cur.ans[k]==q.a)sc++});
  var pct=Math.round(sc/t.qs.length*100),ok=pct>=t.pass;
  S.results.push({user:S.session.email,name:S.session.name,title:t.title,score:sc,total:t.qs.length,pct:pct,pass:ok,date:new Date().toLocaleDateString()});save();
  var h='<div class="score"><div class="n">'+sc+'/'+t.qs.length+'</div><div class="g '+(ok?'pass':'fail')+'">'+pct+'% – '+(ok?'Passed':'Not passed')+'</div><p class="lead" style="margin:8px auto 0">Pass mark: '+t.pass+'%</p></div><h2>Answer review</h2>';
  t.qs.forEach(function(q,k){var a=cur.ans[k];h+='<div class="q rev"><h3>'+(k+1)+'. '+esc(q.q)+'</h3>';
    q.o.forEach(function(o,j){var c=j==q.a?' ok':(j==a?' bad':'');h+='<div class="opt'+c+'"><span class="k">'+"ABCD"[j]+'</span><span>'+esc(o)+(j==q.a?' (correct)':'')+(j==a&&j!=q.a?' (your answer)':'')+'</span></div>'});
    if(a<0)h+='<p class="exp"><b>Not answered.</b></p>';if(q.e)h+='<p class="exp">'+esc(q.e)+'</p>';h+='</div>'});
  h+='<div class="row"><button class="pri" onclick="start(\''+t.id+'\')">Retake test</button><button onclick="go(\'home\')">Back to tests</button></div>';
  app.innerHTML=h;window.scrollTo(0,0)}
var draft;
function create(){draft={title:"",mins:10,pass:50,qs:[{q:"",o:["","","",""],a:0,e:""}]};form()}
function sync(){draft.title=document.getElementById("ti").value;draft.mins=+document.getElementById("mi").value;draft.pass=+document.getElementById("pa").value;
  draft.qs.forEach(function(q,i){q.q=document.getElementById("q"+i).value;q.e=document.getElementById("e"+i).value;for(var j=0;j<4;j++)q.o[j]=document.getElementById("o"+i+j).value;var r=document.querySelector('input[name="r'+i+'"]:checked');q.a=r?+r.value:0})}
function form(){var h='<h1>Create a test</h1><p class="lead">Add questions with four options each, mark the correct one, and set the time limit.</p>';
  h+='<label for="ti">Test title</label><input type="text" id="ti" value="'+esc(draft.title)+'" placeholder="e.g. Data Structures Quiz"><div class="row"><div style="flex:1"><label for="mi">Time limit (minutes)</label><input type="number" id="mi" min="1" max="180" value="'+draft.mins+'"></div><div style="flex:1"><label for="pa">Pass mark (%)</label><input type="number" id="pa" min="1" max="100" value="'+draft.pass+'"></div></div>';
  draft.qs.forEach(function(q,i){h+='<div class="qb"><label for="q'+i+'" style="margin-top:0">Question '+(i+1)+'</label><input type="text" id="q'+i+'" value="'+esc(q.q)+'">';
    for(var j=0;j<4;j++)h+='<div class="o"><input type="radio" name="r'+i+'" value="'+j+'" '+(q.a==j?'checked':'')+' aria-label="Mark option '+"ABCD"[j]+' correct"><input type="text" id="o'+i+j+'" value="'+esc(q.o[j])+'" placeholder="Option '+"ABCD"[j]+'"></div>';
    h+='<label for="e'+i+'">Explanation (optional)</label><input type="text" id="e'+i+'" value="'+esc(q.e)+'">'+(draft.qs.length>1?'<p><button onclick="rmQ('+i+')">Remove question</button></p>':'')+'</div>'});
  h+='<div class="row"><button onclick="addQ()">Add question</button><button class="pri" onclick="saveT()">Save test</button></div><p id="err" class="fail" role="alert"></p>';app.innerHTML=h}
function addQ(){sync();draft.qs.push({q:"",o:["","","",""],a:0,e:""});form()}
function rmQ(i){sync();draft.qs.splice(i,1);form()}
function saveT(){sync();var e=document.getElementById("err");
  if(!draft.title.trim()){e.textContent="Enter a test title.";return}
  for(var i=0;i<draft.qs.length;i++){var q=draft.qs[i];if(!q.q.trim()||q.o.some(function(o){return !o.trim()})){e.textContent="Question "+(i+1)+" needs question text and all four options.";return}}
  draft.id="c"+Date.now();draft.owner=S.session.email;draft.mins=Math.max(1,draft.mins||10);draft.pass=Math.min(100,Math.max(1,draft.pass||50));S.custom.push(draft);save();home()}
function hash(s){
  if(window.crypto&&crypto.subtle&&window.TextEncoder){return crypto.subtle.digest("SHA-256",new TextEncoder().encode(s)).then(function(b){return Array.from(new Uint8Array(b)).map(function(x){return("0"+x.toString(16)).slice(-2)}).join("")})}
  var h=5381;for(var i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return Promise.resolve("f"+h)}
function val(id){return document.getElementById(id).value}
function renderNav(){var u=S.session,h="";
  if(u)h='<button onclick="go(\'home\')">Tests</button>'+(u.role=="teacher"?'<button onclick="go(\'create\')">Create test</button>':'')+'<span class="who">'+esc(u.name)+' ('+u.role+')</span><button onclick="logout()">Log out</button>';
  else h='<button onclick="go(\'login\')">Log in</button><button class="pri" onclick="go(\'register\')">Register</button>';
  document.getElementById("nav").innerHTML=h}
function loginView(){
  app.innerHTML='<div class="auth"><h1>Log in</h1><p class="lead">Enter your email and password to continue.</p><form onsubmit="login();return false"><label for="em">Email</label><input type="text" id="em" autocomplete="username"><label for="pw">Password</label><input type="password" id="pw" autocomplete="current-password"><p id="err" class="fail" role="alert"></p><button class="pri" type="submit">Log in</button></form><p class="lead" style="margin-top:18px">New here? <button class="link" onclick="go(\'register\')">Create an account</button></p></div>'}
function registerView(){
  app.innerHTML='<div class="auth"><h1>Create account</h1><p class="lead">Register as a student to take tests, or as a teacher to create them.</p><form onsubmit="register();return false"><label for="nm">Full name</label><input type="text" id="nm" autocomplete="name"><label for="em">Email</label><input type="text" id="em" autocomplete="username"><label for="pw">Password (at least 6 characters)</label><input type="password" id="pw" autocomplete="new-password"><label for="pc">Confirm password</label><input type="password" id="pc" autocomplete="new-password"><label for="rl">I am a</label><select id="rl"><option value="student">Student</option><option value="teacher">Teacher</option></select><p id="err" class="fail" role="alert"></p><button class="pri" type="submit">Register</button></form><p class="lead" style="margin-top:18px">Already registered? <button class="link" onclick="go(\'login\')">Log in</button></p></div>'}
function register(){
  var nm=val("nm").trim(),em=val("em").trim().toLowerCase(),pw=val("pw"),e=document.getElementById("err");
  if(!nm){e.textContent="Enter your full name.";return}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){e.textContent="Enter a valid email, like name@example.com.";return}
  if(pw.length<6){e.textContent="Password must be at least 6 characters.";return}
  if(pw!=val("pc")){e.textContent="Passwords do not match.";return}
  if(S.users.some(function(x){return x.email==em})){e.textContent="This email is already registered. Log in instead.";return}
  hash(pw).then(function(h){var u={name:nm,email:em,role:val("rl"),hash:h};S.users.push(u);S.session={name:u.name,email:u.email,role:u.role};save();renderNav();home()})}
function login(){
  var em=val("em").trim().toLowerCase(),pw=val("pw"),e=document.getElementById("err");
  var u=S.users.filter(function(x){return x.email==em})[0];
  if(!u){e.textContent="No account found with this email. Register first.";return}
  hash(pw).then(function(h){if(h!=u.hash){e.textContent="Wrong password. Try again.";return}S.session={name:u.name,email:u.email,role:u.role};save();renderNav();home()})}
function logout(){clearInterval(tick);S.session=null;save();go("login")}
function boot(){renderNav();S.session?home():loginView()}
boot();