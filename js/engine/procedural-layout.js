const DIRECTIONS = [
  { x: 1, z: 0, name: 'east' },
  { x: -1, z: 0, name: 'west' },
  { x: 0, z: 1, name: 'south' },
  { x: 0, z: -1, name: 'north' }
];

export const ROOM_ARCHETYPES = [
  { type: 'grand-hall', size: 'large', weight: 1 },
  { type: 'gallery', size: 'large', weight: 1 },
  { type: 'dining-hall', size: 'large', weight: 1 },
  { type: 'library', size: 'medium', weight: 1 },
  { type: 'study', size: 'medium', weight: 1 },
  { type: 'conservatory', size: 'large', weight: 1 },
  { type: 'bedroom', size: 'medium', weight: 1 },
  { type: 'service', size: 'medium', weight: 1 },
  { type: 'storage', size: 'small', weight: 1 },
  { type: 'security', size: 'medium', weight: 1 },
  { type: 'chapel', size: 'large', weight: 1 },
  { type: 'machine-room', size: 'large', weight: 1 }
];

const DRESSING_BY_ZONE = {
  formal: ['empty', 'covered-furniture', 'broken-frames', 'dust'],
  private: ['empty', 'dust', 'covered-furniture'],
  service: ['empty', 'old-equipment', 'water-damage'],
  utility: ['empty', 'old-equipment', 'surveillance']
};

export function createLayout(seed = Date.now(), options = {}) {
  const random = mulberry32(Number(seed) || 1);
  const wings = clampInt(options.wings, 2, 3, 3);
  const roomsPerWing = clampInt(options.roomsPerWing, 4, 7, 5);
  const nodes = [];
  const edges = [];
  const occupied = new Set();
  const edgeKeys = new Set();
  const key = (x, z) => `${x},${z}`;

  const addNode = (x, z, archetype, wing, depth, zone, fixed = false) => {
    const k = key(x, z);
    if (occupied.has(k)) return null;
    occupied.add(k);
    const module = ROOM_ARCHETYPES.find(r => r.type === archetype) || ROOM_ARCHETYPES[0];
    const dressingPool = DRESSING_BY_ZONE[zone] || DRESSING_BY_ZONE.formal;
    return nodes[nodes.push({
      id: `room-${nodes.length}`,
      x, z, type: archetype, archetype, size: module.size, wing, depth, zone,
      variant: Math.floor(random() * 12),
      dressing: pick(dressingPool, random),
      trap: 'none',
      ceilingVariant: Math.floor(random() * 6),
      textureVariant: Math.floor(random() * 8),
      fixed
    }) - 1];
  };

  const connect = (a, b, kind = 'corridor') => {
    if (!a || !b) return;
    const k = [a.id, b.id].sort().join('|');
    if (edgeKeys.has(k)) return;
    edgeKeys.add(k);
    edges.push({ from: a.id, to: b.id, kind, width: 3.8 });
  };

  // The fixed lobby is the believable front-of-house arrival.
  const lobby = addNode(0, 0, 'lobby', 0, 0, 'formal', true);
  lobby.id = 'lobby';
  lobby.type = 'hub';
  lobby.archetype = 'lobby';
  lobby.dressing = 'lobby';

  const entrance = addNode(2, 0, 'grand-hall', 0, 1, 'formal', true);
  entrance.id = 'mansion-entrance';
  entrance.dressing = 'entry-hall';
  connect(lobby, entrance, 'mansion-entry');

  // A central hall is the organising spine. The three wings are zoned deliberately:
  // east = formal/public, north = private rooms, south = service/back-of-house.
  const plans = [
    { name: 'formal', dir: DIRECTIONS[0], rooms: ['gallery', 'dining-hall', 'library', 'conservatory', 'chapel'] },
    { name: 'private', dir: DIRECTIONS[3], rooms: ['study', 'bedroom', 'bedroom', 'bedroom', 'gallery'] },
    { name: 'service', dir: DIRECTIONS[2], rooms: ['service', 'storage', 'machine-room', 'security', 'service'] }
  ];

  plans.slice(0, wings).forEach((plan, wingIndex) => {
    const d = plan.dir;
    let previous = entrance;
    let x = entrance.x + d.x * 2;
    let z = entrance.z + d.z * 2;

    for (let depth = 0; depth < Math.min(roomsPerWing, plan.rooms.length); depth += 1) {
      const node = addNode(x, z, plan.rooms[depth], wingIndex + 1, depth + 2, plan.name);
      if (!node) break;
      connect(previous, node, depth === 0 ? 'wing-entry' : 'corridor');
      previous = node;

      // A small number of side rooms create believable secondary circulation.
      // They are placed on the outside of the wing, never between the main hall and destination.
      if (depth > 0 && depth < roomsPerWing - 1 && depth % 2 === 1) {
        const sideDir = d.name === 'east' || d.name === 'west'
          ? (wingIndex % 2 ? DIRECTIONS[2] : DIRECTIONS[3])
          : (wingIndex % 2 ? DIRECTIONS[0] : DIRECTIONS[1]);
        const sideType = plan.name === 'private' ? 'bedroom' : plan.name === 'service' ? 'storage' : 'study';
        const side = addNode(x + sideDir.x * 2, z + sideDir.z * 2, sideType, wingIndex + 1, depth + 2, plan.name);
        if (side) connect(node, side, 'side-room');
      }

      x += d.x * 2;
      z += d.z * 2;
    }
  });

  // One controlled cross-link can form a circuit without producing a random maze.
  const formal = nodes.filter(n => n.zone === 'formal' && n.id !== 'lobby');
  const privateRooms = nodes.filter(n => n.zone === 'private');
  if (formal.length >= 3 && privateRooms.length) {
    const target = privateRooms[0];
    const source = formal[Math.min(2, formal.length - 1)];
    if (Math.abs(source.x - target.x) + Math.abs(source.z - target.z) <= 4) connect(source, target, 'gallery-link');
  }

  const stairs = buildStairs(nodes, random);
  return {
    seed: Number(seed) || 1,
    generatorVersion: '3.0-logical-mansion',
    wings,
    roomsPerWing,
    nodes,
    edges,
    stairs,
    playerSlots: Math.min(8, clampInt(options.maxPlayers, 1, 8, 8)),
    cacheKey: `mansion:${Number(seed) || 1}:v3-logical`
  };
}

function buildStairs(nodes, random) {
  const candidates = nodes.filter(n => n.zone === 'private' || n.zone === 'formal');
  const chosen = shuffle(candidates, random).slice(0, Math.min(2, Math.max(1, Math.floor(candidates.length / 6))));
  return chosen.map((node, i) => ({
    id: `stairs-${i + 1}`, room: node.id,
    direction: i === 0 ? 'up' : 'down', destination: 'unresolved'
  }));
}

function pick(list, random) { return list[Math.floor(random() * list.length)]; }
function shuffle(list, random) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function clampInt(value, min, max, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(min, Math.min(max, Math.floor(n))) : fallback;
}
function mulberry32(seed) {
  return () => {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
