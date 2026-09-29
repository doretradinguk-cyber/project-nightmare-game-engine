export const mansion = {
  id: 'mansion',
  title: 'Mansion',
  atmosphere: 'wet concrete, failing electricity, distant machinery',
  spawn: { x: 0, y: 1.7, z: 8 },
  rooms: [
    { id: 'foyer', name: 'Foyer', size: [10, 4, 8], exits: ['east-hall','front-door'], light: 0.62 },
    { id: 'east-hall', name: 'East Hall', size: [4, 3, 18], exits: ['foyer','study','service-stairs'], light: 0.31 },
    { id: 'study', name: 'Study', size: [7, 3.5, 7], exits: ['east-hall'], light: 0.44 },
    { id: 'service-stairs', name: 'Service Stairs', size: [5, 6, 5], exits: ['east-hall','lower-level'], light: 0.18 },
    { id: 'lower-level', name: 'Lower Level', size: [14, 3.5, 12], exits: ['service-stairs','security-room'], light: 0.09 },
    { id: 'security-room', name: 'Security Room', size: [8, 3, 6], exits: ['lower-level'], light: 0.23 }
  ],
  systems: {
    surveillance: true,
    adaptiveArchitecture: true,
    predictiveFeeds: true,
    jesterManifestation: true
  }
};

export function getRoom(id) {
  return mansion.rooms.find(room => room.id === id) || null;
}
