import { assetVaultStats, classifyFile, listAssets, saveAsset, deleteAsset, getAssetUrl } from '../database/asset-store.js';

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[char]));
}

export async function mountDevLab(root) {
  root.innerHTML = \`
    <section class="dev-lab">
      <header class="dev-hero">
        <div>
          <span class="dev-kicker">PROJECT NIGHTMARE // VISUAL DEVELOPMENT SYSTEM</span>
          <h2>DEV // VISUAL LAB</h2>
          <p>Build the game's visual identity here. Artwork, sprites, animation, UI elements, backgrounds and audio are designed to become reusable engine assets.</p>
        </div>
        <div class="dev-status"><b id="vault-total">0</b><span>ASSETS IN VAULT</span></div>
      </header>

      <div class="dev-grid">
        <article class="dev-panel upload-panel">
          <header><span>01</span> ASSET INGEST</header>
          <label class="dropzone" id="dropzone">
            <input id="asset-upload" type="file" multiple accept="image/*,audio/*,video/*,.json,.txt,.md,.csv,.xml">
            <strong>DROP ART / AUDIO / DATA</strong>
            <small>or click to browse your computer</small>
          </label>
          <div class="asset-fields">
            <label>Category<select id="asset-category">
              <option>characters</option><option>environments</option><option>ui</option><option>backgrounds</option><option>textures</option><option>sprites</option><option>animations</option><option>audio</option><option>data</option><option>prompts</option><option>prototypes</option>
            </select></label>
            <label>Tags<input id="asset-tags" placeholder="jester, mansion, ui"></label>
            <label>Description<input id="asset-description" placeholder="What is this asset used for?"></label>
          </div>
          <button class="dev-button" id="save-upload">INGEST INTO ASSET VAULT</button>
          <p class="dev-message" id="upload-message">WAITING FOR ASSET</p>
        </article>

        <article class="dev-panel preview-panel">
          <header><span>02</span> VISUAL PREVIEW STAGE</header>
          <div id="asset-preview" class="asset-preview">
            <div class="preview-crosshair"></div>
            <span>SELECT AN ASSET</span>
          </div>
          <div class="preview-tools">
            <button class="dev-button secondary" id="preview-clear">CLEAR</button>
            <span id="preview-info">NO ASSET SELECTED</span>
          </div>
        </article>

        <article class="dev-panel library-panel">
          <header><span>03</span> ENGINE ASSET LIBRARY</header>
          <div class="library-toolbar">
            <input id="asset-search" placeholder="Search name, tag or description">
            <select id="asset-filter"><option value="">ALL TYPES</option><option value="image">IMAGE</option><option value="animation">ANIMATION</option><option value="audio">AUDIO</option><option value="data">DATA</option><option value="binary">BINARY</option></select>
          </div>
          <div id="asset-list" class="asset-list"></div>
        </article>

        <article class="dev-panel style-panel">
          <header><span>04</span> UI / BACKGROUND LAB</header>
          <div class="style-preview">
            <div class="style-glow"></div>
            <div class="style-grid"></div>
            <strong>PROJECT NIGHTMARE</strong>
            <small>VISUAL COMPOSITION PREVIEW</small>
          </div>
          <div class="style-controls">
            <label>Atmosphere<select><option>Industrial Horror</option><option>Digital Nightmare</option><option>Carnival Nightmare</option><option>Security Facility</option></select></label>
            <label>Interface<select><option>Surveillance Glass</option><option>CRT Console</option><option>Emergency Terminal</option><option>Minimal Dark</option></select></label>
          </div>
          <p class="dev-message">VISUAL LAB IS THE FUTURE HOME FOR CUSTOM GAME UI, BACKGROUNDS, PANELS, HUDS AND MENU COMPOSITIONS.</p>
        </article>
      </div>
    </section>
  \`;

  let pendingFiles = [];
  const fileInput = root.querySelector('#asset-upload');
  const dropzone = root.querySelector('#dropzone');
  const message = root.querySelector('#upload-message');

  function stageFiles(files) {
    pendingFiles = [...files];
    message.textContent = pendingFiles.length
      ? pendingFiles.length + ' FILE' + (pendingFiles.length > 1 ? 'S' : '') + ' READY // PRESS INGEST'
      : 'WAITING FOR ASSET';
  }

  fileInput.addEventListener('change', () => stageFiles(fileInput.files));
  ['dragenter','dragover'].forEach(type => dropzone.addEventListener(type, event => {
    event.preventDefault();
    dropzone.classList.add('dragging');
  }));
  ['dragleave','drop'].forEach(type => dropzone.addEventListener(type, event => {
    event.preventDefault();
    dropzone.classList.remove('dragging');
  }));
  dropzone.addEventListener('drop', event => stageFiles(event.dataTransfer.files));

  root.querySelector('#save-upload').addEventListener('click', async () => {
    if (!pendingFiles.length) {
      message.textContent = 'NO FILES STAGED';
      return;
    }

    try {
      const category = root.querySelector('#asset-category').value;
      const tags = root.querySelector('#asset-tags').value;
      const description = root.querySelector('#asset-description').value;

      for (const file of pendingFiles) {
        await saveAsset({
          name: file.name,
          blob: file,
          type: classifyFile(file),
          category,
          tags,
          description,
          metadata: { originalName: file.name, lastModified: file.lastModified }
        });
      }

      pendingFiles = [];
      fileInput.value = '';
      message.textContent = 'INGEST COMPLETE // ASSETS ARE PERSISTED';
      await refresh();
    } catch (error) {
      message.textContent = 'INGEST ERROR // ' + error.message;
    }
  });

  root.querySelector('#asset-search').addEventListener('input', refresh);
  root.querySelector('#asset-filter').addEventListener('change', refresh);
  root.querySelector('#preview-clear').addEventListener('click', () => {
    root.querySelector('#asset-preview').innerHTML = '<div class="preview-crosshair"></div><span>SELECT AN ASSET</span>';
    root.querySelector('#preview-info').textContent = 'NO ASSET SELECTED';
  });

  async function preview(asset) {
    const stage = root.querySelector('#asset-preview');
    stage.innerHTML = '<span>LOADING ASSET...</span>';
    const url = await getAssetUrl(asset.id);

    if (!url) {
      stage.innerHTML = '<span>NO PREVIEW AVAILABLE</span>';
      return;
    }

    if (asset.type === 'image' || asset.type === 'animation') {
      const media = document.createElement('img');
      media.src = url;
      media.alt = asset.name;
      stage.replaceChildren(media);
    } else if (asset.type === 'audio') {
      const audio = document.createElement('audio');
      audio.controls = true;
      audio.src = url;
      stage.replaceChildren(audio);
    } else {
      stage.innerHTML = '<span>DATA ASSET // ' + esc(asset.mimeType) + '</span>';
    }

    root.querySelector('#preview-info').textContent = asset.name + ' // ' + asset.id;
  }

  async function refresh() {
    const search = root.querySelector('#asset-search').value;
    const type = root.querySelector('#asset-filter').value;
    const assets = await listAssets({ search, type });
    const list = root.querySelector('#asset-list');

    if (!assets.length) {
      list.innerHTML = '<div class="empty-library">ASSET VAULT EMPTY // INGEST ARTWORK TO BEGIN</div>';
    } else {
      list.innerHTML = assets.map(asset => \`
        <button class="asset-row" data-id="\${esc(asset.id)}">
          <span class="asset-type">\${esc(asset.type)}</span>
          <strong>\${esc(asset.name)}</strong>
          <small>\${esc(asset.category)} // v\${esc(asset.version)} // \${Math.ceil(asset.size / 1024)} KB</small>
          <i data-delete="\${esc(asset.id)}">×</i>
        </button>
      \`).join('');

      list.querySelectorAll('.asset-row').forEach(row => {
        row.addEventListener('click', async event => {
          if (event.target.closest('[data-delete]')) {
            event.stopPropagation();
            await deleteAsset(event.target.closest('[data-delete]').dataset.delete);
            await refresh();
            return;
          }
          const asset = assets.find(item => item.id === row.dataset.id);
          if (asset) preview(asset);
        });
      });
    }

    const stats = await assetVaultStats();
    root.querySelector('#vault-total').textContent = stats.total;
  }

  await refresh();
}
