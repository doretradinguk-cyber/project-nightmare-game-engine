import { mountDevLab } from './dev-lab.js';
import { mountAssetDatabaseConsole } from './asset-database-console.js';
import { mountLiveModule } from './module-workbench.js';

const cards=[
  ['sprite-matrix','👾','01','SPRITE MATRIX','Sprites / animation layers / behaviour'],
  ['game-console','🎮','02','GAME CONSOLE','Engine selection / world state / events'],
  ['voice-scripting','🎙️','03','VOICE SCRIPTING','Narration / TTS / recording'],
  ['database-admin','🗄️','04','DATABASE & ADMIN','Asset intake / pipeline / users'],
  ['dev','🛠️','05','DEV PAGE','Full visual + text customisation'],
  ['sandbox','👁️','06','VIRTUAL SANDBOX','Mansion / Nightmare / 3D test world']
];

export function renderPage(page){
  const root=document.querySelector('#page-root');
  if(page==='dashboard'){
    const cardsHtml=cards.map(c=>'<a class="pn-console-tab" href="pages/'+c[0]+'.html"><span>'+c[1]+' '+c[2]+'</span><strong>'+c[3]+'</strong><small>'+c[4]+'</small><b>OPEN CONSOLE →</b></a>').join('');
    root.innerHTML='<section class="pn-dashboard-core">'+
      '<div class="pn-dashboard-art"><div class="pn-art-overlay"></div><div class="pn-dashboard-copy"><span>SECTOR 01 // NIGHTMARE CONTROL</span><h2>PROJECT<br><em>NIGHTMARE</em></h2><p>Original 3D horror engine // procedural architecture // adaptive reality</p><div class="pn-status"><i></i> SYSTEM ONLINE <b>—</b> VISUAL LAYER ARMED</div></div><div class="pn-dashboard-readout"><b>01</b> MANSION / CITY EDGE<br><span>ARCHITECTURE: PROCEDURAL</span><span>SURVEILLANCE: ACTIVE</span><span>JESTER SIGNAL: DORMANT</span></div></div>'+
      '<div class="pn-console-frame"><header><span>◈ NIGHTMARE CONTROL DECK</span><b>LIVE // 06 SYSTEMS</b></header><div class="pn-console-tabs">'+cardsHtml+'</div><a class="pn-sandbox-launch" href="pages/sandbox.html">👁️ ENTER VIRTUAL SANDBOX // PAGE 7 →</a></div>'+
      '<footer><span>👁 REALITY IS JUST ANOTHER LEVEL</span><b>ALL RIGHTS RESERVED // DORE TRADING UK</b><small>REFERENCE ONLY: GENRE INSPIRATION, NO COPIED ARTWORK</small></footer></section>';
    return;
  }
  if(page==='sprite-matrix'||page==='game-console'||page==='voice-scripting'){ mountLiveModule(root,page); return; }
  if(page==='dev'){ mountDevLab(root); return; }
  if(page==='database-admin'){ mountAssetDatabaseConsole(root); return; }
  if(page==='sandbox'){ root.innerHTML='<section class="console-grid"><article class="console-panel"><header>👁️ VIRTUAL SANDBOX // PAGE 7</header><div class="module-launch"><strong>🏚️ 3D ENVIRONMENT LAB</strong><p>Choose the test environment, load the Mansion and enter fullscreen when ready.</p><a class="console-button primary" href="sandbox.html">🎮 OPEN 3D SANDBOX →</a></div></article><article class="console-panel"><header>⚡ ENGINE TARGET</header><div class="module-stats"><span>THREE.JS</span><span>WEBGL 2</span><span>8 PLAYER ARCHITECTURE</span><span>ANDROID + WINDOWS</span></div></article></section>'; }
}
