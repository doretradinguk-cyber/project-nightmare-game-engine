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

const palette=[
  ['VOID','#0B0C10','OBSIDIAN BLACK'],['VOID','#1F2833','DARK SLATE'],
  ['DECAY','#2C3531','STAGNANT GREEN-GRAY'],['DECAY','#4E5D4C','WASTELAND OLIVE'],
  ['GLITCH','#FF0055','TOXIC LASER PINK'],['GLITCH','#00F0FF','CYBER TEAL'],
  ['HORIZON','#8B00FF','ELECTRIC VIOLET'],['HORIZON','#FF5500','SMOG HORIZON ORANGE']
];

export function renderPage(page){
  const root=document.querySelector('#page-root');

  if(page==='dashboard'){
    const cardsHtml=cards.map((c,i)=>'<a class="pn-console-tab tab-'+(i+1)+'" href="pages/'+c[0]+'.html"><span>'+c[1]+'</span><b>'+String(i+1).padStart(2,'0')+'</b><strong>'+c[2]+'</strong><small>'+c[3]+'</small></a>').join('');
    root.innerHTML='<section class="pn-mock-dashboard">'+
      '<img class="pn-scene-art" src="assets/backgrounds/project-nightmare-retrowave-city.svg" alt="">'+
      '<div class="pn-art-glow"></div>'+
      '<div class="pn-art-jester"><img src="assets/characters/nightmare-jester.svg" alt="The Laughing Jester"></div>'+
      '<div class="pn-art-eye pn-eye-one"><img src="assets/props/nightmare-eye.svg" alt=""></div>'+
      '<div class="pn-art-eye pn-eye-two"><img src="assets/props/nightmare-eye.svg" alt=""></div>'+
      '<div class="pn-title-block"><span>DORE TRADING UK // 3D HORROR ENGINE</span><h2>PROJECT<br><em>NIGHTMARE</em></h2><p>THE LIVING WORLD // RETROWAVE ENVIRONMENT SYSTEM</p></div>'+
      '<div class="pn-location"><span>SECTOR 01</span><strong>MANSION / CITY EDGE</strong><small>WORLD STATE: STABLE</small></div>'+
      '<div class="pn-console-frame"><div class="pn-console-head"><span>◈ NIGHTMARE CONTROL DECK</span><b>LIVE</b></div><div class="pn-console-tabs">'+cardsHtml+'</div></div>'+
      '<div class="pn-scene-readout"><span>01</span><b>ARCHITECTURE</b><small>PROCEDURAL // ADAPTIVE</small><span>02</span><b>ATMOSPHERE</b><small>RAIN // NEON // DECAY</small><span>03</span><b>SURVEILLANCE</b><small>ONLINE // EYES ACTIVE</small></div>'+
      '<div class="pn-bottom-brand"><span>👁 PROJECT NIGHTMARE</span><b>REALITY IS JUST ANOTHER LEVEL</b><small>ALL RIGHTS RESERVED // DORE TRADING UK</small></div>'+
    '</section>';
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
