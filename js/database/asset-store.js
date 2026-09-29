const DB_NAME = 'project-nightmare-assets';
const DB_VERSION = 1;
const STORE = 'assets';

let dbPromise = null;

function openDatabase() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (db.objectStoreNames.contains(STORE)) return;
      const store = db.createObjectStore(STORE, { keyPath: 'id' });
      store.createIndex('type', 'type', { unique: false });
      store.createIndex('category', 'category', { unique: false });
      store.createIndex('name', 'name', { unique: false });
      store.createIndex('updatedAt', 'updatedAt', { unique: false });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return dbPromise;
}

function transaction(mode = 'readonly') {
  return openDatabase().then(db => db.transaction(STORE, mode).objectStore(STORE));
}

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function makeId() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return 'asset-' + Date.now() + '-' + Math.random().toString(36).slice(2);
}

function normaliseTags(tags) {
  if (Array.isArray(tags)) return tags.map(String).map(t => t.trim()).filter(Boolean);
  return String(tags || '').split(',').map(t => t.trim()).filter(Boolean);
}

export async function saveAsset(input) {
  if (!input?.blob && input?.data == null) throw new Error('Asset data is required');

  const now = new Date().toISOString();
  const id = input.id || makeId();
  const existing = input.id ? await getAsset(input.id) : null;

  const asset = {
    id,
    name: String(input.name || existing?.name || 'Untitled Asset'),
    type: String(input.type || existing?.type || 'unknown'),
    category: String(input.category || existing?.category || 'general'),
    mimeType: String(input.mimeType || input.blob?.type || existing?.mimeType || 'application/octet-stream'),
    size: Number(input.size ?? input.blob?.size ?? existing?.size ?? 0),
    tags: normaliseTags(input.tags ?? existing?.tags),
    description: String(input.description ?? existing?.description ?? ''),
    enginePath: String(input.enginePath ?? existing?.enginePath ?? ''),
    version: Number(input.version ?? existing?.version ?? 1),
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    blob: input.blob ?? existing?.blob ?? input.data,
    metadata: { ...(existing?.metadata || {}), ...(input.metadata || {}) }
  };

  const store = await transaction('readwrite');
  await requestResult(store.put(asset));
  return stripBlob(asset);
}

export async function getAsset(id) {
  const store = await transaction();
  return requestResult(store.get(id));
}

export async function listAssets(filters = {}) {
  const store = await transaction();
  const all = await requestResult(store.getAll());
  const search = String(filters.search || '').toLowerCase();

  return all
    .filter(asset => !filters.type || asset.type === filters.type)
    .filter(asset => !filters.category || asset.category === filters.category)
    .filter(asset => !filters.tag || asset.tags.includes(filters.tag))
    .filter(asset => !search || asset.name.toLowerCase().includes(search) ||
      asset.description.toLowerCase().includes(search) ||
      asset.tags.some(tag => tag.toLowerCase().includes(search)))
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
    .map(stripBlob);
}

export async function deleteAsset(id) {
  const store = await transaction('readwrite');
  await requestResult(store.delete(id));
  return id;
}

export async function getAssetBlob(id) {
  const asset = await getAsset(id);
  return asset?.blob || null;
}

export async function getAssetUrl(id) {
  const blob = await getAssetBlob(id);
  return blob ? URL.createObjectURL(blob) : null;
}

export async function clearAssetVault() {
  const store = await transaction('readwrite');
  await requestResult(store.clear());
}

export async function assetVaultStats() {
  const store = await transaction();
  const all = await requestResult(store.getAll());
  return {
    total: all.length,
    images: all.filter(a => a.type === 'image').length,
    animations: all.filter(a => a.type === 'animation').length,
    audio: all.filter(a => a.type === 'audio').length,
    data: all.filter(a => a.type === 'data').length,
    other: all.filter(a => !['image', 'animation', 'audio', 'data'].includes(a.type)).length,
    bytes: all.reduce((sum, a) => sum + Number(a.size || 0), 0)
  };
}

export function classifyFile(file) {
  const name = file?.name?.toLowerCase() || '';
  const mime = file?.type || '';
  if (mime.startsWith('image/') || /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(name)) return 'image';
  if (mime.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|flac)$/i.test(name)) return 'audio';
  if (/\.(json|xml|csv|txt|md)$/i.test(name) || mime.includes('json') || mime.startsWith('text/')) return 'data';
  if (/\.(gif|webm|mp4|mov)$/i.test(name) || mime.startsWith('video/')) return 'animation';
  return 'binary';
}

function stripBlob(asset) {
  const { blob, ...metadata } = asset;
  return metadata;
}
