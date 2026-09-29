const TYPE_BY_EXTENSION={
  glb:'MODEL',gltf:'MODEL',fbx:'MODEL',obj:'MODEL',blend:'BLENDER',
  png:'TEXTURE',jpg:'TEXTURE',jpeg:'TEXTURE',webp:'TEXTURE',tga:'TEXTURE',exr:'HDRI',
  wav:'AUDIO',mp3:'AUDIO',ogg:'AUDIO',m4a:'AUDIO',flac:'AUDIO',
  json:'DATA',csv:'DATA',xml:'DATA',txt:'DATA',md:'LICENCE',
  ttf:'FONT',otf:'FONT',woff:'FONT',woff2:'FONT',
  shader:'SHADER',vert:'SHADER',frag:'SHADER'
};

function esc(value){return String(value??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function ext(name){return String(name||'').split('.').pop().toLowerCase();}
function clean(name){return String(name||'').replace(/[^a-zA-Z0-9._-]+/g,'_');}

function classify(name,relative='',sourceMode='AUTO'){
  const text=(relative+'/'+name).toLowerCase();
  let source='DROPZONE', confidence='LOW', reason='No trusted source marker found.';
  const sources=[
    ['01_POLYHAVEN',['polyhaven','poly_haven']],
    ['02_KENNEY',['kenney']],
    ['03_QUATERNIUS',['quaternius']],
    ['04_BLENDER',['blender']]
  ];
  if(sourceMode!=='AUTO'){
    source=sourceMode; confidence='HIGH'; reason='Source selected by operator.';
  }else{
    for(const [folder,keys] of sources){
      if(keys.some(key=>text.includes(key))){source=folder;confidence='HIGH';reason='Source detected from path/name.';break;}
    }
    if(text.includes('original')||text.includes('dore')){source='00_ORIGINAL';confidence='MEDIUM';reason='Original-project marker detected.';}
  }
  const type=TYPE_BY_EXTENSION[ext(name)]||'UNKNOWN';
  if(source==='DROPZONE') return {source:'_DROPZONE',bucket:'REVIEW',type,confidence,reason};
  if(source==='00_ORIGINAL') return {source,bucket:type==='MODEL'?'MODELS':type==='TEXTURE'?'TEXTURES':type==='AUDIO'?'AUDIO':'INCOMING',type,confidence,reason};
  if(source==='01_POLYHAVEN') return {source,bucket:type==='MODEL'?'MODELS':type==='HDRI'?'HDRI':type==='TEXTURE'?'MATERIALS':'LICENCES',type,confidence,reason};
  if(source==='02_KENNEY') return {source,bucket:type==='MODEL'?'MODELS':type==='TEXTURE'?'TEXTURES':type==='AUDIO'?'AUDIO':'LICENCES',type,confidence,reason};
  if(source==='03_QUATERNIUS') return {source,bucket:type==='MODEL'?'MODELS':type==='TEXTURE'?'TEXTURES':'LICENCES',type,confidence,reason};
  if(source==='04_BLENDER') return {source,bucket:type==='BLENDER'?'SOURCE':type==='MODEL'?'MODELS':type==='TEXTURE'?'TEXTURES':'LICENCES',type,confidence,reason};
  return {source,bucket:'REVIEW',type,confidence,reason};
}

async function getFilesFromHandle(handle,prefix=''){
  const files=[];
  if(handle.kind==='file'){
    const file=await handle.getFile();
    file.__relativePath=prefix+handle.name;
    files.push(file);
    return files;
  }
  for await(const [name,child] of handle.entries()){
    files.push(...await getFilesFromHandle(child,prefix+name+'/'));
  }
  return files;
}

async function writeFile(root,path,file){
  const parts=path.split('/').filter(Boolean);
  const filename=parts.pop();
  let current=root;
  for(const part of parts) current=await current.getDirectoryHandle(part,{create:true});
  const target=await current.getFileHandle(filename,{create:true});
  const writable=await target.createWritable();
  await writable.write(file);
  await writable.close();
}

async function writeText(root,path,value){
  await writeFile(root,path,new Blob([value],{type:'application/json'}));
}

async function mountSourceFolders(root){
  const folders=[
    '00_ORIGINAL','01_POLYHAVEN/MODELS','01_POLYHAVEN/MATERIALS','01_POLYHAVEN/HDRI','01_POLYHAVEN/LICENCES',
    '02_KENNEY/MODELS','02_KENNEY/TEXTURES','02_KENNEY/AUDIO','02_KENNEY/LICENCES',
    '03_QUATERNIUS/MODELS','03_QUATERNIUS/TEXTURES','03_QUATERNIUS/LICENCES',
    '04_BLENDER/MODELS','04_BLENDER/TEXTURES','04_BLENDER/SOURCE','04_BLENDER/LICENCES',
    '05_AUDIO','06_TEXTURES','07_MODELS','08_EXPERIMENTAL','_DROPZONE'
  ];
  for(const path of folders){
    let current=root;
    for(const part of path.split('/')) current=await current.getDirectoryHandle(part,{create:true});
  }
}

export function mountAssetDatabaseConsole(root){
  root.innerHTML=`
  <section class="asset-console">
    <header class="asset-console-head">
      <div><span class="asset-kicker">PROJECT NIGHTMARE // DATABASE & ADMIN BRIDGE</span><h2>ASSET DATABASE CONSOLE</h2><p>Local source intake, automatic routing, licence staging and AI-ready asset classification.</p></div>
      <div class="console-leds"><i></i><i></i><i></i><b>SYS // ONLINE</b></div>
    </header>

    <div class="asset-console-frame">
      <div class="crt-screen">
        <div class="crt-scanlines"></div>
        <div class="crt-header"><span>PN-ASSETDB</span><span id="db-clock">00:00:00</span><span>CHANNEL 07</span></div>
        <div class="crt-main">
          <div class="crt-terminal">
            <div class="terminal-line">PROJECT NIGHTMARE ASSET DATABASE</div>
            <div class="terminal-line dim">SOURCE LIBRARY LINK: <b id="db-link">NOT CONNECTED</b></div>
            <div class="terminal-line">ROUTER: <b id="db-router">STANDBY</b></div>
            <div class="terminal-line">AI HANDOVER QUEUE: <b id="db-ai">0</b></div>
            <div class="terminal-line">LAST OPERATION: <span id="db-operation">NONE</span></div>
            <div class="terminal-bar"><span id="db-progress"></span></div>
          </div>
          <div class="crt-map" aria-hidden="true"><span>ASSET</span><span>SCAN</span><span>CLASSIFY</span><span>ROUTE</span><span>VERIFY</span><b>▦</b></div>
        </div>
      </div>
      <div class="floppy-drive"><div class="floppy-slot"></div><div class="floppy-label">PROJECT NIGHTMARE // ASSET SOURCE BUS</div><div class="floppy-light"></div></div>
    </div>

    <section class="asset-console-controls">
      <div class="asset-console-actions">
        <button class="console-button primary" id="db-connect">CONNECT SOURCE LIBRARY</button>
        <button class="console-button" id="db-files">INSERT FILES</button>
        <button class="console-button" id="db-folder">INSERT FOLDER</button>
        <button class="console-button primary" id="db-archive">UPLOAD INTAKE ARCHIVE</button>
        <input id="db-file-input" type="file" multiple hidden>
        <input id="db-archive-input" type="file" accept=".zip,.7z,.rar,.tar,.gz,.tgz,.tar.gz,application/zip,application/x-7z-compressed,application/x-rar-compressed" hidden>
        <label>SOURCE MODE<select id="db-source"><option value="AUTO">AUTO CLASSIFY</option><option value="00_ORIGINAL">ORIGINAL</option><option value="01_POLYHAVEN">POLYHAVEN</option><option value="02_KENNEY">KENNEY</option><option value="03_QUATERNIUS">QUATERNIUS</option><option value="04_BLENDER">BLENDER</option><option value="_DROPZONE">REVIEW / DROPZONE</option></select></label>
      </div>
      <div class="asset-dropbay" id="db-dropbay">
        <div class="drop-glyph">⇩</div><strong>DROP FILES OR FOLDERS INTO THE CONSOLE</strong><small>CONNECT <b>ASSET_SOURCE_LIBRARY/</b> first — originals are preserved and routed into the source structure.</small>
      </div>
    </section>

    <section class="asset-console-lower">
      <article class="console-panel source-panel"><header>SOURCE LIBRARY</header><div class="source-tree" id="db-tree"></div></article>
      <article class="console-panel queue-panel"><header>INGEST QUEUE // AI HANDOVER</header><div id="db-queue" class="db-queue"><div class="db-empty">NO FILES WAITING</div></div></article>
      <article class="console-panel log-panel"><header>OPERATION LOG</header><div id="db-log" class="db-log"><div>SYSTEM READY // WAITING FOR SOURCE LIBRARY</div></div></article>
    </section>
  </section>`;

  let sourceRoot=null;
  let queue=[];
  const source=root.querySelector('#db-source');
  const log=root.querySelector('#db-log');

  const tree=['00_ORIGINAL','01_POLYHAVEN/MODELS','01_POLYHAVEN/MATERIALS','01_POLYHAVEN/HDRI','01_POLYHAVEN/LICENCES','02_KENNEY/MODELS','02_KENNEY/TEXTURES','02_KENNEY/AUDIO','02_KENNEY/LICENCES','03_QUATERNIUS/MODELS','03_QUATERNIUS/TEXTURES','03_QUATERNIUS/LICENCES','04_BLENDER/MODELS','04_BLENDER/TEXTURES','04_BLENDER/SOURCE','04_BLENDER/LICENCES','05_AUDIO','06_TEXTURES','07_MODELS','08_EXPERIMENTAL','_DROPZONE'];
  root.querySelector('#db-tree').innerHTML=tree.map(x=>'<span>▸ '+x+'</span>').join('');

  function addLog(text){const item=document.createElement('div');item.textContent=new Date().toLocaleTimeString('en-GB')+' // '+text;log.prepend(item);while(log.children.length>18)log.lastElementChild.remove();}
  function updateClock(){root.querySelector('#db-clock').textContent=new Date().toLocaleTimeString('en-GB',{hour12:false});}
  const clock=setInterval(updateClock,1000);updateClock();

  function renderQueue(){
    root.querySelector('#db-ai').textContent=queue.length;
    const target=root.querySelector('#db-queue');
    if(!queue.length){target.innerHTML='<div class="db-empty">NO FILES WAITING</div>';return;}
    target.innerHTML=queue.map((item,i)=>`<div class="db-queue-row"><span>${i+1}</span><strong>${esc(item.name)}</strong><small>${esc(item.destination)}</small><em>${esc(item.type)} // ${esc(item.confidence)}</em></div>`).join('');
  }

  async function connect(){
    if(!window.showDirectoryPicker) throw new Error('File System Access API unavailable in this browser.');
    sourceRoot=await window.showDirectoryPicker({id:'project-nightmare-source-library',mode:'readwrite'});
    await mountSourceFolders(sourceRoot);
    root.querySelector('#db-link').textContent='CONNECTED // WRITE';
    root.querySelector('#db-router').textContent='READY';
    addLog('SOURCE LIBRARY CONNECTED // REQUIRED FOLDERS VERIFIED');
  }

  async function ingestArchive(file){
    if(!sourceRoot) throw new Error('Connect ASSET_SOURCE_LIBRARY first.');
    if(!file) return;
    const extension=ext(file.name);
    const allowed=['zip','7z','rar','tar','gz','tgz'];
    if(!allowed.includes(extension)) throw new Error('Unsupported archive format. Use ZIP or 7-Zip (.7z).');
    queue=[{
      name:file.name,
      type:'INTAKE ARCHIVE',
      confidence:'OPERATOR',
      destination:'_DROPZONE/'+clean(file.name),
      status:'READY FOR AI INTAKE'
    }];
    renderQueue();
    root.querySelector('#db-router').textContent='ARCHIVE INTAKE';
    root.querySelector('#db-progress').style.width='35%';
    addLog('INTAKE ARCHIVE SELECTED // '+file.name);
    await writeFile(sourceRoot,'_DROPZONE/'+clean(file.name),file);
    root.querySelector('#db-progress').style.width='100%';
    root.querySelector('#db-router').textContent='COMPLETE';
    root.querySelector('#db-operation').textContent='ARCHIVE STAGED';
    await writeText(sourceRoot,'_DROPZONE/asset-ingest-queue.json',JSON.stringify({
      schemaVersion:1,generatedAt:new Date().toISOString(),purpose:'AI handover queue',
      records:[{name:file.name,type:'INTAKE ARCHIVE',confidence:'OPERATOR',destination:'_DROPZONE/'+clean(file.name),status:'READY FOR AI INTAKE'}]
    },null,2));
    addLog('ARCHIVE STAGED // '+file.name+' -> ASSET_SOURCE_LIBRARY/_DROPZONE');
  }

  async function ingestFiles(files){
    if(!sourceRoot) throw new Error('Connect ASSET_SOURCE_LIBRARY first.');
    const selected=[...files];
    if(!selected.length) return;
    queue=[];
    renderQueue();
    root.querySelector('#db-progress').style.width='8%';
    root.querySelector('#db-router').textContent='SCANNING';
    for(let i=0;i<selected.length;i++){
      const file=selected[i];
      const relative=file.__relativePath||file.webkitRelativePath||file.name;
      const result=classify(file.name,relative,source.value);
      const destination=result.source+'/'+result.bucket+'/'+clean(file.name);
      queue.push({name:file.name,type:result.type,confidence:result.confidence,destination});
      renderQueue();
      addLog('CLASSIFIED '+file.name+' -> '+destination);
      await writeFile(sourceRoot,destination,file);
      root.querySelector('#db-progress').style.width=Math.round(((i+1)/selected.length)*100)+'%';
    }
    await writeText(sourceRoot,'_DROPZONE/asset-ingest-queue.json',JSON.stringify({
      schemaVersion:1,generatedAt:new Date().toISOString(),purpose:'AI handover queue',
      records:queue.map((item)=>({...item,status:item.destination.startsWith('_DROPZONE')?'REVIEW':'ROUTED'}))
    },null,2));
    root.querySelector('#db-router').textContent='COMPLETE';
    root.querySelector('#db-operation').textContent=selected.length+' ASSET'+(selected.length===1?'':'S')+' ROUTED';
    addLog('INGEST COMPLETE // ORIGINALS COPIED // AI QUEUE WRITTEN');
  }

  root.querySelector('#db-connect').addEventListener('click',async()=>{
    try{await connect();}catch(error){if(error.name!=='AbortError'){addLog('CONNECT ERROR // '+error.message);root.querySelector('#db-link').textContent='ERROR';}}
  });
  root.querySelector('#db-files').addEventListener('click',()=>root.querySelector('#db-file-input').click());
  root.querySelector('#db-file-input').addEventListener('change',async event=>{
    try{await ingestFiles(event.target.files);}catch(error){addLog('INGEST ERROR // '+error.message);}
  });
  root.querySelector('#db-folder').addEventListener('click',async()=>{
    try{
      if(!window.showDirectoryPicker) throw new Error('Folder picker unavailable.');
      const handle=await window.showDirectoryPicker({id:'project-nightmare-ingest-folder',mode:'read'});
      const files=await getFilesFromHandle(handle);
      await ingestFiles(files);
    }catch(error){if(error.name!=='AbortError')addLog('FOLDER ERROR // '+error.message);}
  });

  const bay=root.querySelector('#db-dropbay');
  ['dragenter','dragover'].forEach(type=>bay.addEventListener(type,e=>{e.preventDefault();bay.classList.add('active');}));
  ['dragleave','drop'].forEach(type=>bay.addEventListener(type,e=>{e.preventDefault();bay.classList.remove('active');}));
  bay.addEventListener('drop',async event=>{
    try{
      const handles=event.dataTransfer.items&&[...event.dataTransfer.items].map(item=>item.getAsFileSystemHandle?.()).filter(Boolean);
      if(handles?.length){
        const resolved=await Promise.all(handles);
        const files=[];
        for(const handle of resolved) files.push(...await getFilesFromHandle(handle));
        await ingestFiles(files);
      }else{
        await ingestFiles(event.dataTransfer.files);
      }
    }catch(error){addLog('DROP ERROR // '+error.message);}
  });
  root.querySelector('#db-dropbay').addEventListener('click',()=>root.querySelector('#db-connect').click());
  return ()=>clearInterval(clock);
}
