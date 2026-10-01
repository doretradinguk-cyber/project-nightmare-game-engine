const nav=[['sprite-matrix','👾 SPRITE MATRIX','pages/sprite-matrix.html'],['game-console','🎮 GAME CONSOLE','pages/game-console.html'],['voice-scripting','🎙️ VOICE SCRIPTING','pages/voice-scripting.html'],['database-admin','🗄️ DATABASE & ADMIN','pages/database-admin.html'],['dev','🛠️ DEV PAGE','pages/dev.html'],['sandbox','👁️ VIRTUAL SANDBOX','pages/sandbox.html']];

function rainMarkup(base){
  const glyphs=['ᚠ','ᛉ','ᛟ','𓂀','𐌗','7','101','404','☠','👁','ϟ','∴','∆','ᚱ'];
  return '<div class="pn-code-rain" aria-hidden="true">'+Array.from({length:72},(_,i)=>'<span style="left:'+((i*17)%100)+'%;animation-delay:-'+(i%11)+'s;animation-duration:'+(6+(i%7))+'s">'+glyphs[i%glyphs.length]+' '+glyphs[(i+3)%glyphs.length]+'</span>').join('')+'</div>'+
  '<div class="pn-jester-rain" aria-hidden="true"><img src="'+base+'assets/characters/nightmare-jester.svg" alt=""><i></i></div>';
}
export function renderShell(page){
  const root=document.querySelector('#app'),base=page==='dashboard'?'':'../';
  const links=[['dashboard','⌂ DASHBOARD',base+'index.html'],...nav.map(([id,label,url])=>[id,label,base+url])];
  root.innerHTML='<main class="nightmare-shell '+(page==='dashboard'?'dashboard-shell':'tool-shell')+'" data-page="'+page+'"><div class="pn-background"></div><div class="pn-background-shade"></div>'+rainMarkup(base)+
  '<div class="pn-sentinel pn-sentinel-left"><img src="'+base+'assets/props/nightmare-eye.svg" alt=""></div><div class="pn-sentinel pn-sentinel-right"><img src="'+base+'assets/props/nightmare-eye.svg" alt=""></div>'+
  '<header class="nightmare-header"><div class="pn-brand"><small>DORE TRADING UK // 3D HORROR ENGINE</small><h1>PROJECT NIGHTMARE</h1><p>Brought to you by Seumas Dore &amp; Lewis Dore, all rights reserved by Dore Trading UK</p></div><nav class="nightmare-nav">'+links.map(([id,label,url])=>'<a class="'+(id===page?'active':'')+'" href="'+url+'">'+label+'</a>').join('')+'</nav><label class="pn-background-upload">⛶ UPLOAD BACKGROUND / ANIMATION<input id="backgroundUpload" type="file" accept="image/*,video/*"></label></header><section id="page-root"></section></main>';
}