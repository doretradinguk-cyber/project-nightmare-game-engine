export const multiplayerState = {
  maxPlayers: 8,
  connectedPlayers: new Map(),
  mode: 'co-op'
};

export function configureMultiplayer(mode = 'co-op', maxPlayers = 8) {
  multiplayerState.mode = String(mode);
  multiplayerState.maxPlayers = Math.max(1, Math.min(8, Number(maxPlayers) || 8));
  return multiplayerState;
}

export function registerPlayer(id, metadata = {}) {
  if (multiplayerState.connectedPlayers.size >= multiplayerState.maxPlayers) return null;
  const player = { id, name: metadata.name || `PLAYER ${multiplayerState.connectedPlayers.size + 1}`, spawn: metadata.spawn || null };
  multiplayerState.connectedPlayers.set(id, player);
  return player;
}

export function unregisterPlayer(id) {
  multiplayerState.connectedPlayers.delete(id);
}

export function getPlayerCount() {
  return multiplayerState.connectedPlayers.size;
}
