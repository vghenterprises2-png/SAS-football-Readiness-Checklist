Exit code: 0
Wall time: 0.4 seconds
Output:
let db=null,session=null,coach=null,teamId=null,players=[],evalType='individual',selectedPlayer=null,selectedUnit=null,ratings={};
const groups={OL:['offensive lineman','offensive line','center','guard','tackle','c'],QB:['quarterback'],RB:['running back','rb'],WR:['wr','wide receiver','receiver'],TE:['te','tight end'],DEF:['lb','line backer','linebacker','cornerback','safety','de','defensive tackle','defensive lineman','d-line']};
const individualCriteria={OL:['First Step','Hand Placement','Footwork','Leverage','Finish'],QB:['Footwork','Decision Making','Accuracy','Command','Overall'],RB:['Track','Vision','Ball Security','Effort','Overall'],WR:['Release','Route Detail','Hands','Effort','Overall'],TE:['Release','Blocking','Route Detail','Effort','Overall'],DEF:['Alignment','Assignment','Technique','Effort','Overall']};
const unitCriteria={Offense:['Execution','Tempo','Communication','Effort','Overall'],'Offensive Line':['Run Blocking','Pass Blocking','Effort','Overall'],Quarterbacks:['Decision Making','Accuracy','Leadership','Overall'],'Running Backs':['Tracks','Ball Security','Pass Protection','Overall'],Receivers:['Route Running','Blocking','Effort','Overall'],'H / W':['Assignment','Execution','Effort','Overall'],Defense:['Alignment','Fits','Communication','Effort','Overall'],'Special Teams':['Alignment','Assignment','Execution','Effort','Overall']};
const $=id=>document.getElementById(id);
function show(id){document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));$(id).classList.add('active');scrollTo(0,0)}
function toast(m){$('toast').textContent=m;$('toast').style.display='block';setTimeout(()=>$('toast').style.display='none',1800)}
function safe(v,fallback='—'){return v===null||v===undefined||v===''?fallback:v}
function ratingLabel(v){return v==='plus'?'Plus (+)':v==='minus'?'Minus (−)':'Check (✓)'}
function detail(label,value){return `<div class="detail"><span>${label}</span><b>${safe(value)}</b></div>`}
async function init(){
 show('setup');
 const cfg=await window.SAS_CONFIG_READY;
 if(!cfg?.supabaseUrl||!cfg?.supabasePublishableKey||cfg.supabaseUrl.includes('YOUR_')){
  $('setupTitle').textContent='Unable to connect';
  $('setupMessage').textContent='The shared database could not be reached. Check your connection and try again.';
  $('retrySetup').classList.remove('hide');
  return
 }
 db=supabase.createClient(cfg.supabaseUrl,cfg.supabasePublishableKey);
 const {data:{session:s}}=await db.auth.getSession();session=s;
 db.auth.onAuthStateChange(async(_,s2)=>{session=s2;if(s2)await loadApp();else show('login')});
 if(session)await loadApp();else show('login')
}
$('retrySetup').onclick=()=>location.reload();
async function loadApp(){
 await db.rpc('link_current_coach');
 const {data:c}=await db.from('coach_directory').select('*').eq('user_id',session.user.id).maybeSingle();
 if(!c){show('login');$('loginMsg').textContent='This email is not on the approved coaching staff list.';return}
 coach=c;teamId=c.team_id;$('logout').classList.remove('hide');await refresh();$('who').textContent=`${coach.name} · ${coach.role}`;show('home')
}
async function refresh(){
 const [{data:p},{count:e}]=await Promise.all([
  db.from('players').select('*').eq('team_id',teamId).neq('confirmation_status','removed').order('name'),
  db.from('evaluations').select('*',{count:'exact',head:true}).eq('team_id',teamId)
 ]);
 players=p||[];$('pcount').textContent=players.length;$('ecount').textContent=e||0;$('outcount').textContent=players.filter(x=>x.availability==='Out').length;$('uncount').textContent=players.filter(x=>x.confirmation_status==='unconfirmed').length;renderRoster()
}
$('sendLink').onclick=async()=>{const email=$('email').value.trim();if(!email){$('loginMsg').textContent='Enter your coaching staff email.';return}$('loginMsg').textContent='Sending...';const {error}=await db.auth.signInWithOtp({email,options:{emailRedirectTo:new URL('.',location.href).href,shouldCreateUser:true}});$('loginMsg').textContent=error?error.message:'Check your email for the secure sign-in link.'};
$('logout').onclick=async()=>{await db.auth.signOut();location.reload()};
$('begin').onclick=()=>{renderChoose();show('choose')};
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>show(b.dataset.go));
document.querySelectorAll('[data-type]').forEach(b=>b.onclick=()=>{evalType=b.dataset.type;document.querySelectorAll('[data-type]').forEach(x=>x.classList.toggle('active',x===b));renderChoose()});
document.querySelectorAll('[data-profile-tab]').forEach(b=>b.onclick=()=>setProfileTab(b.dataset.profileTab));
function setProfileTab(id){document.querySelectorAll('[data-profile-tab]').forEach(x=>x.classList.toggle('active',x.dataset.profileTab===id));document.querySelectorAll('.profile-panel').forEach(x=>x.classList.toggle('active',x.id===`profile-${id}`))}
function renderChoose(){if(evalType==='individual'){$('groupSelect').innerHTML=Object.keys(groups).map(x=>`<option>${x}</option>`).join('');$('activitySelect').innerHTML='<option>Individual Practice Observation</option>'}else{$('groupSelect').innerHTML=Object.keys(unitCriteria).map(x=>`<option>${x}</option>`).join('');$('activitySelect').innerHTML='<option>First Team</option><option>Second Team</option>'}}
$('openQueue').onclick=()=>{ratings={};if(evalType==='unit'){selectedUnit={name:$('groupSelect').value,level:$('activitySelect').value};openEvaluation()}else renderQueue()};
function playerMatchesGroup(p,g){const terms=groups[g]||[];const text=`${p.off_position||''} ${p.off_secondary||''} ${p.def_position||''} ${p.def_secondary||''}`.toLowerCase();return terms.some(t=>text.includes(t))}
function bestGroupForPlayer(p){return Object.keys(groups).find(g=>playerMatchesGroup(p,g))||'DEF'}
function renderQueue(){const g=$('groupSelect').value;const list=players.filter(p=>p.availability!=='Out'&&playerMatchesGroup(p,g));$('queueTitle').textContent=`${g} · ${list.length} available`;$('queueList').innerHTML=list.map(p=>`<button class="row" onclick="selectP('${p.id}')"><span><b>${p.jersey?'#'+p.jersey+' ':''}${p.name}</b><div class="meta">${p.grade||''} · ${p.off_position||p.def_position||'Position TBD'}</div></span><span class="tag ${p.availability}">${p.availability}</span></button>`).join('')||'<div class="card">No available players in this group.</div>';show('queue')}
window.selectP=id=>{selectedPlayer=players.find(x=>x.id===id);openEvaluation()};
function openEvaluation(){ratings={};const crit=evalType==='unit'?unitCriteria[selectedUnit.name]:individualCriteria[$('groupSelect').value];$('evalContext').textContent=evalType==='unit'?`${selectedUnit.level} · Team / Unit`:`${$('groupSelect').value} · Individual`;$('evalTitle').textContent=evalType==='unit'?selectedUnit.name:`${selectedPlayer.jersey?'#'+selectedPlayer.jersey+' ':''}${selectedPlayer.name}`;$('criteria').innerHTML=crit.map(c=>`<div class="rating"><b>${c}</b><div class="rates"><button class="rate plus" onclick="rate(this,'${c}','plus')">+</button><button class="rate check" onclick="rate(this,'${c}','check')">✓</button><button class="rate minus" onclick="rate(this,'${c}','minus')">−</button></div></div>`).join('');$('note').value='';show('evaluate')}
window.rate=(b,c,v)=>{b.parentElement.querySelectorAll('.rate').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');ratings[c]=v};
$('saveEval').onclick=async()=>{if(!Object.keys(ratings).length){toast('Select at least one rating');return}const {data:pr}=await db.from('practices').select('id').eq('team_id',teamId).order('practice_date',{ascending:false}).limit(1).maybeSingle();const rows=Object.entries(ratings).map(([criterion,rating])=>({team_id:teamId,practice_id:pr?.id||null,player_id:evalType==='individual'?selectedPlayer.id:null,evaluator_user_id:session.user.id,evaluator_name:coach.name,evaluator_role:coach.role,evaluation_type:evalType,context:evalType==='individual'?$('groupSelect').value:'Team Practice',unit_name:evalType==='unit'?selectedUnit.name:null,team_level:evalType==='unit'?selectedUnit.level:null,criterion,rating,note:$('note').value.trim()||null}));const {error}=await db.from('evaluations').insert(rows);if(error)toast(error.message);else{toast('Shared evaluation saved');await refresh();show(evalType==='unit'?'choose':'queue')}};
function renderRoster(){if(!$('rosterList'))return;const q=($('rosterSearch').value||'').toLowerCase(),f=$('confirmFilter').value;const list=players.filter(p=>(!q||`${p.name} ${p.jersey||''} ${p.off_position||''} ${p.off_secondary||''} ${p.def_position||''} ${p.def_secondary||''}`.toLowerCase().includes(q))&&(f==='all'||p.confirmation_status===f));$('rosterList').innerHTML=list.map(p=>`<button class="row profile-row" onclick="openProfile('${p.id}')"><span><b>${p.jersey?'#'+p.jersey+' ':''}${p.name}</b><div class="meta">${p.grade||'Grade TBD'} · ${p.off_position||p.def_position||'Position TBD'} · ${p.confirmation_status}</div></span><span><span class="tag ${p.availability}">${p.availability}</span><b class="chevron">›</b></span></button>`).join('')}
$('rosterSearch').oninput=renderRoster;$('confirmFilter').onchange=renderRoster;$('rosterBtn').onclick=()=>{renderRoster();show('roster')};
window.openProfile=async id=>{
 selectedPlayer=players.find(x=>x.id===id);if(!selectedPlayer)return;
 $('profileName').textContent=`${selectedPlayer.jersey?'#'+selectedPlayer.jersey+' ':''}${selectedPlayer.name}`;
 $('profileMeta').textContent=`${safe(selectedPlayer.grade,'Grade TBD')} · ${safe(selectedPlayer.off_position||selectedPlayer.def_position,'Position TBD')}`;
 $('profileAvailability').textContent=selectedPlayer.availability;$('profileAvailability').className=`tag ${selectedPlayer.availability}`;
 $('demographics').innerHTML=detail('Jersey',selectedPlayer.jersey?`#${selectedPlayer.jersey}`:null)+detail('Grade',selectedPlayer.grade)+detail('Height',selectedPlayer.height)+detail('Weight',selectedPlayer.weight?`${selectedPlayer.weight} lb`:null)+detail('Primary Offense',selectedPlayer.off_position)+detail('Secondary Offense',selectedPlayer.off_secondary)+detail('Primary Defense',selectedPlayer.def_position)+detail('Secondary Defense',selectedPlayer.def_secondary)+detail('Roster Confirmation',selectedPlayer.confirmation_status);
 $('testingData').innerHTML=detail('Push-ups',selectedPlayer.pushups)+detail('Squats',selectedPlayer.squats)+detail('3-Cone',selectedPlayer.cone3?`${selectedPlayer.cone3} sec`:null)+detail('4-Cone',selectedPlayer.cone4?`${selectedPlayer.cone4} sec`:null)+detail('Shuttle',selectedPlayer.shuttle?`${selectedPlayer.shuttle} sec`:null);
 $('playerNotes').textContent=selectedPlayer.notes||'No roster notes recorded.';
 $('status').value=selectedPlayer.availability;$('reason').value=selectedPlayer.availability_reason||'';$('clearance').checked=!!selectedPlayer.clearance_required;$('confirmation').value=selectedPlayer.confirmation_status;
 $('statusEditor').classList.toggle('hide',!coach.is_admin);$('statusReadOnly').textContent=coach.is_admin?'Administrator controls are available below.':`Current status: ${selectedPlayer.availability}${selectedPlayer.availability_reason?' · '+selectedPlayer.availability_reason:''}. Status changes are limited to administrators.`;
 setProfileTab('overview');show('profile');await Promise.all([loadPlayerEvaluations(),loadStatusHistory()])
};
async function loadPlayerEvaluations(){
 $('playerEvaluations').innerHTML='<div class="meta">Loading evaluations…</div>';
 const {data,error}=await db.from('evaluations').select('*').eq('team_id',teamId).eq('player_id',selectedPlayer.id).order('created_at',{ascending:false}).limit(200);
 if(error){$('playerEvaluations').innerHTML=`<div class="meta">${error.message}</div>`;return}
 const rows=data||[];const plus=rows.filter(x=>x.rating==='plus').length,check=rows.filter(x=>x.rating==='check').length,minus=rows.filter(x=>x.rating==='minus').length;
 $('playerEvalSummary').innerHTML=`<div class="summary"><b>${rows.length}</b><span>Ratings</span></div><div class="summary positive"><b>${plus}</b><span>Plus</span></div><div class="summary"><b>${check}</b><span>Check</span></div><div class="summary concern"><b>${minus}</b><span>Minus</span></div>`;
 $('playerEvaluations').innerHTML=rows.map(e=>`<div class="evaluation-card"><div class="evaluation-top"><b>${e.criterion}</b><span class="rating-pill ${e.rating}">${ratingLabel(e.rating)}</span></div><div class="meta">${safe(e.context,'Practice')} · ${e.evaluator_name} (${e.evaluator_role})</div><div class="meta">${new Date(e.created_at).toLocaleString()}</div>${e.note?`<p>${e.note}</p>`:''}</div>`).join('')||'<div class="meta">No evaluations recorded for this player yet.</div>'
}
async function loadStatusHistory(){
 const {data,error}=await db.from('status_history').select('*').eq('player_id',selectedPlayer.id).order('created_at',{ascending:false}).limit(30);
 if(error){$('statusHistory').innerHTML='';return}
 $('statusHistory').innerHTML=(data||[]).map(h=>`<div class="history-row"><b>${safe(h.old_status,'New')} → ${h.new_status}</b><div class="meta">${new Date(h.created_at).toLocaleString()}${h.reason?' · '+h.reason:''}</div></div>`).join('')
}
$('evaluateFromProfile').onclick=()=>{evalType='individual';const g=bestGroupForPlayer(selectedPlayer);document.querySelectorAll('[data-type]').forEach(x=>x.classList.toggle('active',x.dataset.type==='individual'));renderChoose();$('groupSelect').value=g;openEvaluation()};
$('saveStatus').onclick=async()=>{if(!coach.is_admin){toast('Administrator access required');return}const old=selectedPlayer.availability;const {error}=await db.from('players').update({availability:$('status').value,availability_reason:$('reason').value.trim()||null,clearance_required:$('clearance').checked,confirmation_status:$('confirmation').value,updated_at:new Date().toISOString()}).eq('id',selectedPlayer.id);if(!error)await db.from('status_history').insert({player_id:selectedPlayer.id,changed_by:session.user.id,old_status:old,new_status:$('status').value,reason:$('reason').value.trim()||null});if($('clearance').checked)await db.from('reminders').insert({team_id:teamId,coach_user_id:session.user.id,player_id:selectedPlayer.id,reason:'Medical clearance required',safety:true});if(error)toast(error.message);else{toast('Permanent roster status saved');await refresh();selectedPlayer=players.find(x=>x.id===selectedPlayer.id);await openProfile(selectedPlayer.id)}};
async function loadHistory(){const {data,error}=await db.from('evaluations').select('*,players(name,jersey)').eq('team_id',teamId).order('created_at',{ascending:false}).limit(200);if(error){toast(error.message);return}$('historyList').innerHTML=(data||[]).map(e=>`<div class="row"><span><b>${e.players?((e.players.jersey?'#'+e.players.jersey+' ':'')+e.players.name):((e.team_level||'')+' '+(e.unit_name||''))}</b><div class="meta">${e.criterion}: ${ratingLabel(e.rating)} · ${e.evaluator_name} (${e.evaluator_role})</div><div class="meta">${new Date(e.created_at).toLocaleString()}</div></span></div>`).join('')||'<div class="card">No evaluations yet.</div>';show('history')}
$('historyBtn').onclick=loadHistory;
$('exportBtn').onclick=async()=>{const {data,error}=await db.from('evaluations').select('created_at,evaluator_name,evaluator_role,evaluation_type,context,unit_name,team_level,criterion,rating,note,players(name,jersey)').eq('team_id',teamId).order('created_at');if(error){toast(error.message);return}const esc=v=>'"'+String(v??'').replaceAll('"','""')+'"',header=['created_at','player','evaluator','role','type','context','unit','team_level','criterion','rating','note'];const csv=[header.join(','),...(data||[]).map(e=>[e.created_at,e.players?`${e.players.jersey||''} ${e.players.name}`:'',e.evaluator_name,e.evaluator_role,e.evaluation_type,e.context,e.unit_name,e.team_level,e.criterion,e.rating,e.note].map(esc).join(','))].join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='sas-evaluations.csv';a.click();URL.revokeObjectURL(a.href)};
init();

