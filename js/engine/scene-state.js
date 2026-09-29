export const sceneState = {
  environment: 'mansion',
  room: 'foyer',
  power: 0.68,
  alarm: false,
  doorStates: {},
  observedEvents: [],
  jesterPhase: 'rain'
};

export function enterRoom(roomId) {
  sceneState.room = roomId;
  return sceneState.room;
}

export function setPower(value) {
  sceneState.power = Math.max(0, Math.min(1, Number(value)));
  return sceneState.power;
}

export function setDoor(id, open) {
  sceneState.doorStates[id] = Boolean(open);
  return sceneState.doorStates[id];
}

export function recordEvent(event) {
  sceneState.observedEvents.push({
    ...event,
    timestamp: new Date().toISOString()
  });
  if (sceneState.observedEvents.length > 100) sceneState.observedEvents.shift();
}
