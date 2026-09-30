const nav=[['sprite-matrix','👾 Sprite Matrix','pages/sprite-matrix.html'],['game-console','🎮 Game Console','pages/game-console.html'],['voice-scripting','🎙️ Voice Scripting','pages/voice-scripting.html'],['database-admin','🗄️ Database & Admin Bridge','pages/database-admin.html'],['dev','🛠️ Dev Page','pages/dev.html'],['sandbox','👁️ Virtual Sandbox','pages/sandbox.html']];

export function renderShell(page){
  const root=document.querySelector('#app');
  const base=page==='dashboard'?'':'../';
  const links=[['dashboard','🏠 DASHBOARD',base+'index.html'],...nav.map(([id,label,url])=>[id,label,base+url])];
  const atmosphere=page==='dashboard'
    ? '<div class="dashboard-atmosphere" aria-hidden="true"><div class="atmosphere-noise"></div><div class="atmosphere-vignette"></div></div>'
    : '<div class="building">'+Array.from({length:180},(_,i)=>'<i class="window '+(i%17===0?'face ':'')+(i%7===0?'light':'')+'"></i>').join('')+'</div><div class="code-rain">'+Array.from({length:56},(_,i)=>'<span class="glyph" style="left:'+((i*37)%100)+'%;animation-duration:'+(5+(i%8))+'s;animation-delay:-'+(i%9)+'s">ᚠ ϟ 𓂀 7 101 ᛉ</span>').join('')+'</div><div class="jester"><img src="'+base+'assets/characters/nightmare-jester.svg" alt=""></div>';
  root.innerHTML='<main class="nightmare-shell '+(page==='dashboard'?'dashboard-shell':'')+'" data-world="mansion">'+atmosphere+
    '<header class="nightmare-header"><small>DORE TRADING UK</small><h1>PROJECT NIGHTMARE</h1><p>Brought to you by Seumas Dore &amp; Lewis Dore</p><nav class="nightmare-nav">'+links.map(([id,label,url])=>'<a class="'+(id===page?'active':'')+'" data-system="'+id+'" href="'+url+'">'+label+'</a>').join('')+'</nav></header>'+
    '<section id="page-root"></section></main>';
}