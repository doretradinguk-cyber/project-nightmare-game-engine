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
    const paletteHtml=palette.map(([group,hex,name])=>'<div class="pn-swatch" data-group="'+group+'"><i style="--sw:'+hex+'"></i><span>'+hex+'</span><small>'+name+'</small></div>').join('');
    const cardsHtml=cards.map(c=>'<a class="pn-card" href="pages/'+c[0]+'.html" aria-label="Open '+c[2]+'"><span>'+c[1]+' '+c[2]+'</span><strong>'+c[2]+'</strong><small>'+c[3]+'</small><b>OPEN CONSOLE →</b></a>').join('');
    root.innerHTML='<section class="pn-dashboard">'+
      '<div class="pn-hero">'+
        '<div class="pn-hero-sky"></div><div class="pn-sun"></div><div class="pn-city"></div><div class="pn-road"></div>'+
        '<div class="pn-hero-grid"></div><div class="pn-hero-scan"></div>'+
        '<div class="pn-hero-copy"><span>3D GAME ENVIRONMENT &amp; ASSETS // RETROWAVE HORROR SYSTEM</span><h2>REALITY IS<br><em>JUST ANOTHER LEVEL</em></h2><p>Rain-soaked architecture. Neon surveillance. Procedural nightmares.</p><div class="pn-status"><i></i> ENGINE ONLINE <b>THREE.JS // PBR // CONTENT PACKS</b></div></div>'+
        '<div class="pn-facility"><span>12</span><small>CENTRAL RESEARCH<br>FACILITY</small><b>SECTOR</b></div>'+
        '<div class="pn-hud-corner pn-hud-left">SYS_01 // NIGHTMARE<br>WORLD: MANSION<br>MODE: DEVELOPMENT</div>'+
        '<div class="pn-hud-corner pn-hud-right">SIGNAL: STABLE<br>ASSETS: ONLINE<br>PLAYERS: 08 MAX</div>'+
      '</div>'+
      '<div class="pn-section-head"><span>01 // COMMAND DECK</span><strong>PROJECT NIGHTMARE SYSTEMS</strong><small>SELECT A LIVE DEVELOPMENT CONSOLE</small></div>'+
      '<div class="pn-card-grid">'+cardsHtml+'</div>'+
      '<div class="pn-lower">'+
        '<section class="pn-panel pn-scenes"><header><span>02 // WORLD MODULES</span><strong>3D ENVIRONMENT MAP</strong></header><div class="pn-scene-grid"><div class="pn-scene lobby"><b>MANSION LOBBY</b><small>FIXED START</small></div><div class="pn-scene corridor"><b>PROCEDURAL CORRIDOR</b><small>RECONFIGURABLE</small></div><div class="pn-scene control"><b>CONTROL ROOM</b><small>SURVEILLANCE</small></div><div class="pn-scene roof"><b>ROOFTOP CITY</b><small>TERMINAL HORIZON</small></div></div></section>'+
        '<section class="pn-panel pn-palette"><header><span>03 // COLOUR SYSTEM</span><strong>CORE PALETTE</strong></header><div class="pn-palette-grid">'+paletteHtml+'</div></section>'+
      '</div>'+
      '<footer class="pn-footer"><span>👁️ PROJECT NIGHTMARE</span><b>DORE TRADING UK</b><small>3D RETROWAVE // CYBER HORROR // ORIGINAL IP</small></footer>'+
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
