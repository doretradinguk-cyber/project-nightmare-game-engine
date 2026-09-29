const DEFAULT_CATALOG = './data/assets/asset-catalog.json';

export class NightmareContentManager {
  constructor({ catalogUrl = DEFAULT_CATALOG, baseUrl = './' } = {}) {
    this.catalogUrl = catalogUrl;
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    this.catalog = null;
    this.packs = new Map();
    this.assets = new Map();
    this.mounted = new Map();
    this.catalogBaseUrl = null;
  }

  async initialise() {
    const response = await fetch(this.catalogUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Content catalog failed: ${response.status}`);
    this.catalog = await response.json();
    this.catalogBaseUrl = new URL(this.catalogUrl, new URL(this.baseUrl, window.location.href));
    for (const entry of this.catalog.packs ?? []) this.packs.set(entry.id, entry);
    return this;
  }

  async mountPack(packId, { rootUrl } = {}) {
    const entry = this.packs.get(packId);
    if (!entry) throw new Error(`Unknown content pack: ${packId}`);

    const manifestUrl = new URL(entry.manifest, this.catalogBaseUrl).href;
    const response = await fetch(manifestUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Pack manifest failed: ${packId}`);
    const manifest = await response.json();

    for (const dependency of manifest.dependencies ?? []) {
      if (!this.mounted.has(dependency)) await this.mountPack(dependency);
    }

    const packRoot = rootUrl ?? new URL(manifestUrl.substring(0, manifestUrl.lastIndexOf('/') + 1), window.location.href).href;
    this.mounted.set(packId, { manifest, rootUrl: packRoot });

    for (const asset of manifest.assets ?? []) {
      if (!asset.redistributable) continue;
      this.assets.set(asset.id, { ...asset, packId, url: new URL(asset.path, packRoot).href });
    }
    return manifest;
  }

  hasPack(packId) { return this.mounted.has(packId); }
  hasAsset(assetId) { return this.assets.has(assetId); }

  resolveAsset(assetId) {
    const asset = this.assets.get(assetId);
    if (!asset) throw new Error(`Asset is not mounted: ${assetId}`);
    return asset;
  }

  resolveUrl(assetId) { return this.resolveAsset(assetId).url; }
  listPacks() { return [...this.packs.values()]; }
  listMountedPacks() {
    return [...this.mounted.entries()].map(([id, value]) => ({ id, version: value.manifest.version }));
  }
}
