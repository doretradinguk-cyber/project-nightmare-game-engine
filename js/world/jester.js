export const jesterState = {
  phase: 'rain',
  visible: false,
  signal: 0,
  lastSeen: null
};

export function setJesterPhase(phase) {
  const phases = ['rain','pattern','face','silhouette','displacement','physical'];
  if (!phases.includes(phase)) return jesterState.phase;
  jesterState.phase = phase;
  jesterState.visible = phase !== 'rain';
  jesterState.signal = phases.indexOf(phase) / (phases.length - 1);
  jesterState.lastSeen = new Date().toISOString();
  return jesterState;
}
