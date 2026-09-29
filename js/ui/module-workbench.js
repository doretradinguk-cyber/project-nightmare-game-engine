const MODULES = {
  'sprite-matrix': {
    kicker: 'CHARACTER / ANIMATION LAB',
    title: 'SPRITE MATRIX',
    subtitle: 'A live sprite-control surface for characters, animation states and visual signal layers.',
    commands: ['NEW SPRITE', 'IMPORT ASSET', 'PLAY', 'STOP'],
    metrics: [['SPRITES','0'],['CLIPS','0'],['FPS','60'],['STATE','IDLE']]
  },
  'game-console': {
    kicker: 'ENGINE CONTROL / WORLD EVENTS',
    title: 'GAME CONSOLE',
    subtitle: 'Operate a development session, generate a world and inject controlled nightmare events.',
    commands: ['BOOT ENGINE', 'NEW WORLD', 'LOCKDOWN', 'TRIGGER EVENT'],
    metrics: [['ENGINE','OFFLINE'],['SEED','—'],['PLAYERS','1 / 8'],['POWER','68%']]
  },
  'voice-scripting': {
    kicker: 'VOICE / NARRATIVE LAB',
    title: 'VOICE SCRIPTING',
    subtitle: 'Write, preview and save spoken lines for characters, events and surveillance transmissions.',
    commands: ['NEW LINE', 'PLAY PREVIEW', 'STOP VOICE', 'SAVE SCRIPT'],
    metrics: [['LINES','0'],['VOICE','EN-GB'],['RATE','1.0'],['STATUS','READY']]
  }
};

const escapeHtml = value => String(value ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function shellMarkup(page, cfg) {
  return `
  <section class="live-console" data-module="${page}">
    <header class="live-console-head">
      <div>
        <span class="live-kicker">${cfg.kicker}</span>
        <h2>${cfg.title}</h2>
        <p>${cfg.subtitle}</p>
      </div>
      <div class="live-signal"><i></i><strong>LIVE DEVELOPMENT LINK</strong><small>LOCAL SESSION // READY</small></div>
    </header>

    <div class="command-deck">
      <div class="command-label">COMMAND DECK</div>
      <div class="command-buttons">${cfg.commands.map((c,i)=>`<button class="live-button ${i===0?'primary':''}" data-command="${c}">${c}</button>`).join('')}</div>
    </div>

    <div class="telemetry-grid">${cfg.metrics.map(m=>`<article><small>${m[0]}</small><strong data-metric="${m[0]}">${m[1]}</strong><span></span></article>`).join('')}</div>

    <div class="live-workspace">
      <section class="live-viewport">
        <header><span>LIVE VIEWPORT</span><b data-live-clock>00:00:00</b></header>
        <div class="viewport-stage" data-stage>
          <div class="stage-grid"></div>
          <div class="scan-beam"></div>
          <div class="stage-crosshair">+</div>
          <div class="stage-entity" data-entity><img src="../assets/characters/nightmare-jester.svg" alt="Jester preview"><b>JESTER</b><small>ENTITY // DORMANT</small></div>
          <div class="stage-readout">SIGNAL: <strong data-signal>STABLE</strong><br>FEED: ${page.toUpperCase()}<br>INPUT: LOCAL</div>
        </div>
        <div class="timeline"><span>00:00</span><div><i data-progress></i><b data-playhead></b></div><span>00:10</span></div>
      </section>

      <aside class="inspector">
        <header>LIVE INSPECTOR</header>
        <div class="inspector-row"><span>MODULE</span><strong>${page.toUpperCase()}</strong></div>
        <div class="inspector-row"><span>SESSION</span><strong data-session>STANDBY</strong></div>
        <div class="inspector-row"><span>LAST EVENT</span><strong data-last-event>NONE</strong></div>
        <div class="inspector-block">
          <label>INTENSITY <input data-intensity type="range" min="0" max="100" value="42"></label>
          <label>SIGNAL <select data-signal-mode><option>STABLE</option><option>CORRUPTED</option><option>HOSTILE</option></select></label>
        </div>
        <div class="inspector-log" data-log><div>00:00:00 // CONSOLE MOUNTED</div><div>00:00:00 // WAITING FOR COMMAND</div></div>
      </aside>
    </div>

    <div class="module-specific" data-specific></div>
  </section>`;
}

function log(root, message) {
  const box = root.querySelector('[data-log]');
  const time = new Date().toLocaleTimeString('en-GB',{hour12:false});
  const row = document.createElement('div');
  row.textContent = time + ' // ' + message;
  box.prepend(row);
  while (box.children.length > 8) box.lastElementChild.remove();
  root.querySelector('[data-last-event]').textContent = message;
  root.querySelector('[data-session]').textContent = 'ACTIVE';
}

function metric(root, name, value) {
  const el = root.querySelector('[data-metric="'+name+'"]');
  if (el) el.textContent = value;
}

function commonControls(root, page) {
  const entity = root.querySelector('[data-entity]');
  const progress = root.querySelector('[data-progress]');
  const playhead = root.querySelector('[data-playhead]');
  let timer = null;
  let started = false;

  const setProgress = value => {
    progress.style.width = value + '%';
    playhead.style.left = value + '%';
  };

  root.querySelector('[data-intensity]').addEventListener('input', event => {
    const value = Number(event.target.value);
    entity.style.transform = 'translate(-50%,-50%) scale(' + (0.78 + value / 230) + ')';
    entity.style.filter = 'drop-shadow(0 0 ' + (5 + value/5) + 'px rgba(255,41,77,.55))';
    log(root, 'INTENSITY // ' + value + '%');
  });

  root.querySelector('[data-signal-mode]').addEventListener('change', event => {
    root.querySelector('[data-signal]').textContent = event.target.value;
    root.querySelector('[data-stage]').dataset.signal = event.target.value.toLowerCase();
    log(root, 'SIGNAL // ' + event.target.value);
  });

  const startTimeline = () => {
    clearInterval(timer);
    let value = 0;
    timer = setInterval(() => {
      value += 2;
      setProgress(value);
      if (value >= 100) { clearInterval(timer); started = false; metric(root,'STATE','IDLE'); }
    }, 100);
  };

  root.querySelectorAll('[data-command]').forEach(button => button.addEventListener('click', async () => {
    const command = button.dataset.command;
    button.classList.add('fired');
    setTimeout(() => button.classList.remove('fired'), 250);

    if (page === 'sprite-matrix') {
      if (command === 'NEW SPRITE') {
        const count = Number(localStorage.getItem('pn.sprite.count') || 0) + 1;
        localStorage.setItem('pn.sprite.count', count);
        metric(root,'SPRITES',count);
        log(root,'SPRITE CREATED // SLOT ' + count);
      } else if (command === 'IMPORT ASSET') {
        const input = document.createElement('input');
        input.type='file'; input.accept='image/*,.gif,.webp,.json'; input.multiple=true;
        input.onchange=()=>{ const n=input.files.length; metric(root,'CLIPS',n); log(root,n ? 'ASSET QUEUE // '+n+' FILES' : 'IMPORT CANCELLED'); };
        input.click();
      } else if (command === 'PLAY') {
        started = true; metric(root,'STATE','PLAYING'); entity.classList.add('entity-playing'); log(root,'ANIMATION // PLAY'); startTimeline();
      } else {
        started = false; clearInterval(timer); metric(root,'STATE','IDLE'); entity.classList.remove('entity-playing'); setProgress(0); log(root,'ANIMATION // STOP');
      }
    }

    if (page === 'game-console') {
      if (command === 'BOOT ENGINE') {
        metric(root,'ENGINE','RUNNING'); log(root,'ENGINE BOOT // COMPLETE'); root.querySelector('[data-signal]').textContent='ONLINE';
      } else if (command === 'NEW WORLD') {
        const seed = Math.floor(100000 + Math.random()*899999);
        localStorage.setItem('pn.world.seed',seed);
        metric(root,'SEED',seed); log(root,'WORLD SEED // '+seed); buildWorld(root,seed);
      } else if (command === 'LOCKDOWN') {
        metric(root,'POWER','31%'); root.querySelector('[data-stage]').dataset.signal='hostile'; log(root,'SECURITY // LOCKDOWN');
      } else {
        root.querySelector('[data-stage]').classList.add('event-flash');
        setTimeout(()=>root.querySelector('[data-stage]').classList.remove('event-flash'),650);
        log(root,'EVENT // NIGHTMARE SIGNAL INJECTED');
      }
    }

    if (page === 'voice-scripting') {
      if (command === 'NEW LINE') {
        const count = Number(localStorage.getItem('pn.voice.lines') || 0) + 1;
        localStorage.setItem('pn.voice.lines',count); metric(root,'LINES',count); addVoiceLine(root,count); log(root,'LINE CREATED // '+count);
      } else if (command === 'PLAY PREVIEW') {
        const text = root.querySelector('[data-script]')?.value || 'Project Nightmare. The house is awake.';
        if ('speechSynthesis' in window) { speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang='en-GB'; u.rate=Number(root.querySelector('[data-rate]').value); u.pitch=Number(root.querySelector('[data-pitch]').value); speechSynthesis.speak(u); metric(root,'STATUS','SPEAKING'); log(root,'VOICE // PREVIEW PLAYING'); u.onend=()=>metric(root,'STATUS','READY'); }
        else log(root,'VOICE // SPEECH API UNAVAILABLE');
      } else if (command === 'STOP VOICE') {
        if ('speechSynthesis' in window) speechSynthesis.cancel(); metric(root,'STATUS','READY'); log(root,'VOICE // STOPPED');
      } else {
        localStorage.setItem('pn.voice.script',root.querySelector('[data-script]')?.value || '');
        log(root,'SCRIPT // SAVED LOCALLY');
      }
    }
  }));
}

function buildWorld(root, seed) {
  const stage=root.querySelector('[data-stage]');
  stage.querySelectorAll('.world-node').forEach(n=>n.remove());
  const count=7;
  for(let i=0;i<count;i++){
    const node=document.createElement('i');
    node.className='world-node';
    node.style.left=(12+((seed*(i+3))%76))+'%';
    node.style.top=(18+((seed*(i+7))%62))+'%';
    node.title='World node '+(i+1);
    stage.appendChild(node);
  }
}

function addVoiceLine(root, count) {
  const list=root.querySelector('[data-lines]');
  const row=document.createElement('button');
  row.className='voice-line';
  row.innerHTML='<span>'+String(count).padStart(2,'0')+'</span><strong>New nightmare line</strong><small>UNASSIGNED</small>';
  row.addEventListener('click',()=>{root.querySelector('[data-script]').focus();log(root,'LINE SELECTED // '+String(count).padStart(2,'0'));});
  list.prepend(row);
}

function specificMarkup(page) {
  if(page==='sprite-matrix') return `
    <div class="specific-panel"><header>ANIMATION STACK</header><div class="stack-row"><span>IDLE</span><span>WALK</span><span>RUN</span><span>ATTACK</span><span>GLITCH</span></div></div>
    <div class="specific-panel"><header>FRAME CONTROLS</header><div class="control-strip"><button data-frame="-1">◀ FRAME</button><button data-frame="1">FRAME ▶</button><label>LOOP <input type="checkbox" checked></label><label>ONION <input type="checkbox"></label></div></div>`;
  if(page==='game-console') return `
    <div class="specific-panel world-panel"><header>PROCEDURAL WORLD MAP</header><div class="mini-map" data-map><span class="map-hub">HUB</span></div></div>
    <div class="specific-panel"><header>EVENT BUS</header><div class="event-chips"><button data-event="POWER FAILURE">POWER FAILURE</button><button data-event="CCTV CORRUPTION">CCTV CORRUPTION</button><button data-event="JESTER SIGHTING">JESTER SIGHTING</button><button data-event="DOOR MOVEMENT">DOOR MOVEMENT</button></div></div>`;
  return `
    <div class="specific-panel script-panel"><header>SCRIPT EDITOR</header><textarea data-script spellcheck="false" placeholder="Type a line for the Nightmare voice..."></textarea><div class="voice-controls"><label>RATE <input data-rate type="range" min=".5" max="1.6" step=".1" value="1"></label><label>PITCH <input data-pitch type="range" min=".4" max="1.6" step=".1" value="1"></label><label>VOICE <select><option>English (United Kingdom)</option><option>Browser default</option></select></label></div></div>
    <div class="specific-panel"><header>LINE QUEUE</header><div class="voice-lines" data-lines><div class="empty-lines">NO LINES YET // PRESS NEW LINE</div></div></div>`;
}

export function mountLiveModule(root, page) {
  const cfg=MODULES[page];
  root.innerHTML=shellMarkup(page,cfg)+specificMarkup(page);
  const script=localStorage.getItem('pn.voice.script');
  if(page==='voice-scripting' && script) root.querySelector('[data-script]').value=script;
  const seed=localStorage.getItem('pn.world.seed');
  if(page==='game-console' && seed){ metric(root,'SEED',seed); buildWorld(root,seed); }
  if(page==='sprite-matrix') metric(root,'SPRITES',localStorage.getItem('pn.sprite.count')||'0');
  if(page==='voice-scripting') metric(root,'LINES',localStorage.getItem('pn.voice.lines')||'0');

  commonControls(root,page);

  root.querySelectorAll('[data-event]').forEach(button=>button.addEventListener('click',()=>{
    const stage=root.querySelector('[data-stage]');
    stage.classList.add('event-flash'); setTimeout(()=>stage.classList.remove('event-flash'),500);
    log(root,'EVENT BUS // '+button.dataset.event);
  }));

  root.querySelectorAll('[data-frame]').forEach(button=>button.addEventListener('click',()=>log(root,'FRAME STEP // '+button.dataset.frame)));
  const clock=root.querySelector('[data-live-clock]');
  setInterval(()=>clock.textContent=new Date().toLocaleTimeString('en-GB',{hour12:false}),1000);
}
