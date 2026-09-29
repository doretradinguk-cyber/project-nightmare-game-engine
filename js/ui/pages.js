import { mountDevLab } from './dev-lab.js';
import { mountAssetDatabaseConsole } from './asset-database-console.js';
import { mountLiveModule } from './module-workbench.js';

const cards=[
  ['sprite-matrix','👾','SPRITE MATRIX','Sprites, animation layers & behaviour'],
  ['game-console','🎮','GAME CONSOLE','Engine controls, world state & events'],
  ['voice-scripting','🎙️','VOICE SCRIPTING','Narrator, TTS & audio laboratory'],
  ['database-admin','🗄️','DATABASE & ADMIN BRIDGE','Assets, pipeline & administration'],
  ['dev','🛠️','DEV PAGE','Visual authoring, assets & UI'],
  ['sandbox','👁️','VIRTUAL SANDBOX','Nightmare environment testing']
];

export function renderPage(page){
  const root=document.querySelector('#page-root');

  if(page==='dashboard'){
    root.innerHTML='<section class="screen-grid">'+cards.map(c=>'<a class="screen-card" href="pages/'+c[0]+'.html" aria-label="Open '+c[2]+'"><span>'+c[1]+' '+c[2]+'</span><strong>'+c[2]+'</strong><small>'+c[3]+'</small><b>OPEN CONSOLE →</b></a>').join('')+'</section><footer class="dashboard-footer">👁️ SURVEILLANCE ACTIVE // ALL RIGHTS RESERVED BY DORE TRADING UK // LIVE DEVELOPMENT INTERFACE</footer>';
    return;
  }

  if(page==='sprite-matrix'||page==='game-console'||page==='voice-scripting'){
    mountLiveModule(root,page);
    return;
  }

  if(page==='dev'){
    mountDevLab(root);
    return;
  }

  if(page==='database-admin'){
    mountAssetDatabaseConsole(root);
    return;
  }

  if(page==='sandbox'){
    root.innerHTML='<section class="console-grid"><article class="console-panel"><header>👁️ VIRTUAL SANDBOX</header><div class="module-launch"><strong>🏚️ 3D ENVIRONMENT LAB</strong><p>Launch the procedural mansion renderer and test seeds, rooms, power and content packs.</p><a class="console-button primary" href="sandbox.html">🎮 OPEN 3D SANDBOX →</a></div></article><article class="console-panel"><header>⚡ LIVE SYSTEMS</header><div class="module-stats"><span>🎨 THREE.JS</span><span>💡 PBR PIPELINE</span><span>👥 8 PLAYER WORLD</span><span>📦 CONTENT PACKS</span></div></article></section>';
  }
}
