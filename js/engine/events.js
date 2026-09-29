export const nightmareEvents = {
  crushWalls: { id: 'crush-walls', type: 'architecture', futureEnvironment: 'carnival' },
  twistCorridor: { id: 'twist-corridor', type: 'architecture', futureEnvironment: 'carnival' },
  flickerReveal: { id: 'flicker-reveal', type: 'lighting', futureEnvironment: 'carnival' }
};

export function createWorldEvent(type, payload = {}) {
  return { type, payload, timestamp: performance.now() };
}
