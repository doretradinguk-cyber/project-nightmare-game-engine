const cameras = new Map();

export function registerCamera(id, state = {}) {
  cameras.set(id, {
    id,
    room: state.room || 'UNKNOWN',
    status: state.status || 'ONLINE',
    signal: Number.isFinite(state.signal) ? state.signal : 100,
    motion: Boolean(state.motion),
    lastEvent: state.lastEvent || null
  });
  return cameras.get(id);
}

export function getCamera(id) {
  return cameras.get(id) || null;
}

export function listCameras() {
  return [...cameras.values()];
}

export function setCameraState(id, patch = {}) {
  const current = cameras.get(id);
  if (!current) return null;
  const next = {...current, ...patch};
  next.signal = Math.max(0, Math.min(100, Number(next.signal)));
  cameras.set(id, next);
  return next;
}
