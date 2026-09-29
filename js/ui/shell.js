const nav=[['sprite-matrix','👾 Sprite Matrix','pages/sprite-matrix.html'],['game-console','🎮 Game Console','pages/game-console.html'],['voice-scripting','🎙️ Voice Scripting','pages/voice-scripting.html'],['database-admin','🗄️ Database & Admin Bridge','pages/database-admin.html'],['dev','🛠️ Dev Page','pages/dev.html'],['sandbox','👁️ Virtual Sandbox','pages/sandbox.html']];

export function renderShell(page){
  const root=document.querySelector('#app');
  const windows=Array.from({length:180},(_,i)=>'<i class="window '+(i%17===0?'face ':'')+(i%7===0?'light':'')+'" data-window="'+i+'"></i>').join('');
  const rain=Array.from({length:56},(_,i)=>'<span class="glyph" style="left:'+((i*37)%100)+'%;animation-duration:'+(5+(i%8))+'s;animation-delay:-'+(i%9)+'s">ᚠ ϟ 𓂀 7 101 ᛉ</span>').join('');
  const base=page==='dashboard'?'':'../';
  const links=[['dashboard','🏠 DASHBOARD',base+'index.html'],...nav.map(([id,label,url])=>[id,label,base+url])];
  root.innerHTML='<main class="nightmare-shell" data-world="mansion"><div class="building">'+windows+'</div><div class="code-rain">'+rain+'</div><div class="jester" aria-label="The Laughing Jester"><img src="'+base+'assets/characters/nightmare-jester.svg" alt=""></div><div class="surveillance-status"><span class="status-dot"></span> 👁️ SURVEILLANCE NETWORK // ACTIVE</div><header class="nightmare-header"><small>DORE TRADING UK</small><h1>PROJECT NIGHTMARE</h1><p>Brought to you by Seumas Dore &amp; Lewis Dore</p><nav class="nightmare-nav">'+links.map(([id,label,url])=>'<a class="'+(id===page?'active':'')+'" data-system="'+id+'" href="'+url+'">'+label+'</a>').join('')+'</nav></header><section id="page-root"></section></main>';
}