import { mountDevLab } from './dev-lab.js';

const cards=[['sprite-matrix','SPRITE MATRIX','Sprites, animation layers & behaviour'],['game-console','GAME CONSOLE','Suemas / Ruby / Lewis engine control'],['voice-scripting','VOICE SCRIPTING','Narrator, TTS & audio laboratory'],['database-admin','DATABASE & ADMIN BRIDGE','Assets, pipeline, users & memos'],['dev','DEV PAGE','Visual authoring, assets & UI'],['sandbox','VIRTUAL SANDBOX','Nightmare environment testing']];

export function renderPage(page){
  const r=document.querySelector('#page-root');

  if(page==='dashboard'){
    r.innerHTML='<section class="screen-grid">'+cards.map(c=>'<a class="screen-card" href="pages/'+c[0]+'.html"><span>'+c[0].toUpperCase()+'</span><strong>'+c[1]+'</strong><small>'+c[2]+'</small></a>').join('')+'</section><footer class="dashboard-footer">ALL RIGHTS RESERVED BY DORE TRADING UK // ORIGINAL PROJECT NIGHTMARE SYSTEM</footer>';
    return;
  }

  if(page==='dev'){
    mountDevLab(r);
    return;
  }

  const titles={'sprite-matrix':'SPRITE MATRIX','game-console':'GAME CONSOLE','voice-scripting':'VOICE SCRIPTING','database-admin':'DATABASE & ADMIN BRIDGE','sandbox':'VIRTUAL SANDBOX'};
  r.innerHTML='<section class="console-grid"><article class="console-panel"><header>'+titles[page]+' // PRIMARY CONSOLE</header><div>SYSTEM READY</div></article><article class="console-panel"><header>TOOLS / ASSETS</header><div>AWAITING MODULES</div></article></section>';
}
