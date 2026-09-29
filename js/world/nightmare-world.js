export const nightmareWorld = {
  activeEnvironment: 'mansion',
  architecture: {
    adaptive: true,
    roomShiftEnabled: true,
    lightingResponseEnabled: true,
    environmentalMemoryEnabled: true
  },
  surveillance: {
    camerasEnabled: true,
    predictiveFramesEnabled: true,
    signalCorruptionEnabled: true
  },
  console: {
    fictionalSystemName: 'NIGHTMARE CONTROL',
    accessLevel: 'DEVELOPMENT'
  },
  entity: {
    id: 'jester',
    phase: 'rain',
    manifestationStages: ['rain','pattern','face','silhouette','displacement','physical']
  }
};

export function setEnvironment(name) {
  nightmareWorld.activeEnvironment = String(name || 'mansion').toLowerCase();
  return nightmareWorld.activeEnvironment;
}
