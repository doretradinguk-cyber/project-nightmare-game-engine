import { mountDevLab } from './dev-lab.js';
import { mountAssetDatabaseConsole } from './asset-database-console.js';

const cards=[['sprite-matrix','SPRITE MATRIX','Sprites, animation layers & behaviour'],['game-console','GAME CONSOLE','Engine controls, world state & events'],['voice-scripting','VOICE SCRIPTING','Narrator, TTS & audio laboratory'],['database-admin','DATABASE & ADMIN BRIDGE','Assets, pipeline & administration'],['dev','DEV PAGE','Visual authoring, assets & UI'],['sandbox','VIRTUAL SANDBOX','Nightmare environment testing']];

const modules={
  'sprite-matrix':{title:'SPRITE MATRIX',kicker:'CHARACTER / ANIMATION LAB',intro:'Build, inspect and trigger sprite animation states.',actions:['NEW SPRITE','IMPORT ANIMATION','PLAY SELECTED'],stats:[['SPRITES','0'],['ANIMATIONS','0'],['ACTIVE STATE','IDLE']]},
  'game-console':{title:'GAME CONSOLE',kicker:'ENGINE CONTROL / WORLD EVENTS',intro:'Operate the Nightmare engine, inspect world state and fire test events.',actions:['START ENGINE','NEW WORLD SEED','TRIGGER EVENT'],stats:[['ENGINE','STANDBY'],['WORLD','READY'],['PLAYERS','1 / 8']]},
  'voice-scripting':{title:'VOICE SCRIPTING',kicker:'VOICE / NARRATIVE LAB',intro:'Create dialogue, preview voice lines and prepare audio assets for the game.',actions:['NEW LINE','PLAY PREVIEW','SAVE SCRIPT'],stats:[['LINES','0'],['VOICE','NOT SET'],['QUEUE','EMPTY']]}
};

export function renderPage(page){
  const r=document.querySelector('#page-root');
  if(page==='dashboard'){
    r.innerHTML='<section class="screen-grid">'+cards.map(c=>'<a class="screen-card" href="pages/'+c[0]+'.html"><span>'+c[0].toUpperCase()+'</span><strong>'+c[1]+'</strong><small>'+c[2]+'</small><b>OPEN CONSOLE →</b></a>').join('')+'</section><footer class="dashboard-footer">ALL RIGHTS RESERVED BY DORE TRADING UK // ORIGINAL PROJECT NIGHTMARE SYSTEM</footer>';
    return;
  }
  if(page==='dev'){mountDevLab(r);return;}
  if(page==='database-admin'){mountAssetDatabaseConsole(r);return;}
  if(page==='sandbox'){r.innerHTML='<section class="console-grid"><article class="console-panel"><header>VIRTUAL SANDBOX</header><div class="module-launch"><strong>3D ENVIRONMENT LAB</strong><p>Launch the procedural mansion renderer and test seeds, rooms, power and content packs.</p><a class="console-button primary" href="sandbox.html">OPEN 3D SANDBOX →</a></div></article><article class="console-panel"><header>LIVE SYSTEMS</header><div class="module-stats"><span>THREE.JS</span><span>PBR PIPELINE</span><span>8 PLAYER WORLD</span><span>CONTENT PACKS</span></div></article></section>';return;}
  const m=modules[page]||modules['game-console'];
  r.innerHTML='<section class="module-console"><header><span>'+m.kicker+'</span><h2>'+m.title+'</h2><p>'+m.intro+'</p></header><div class="module-actions">'+m.actions.map((a,i)=>'<button class="console-button '+(i===0?'primary':'')+'" data-action="'+a+'">'+a+'</button>').join('')+'</div><div class="module-stats">'+m.stats.map(s=>'<article><small>'+s[0]+'</small><strong>'+s[1]+'</strong></article>').join('')+'</div><div class="module-workspace"><div class="workspace-screen"><span id="module-status">SYSTEM READY</span><p id="module-message">Select an operation above to interact with this console.</p></div><aside><strong>QUICK LINKS</strong><a href="../index.html">← DASHBOARD</a><a href="../pages/database-admin.html">ASSET DATABASE</a><a href="../pages/dev.html">DEV LAB</a><a href="../pages/sandbox.html">3D SANDBOX</a></aside></div></section>';
  const status=r.querySelector('#module-status'),message=r.querySelector('#module-message');
  r.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>{
    status.textContent='RUNNING // '+button.dataset.action;
    message.textContent='Operation accepted. This console is live and ready for the next connected engine/database module.';
    button.classList.add('fired');setTimeout(()=>button.classList.remove('fired'),350);
  }));
}