import { mountDevLab } from './dev-lab.js';
import { mountAssetDatabaseConsole } from './asset-database-console.js';

const cards=[['sprite-matrix','SPRITE MATRIX','Sprites, animation layers & behaviour'],['game-console','GAME CONSOLE','Engine controls, world state & events'],['voice-scripting','VOICE SCRIPTING','Narrator, TTS & audio laboratory'],['database-admin','DATABASE & ADMIN BRIDGE','Assets, pipeline & administration'],['dev','DEV PAGE','Visual authoring, assets & UI'],['sandbox','VIRTUAL SANDBOX','Nightmare environment testing']];
const modules={
 'sprite-matrix':{title:'SPRITE MATRIX',kicker:'CHARACTER / ANIMATION LAB',intro:'Build, inspect and trigger sprite animation states.',actions:['NEW SPRITE','IMPORT ANIMATION','PLAY SELECTED'],stats:[['SPRITES','0'],['ANIMATIONS','0'],['ACTIVE STATE','IDLE']]},
 'game-console':{title:'GAME CONSOLE',kicker:'ENGINE CONTROL / WORLD EVENTS',intro:'Operate the Nightmare engine, inspect world state and fire test events.',actions:['START ENGINE','NEW WORLD SEED','TRIGGER EVENT'],stats:[['ENGINE','STANDBY'],['WORLD','READY'],['PLAYERS','1 / 8']]},
 'voice-scripting':{title:'VOICE SCRIPTING',kicker:'VOICE / NARRATIVE LAB',intro:'Create dialogue, preview voice lines and prepare audio assets for the game.',actions:['NEW LINE','PLAY PREVIEW','SAVE SCRIPT'],stats:[['LINES','0'],['VOICE','BROWSER TTS'],['QUEUE','EMPTY']]}};

function setStatus(status,message){const root=document.querySelector('#page-root');root.querySelector('#module-status').textContent=status;root.querySelector('#module-message').textContent=message;}
function updateStat(label,value){const item=[...document.querySelectorAll('.module-stats article')].find(x=>x.querySelector('small')?.textContent===label);if(item)item.querySelector('strong').textContent=value;}
function flash(button){button.classList.add('fired');window.setTimeout(()=>button.classList.remove('fired'),350);}

function installModuleActions(page){
 const root=document.querySelector('#page-root');
 root.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',async()=>{
  const action=button.dataset.action;flash(button);
  if(page==='sprite-matrix'){
   if(action==='NEW SPRITE'){const count=Number(localStorage.getItem('pn.sprite.count')||0)+1;localStorage.setItem('pn.sprite.count',String(count));updateStat('SPRITES',count);setStatus('SPRITE CREATED // '+count,'Sprite '+count+' is registered in the local development workspace.');}
   else if(action==='IMPORT ANIMATION'){const input=document.createElement('input');input.type='file';input.accept='.json,.gif,.png,.webp';input.multiple=true;input.onchange=()=>{const n=input.files.length;updateStat('ANIMATIONS',n);setStatus('IMPORT READY',n?' '+n+' animation asset'+(n===1?'':'s')+' selected for inspection.':'No animation selected.');};input.click();}
   else{updateStat('ACTIVE STATE','PLAYING');setStatus('PLAYBACK // ACTIVE','Selected sprite animation state is now running.');window.setTimeout(()=>updateStat('ACTIVE STATE','IDLE'),900);}
  }
  if(page==='game-console'){
   if(action==='START ENGINE'){updateStat('ENGINE','RUNNING');setStatus('ENGINE // RUNNING','Nightmare engine test session started.');}
   else if(action==='NEW WORLD SEED'){const seed=Math.floor(Math.random()*900000)+100000;localStorage.setItem('pn.world.seed',String(seed));updateStat('WORLD',String(seed));setStatus('WORLD SEED // '+seed,'A new procedural world seed is ready for the next engine load.');}
   else{setStatus('EVENT // TRIGGERED','Test event dispatched to the development console.');}
  }
  if(page==='voice-scripting'){
   if(action==='NEW LINE'){const count=Number(localStorage.getItem('pn.voice.lines')||0)+1;localStorage.setItem('pn.voice.lines',String(count));updateStat('LINES',count);setStatus('LINE CREATED // '+count,'New voice line slot created.');}
   else if(action==='PLAY PREVIEW'){if('speechSynthesis' in window){window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance('Project Nightmare voice preview.');utterance.lang='en-GB';window.speechSynthesis.speak(utterance);setStatus('VOICE // PLAYING','Browser voice preview is speaking now.');}else setStatus('VOICE // UNAVAILABLE','This browser does not expose speech synthesis.');}
   else{localStorage.setItem('pn.voice.savedAt',new Date().toISOString());setStatus('SCRIPT // SAVED','Voice workspace state saved locally in this browser.');}
  }
 });
}

export function renderPage(page){
 const r=document.querySelector('#page-root');
 if(page==='dashboard'){r.innerHTML='<section class="screen-grid">'+cards.map(c=>'<a class="screen-card" href="pages/'+c[0]+'.html" aria-label="Open '+c[1]+'"><span>'+c[0].toUpperCase()+'</span><strong>'+c[1]+'</strong><small>'+c[2]+'</small><b>OPEN CONSOLE →</b></a>').join('')+'</section><footer class="dashboard-footer">ALL RIGHTS RESERVED BY DORE TRADING UK // LIVE DEVELOPMENT INTERFACE</footer>';return;}
 if(page==='dev'){mountDevLab(r);return;}
 if(page==='database-admin'){mountAssetDatabaseConsole(r);return;}
 if(page==='sandbox'){r.innerHTML='<section class="console-grid"><article class="console-panel"><header>VIRTUAL SANDBOX</header><div class="module-launch"><strong>3D ENVIRONMENT LAB</strong><p>Launch the procedural mansion renderer and test seeds, rooms, power and content packs.</p><a class="console-button primary" href="sandbox.html">OPEN 3D SANDBOX →</a></div></article><article class="console-panel"><header>LIVE SYSTEMS</header><div class="module-stats"><span>THREE.JS</span><span>PBR PIPELINE</span><span>8 PLAYER WORLD</span><span>CONTENT PACKS</span></div></article></section>';return;}
 const m=modules[page]||modules['game-console'];
 r.innerHTML='<section class="module-console"><header><span>'+m.kicker+'</span><h2>'+m.title+'</h2><p>'+m.intro+'</p></header><div class="module-actions">'+m.actions.map((a,i)=>'<button type="button" class="console-button '+(i===0?'primary':'')+'" data-action="'+a+'">'+a+'</button>').join('')+'</div><div class="module-stats">'+m.stats.map(s=>'<article><small>'+s[0]+'</small><strong>'+s[1]+'</strong></article>').join('')+'</div><div class="module-workspace"><div class="workspace-screen"><span id="module-status">SYSTEM READY // INTERACTIVE</span><p id="module-message">Choose an operation above. Controls now perform a real browser-side action.</p></div><aside><strong>QUICK LINKS</strong><a href="../index.html">← DASHBOARD</a><a href="../pages/database-admin.html">ASSET DATABASE</a><a href="../pages/dev.html">DEV LAB</a><a href="../pages/sandbox.html">3D SANDBOX</a></aside></div></section>';
 installModuleActions(page);
}