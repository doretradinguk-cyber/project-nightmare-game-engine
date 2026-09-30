const DIRECTIONS = [
  { x: 1, z: 0, name: 'east' },
  { x: -1, z: 0, name: 'west' },
  { x: 0, z: 1, name: 'south' },
  { x: 0, z: -1, name: 'north' }
];

/*
 * PROJECT NIGHTMARE — MANSION GENERATOR
 *
 * The lobby is the fixed anchor.
 * Everything beyond it is a seeded recombination of reusable room modules.
 * Think D12 outcomes, not twelve rooms: each archetype has variants, dressing,
 * traps, connectors and possible wing/vertical relationships.
 */
export const ROOM_ARCHETYPES = [
  { type: 'grand-hall', size: 'large', weight: 8 },
  { type: 'gallery', size: 'large', weight: 7 },
  { type: 'dining-hall', size: 'large', weight: 6 },
  { type: 'library', size: 'medium', weight: 6 },
  { type: 'study', size: 'medium', weight: 6 },
  { type: 'conservatory', size: 'large', weight: 5 },
  { type: 'bedroom', size: 'medium', weight: 7 },
  { type: 'service', size: 'medium', weight: 7 },
  { type: 'storage', size: 'small', weight: 8 },
  { type: 'security', size: 'medium', weight: 5 },
  { type: 'chapel', size: 'large', weight: 4 },
  { type: 'machine-room', size: 'large', weight: 4 }
];

const TRAPS = [
  'pressure-floor',
  'false-door',
  'collapsing-corridor',
  'tripwire',
  'dark-room',
  'moving-wall',
  'none'
];

const DRESSING = [
  'dust',
  'covered-furniture',
  'broken-frames',
  'dead-plants',
  'old-equipment',
  'water-damage',
  'surveillance',
  'empty'
];

export function createLayout(seed = Date.now(), options = {}) {
  const random = mulberry32(Number(seed) || 1);
  const wings = clampInt(options.wings, 2, 5, 3);
  const roomsPerWing = clampInt(options.roomsPerWing, 4, 9, 6);
  const nodes = [];
  const edges = [];
  const occupied = new Set();
  const key = (x, z) => `${x},${z}`;

  // Fixed lobby: its identity and position never change.
  const lobby = {
    id: 'lobby',
    x: 0,
    z: 0,
    type: 'hub',
    archetype: 'lobby',
    wing: 0,
    variant: 0,
    dressing: 'lobby',
    trap: 'none',
    fixed: true
  };
  nodes.push(lobby);
  occupied.add(key(0, 0));

  const addNode = (x, z, archetype, wing, depth) => {
    const k = key(x, z);
    if (occupied.has(k)) return null;
    occupied.add(k);

    const module = ROOM_ARCHETYPES.find(r => r.type === archetype) || ROOM_ARCHETYPES[0];
    const node = {
      id: `room-${nodes.length}`,
      x, z,
      type: archetype,
      archetype,
      size: module.size,
      wing,
      depth,
      variant: Math.floor(random() * 12),
      dressing: pick(DRESSING, random),
      trap: random() < 0.34 ? pick(TRAPS, random) : 'none',
      ceilingVariant: Math.floor(random() * 6),
      textureVariant: Math.floor(random() * 8)
    };
    nodes.push(node);
    return node;
  };

  // Give each wing a different architectural personality.
  const wingAngles = shuffledDirections(random).slice(0, wings);

  wingAngles.forEach((dirIndex, wingIndex) => {
    const d = DIRECTIONS[dirIndex];
    let x = d.x * 2;
    let z = d.z * 2;
    let previous = lobby;

    for (let depth = 0; depth < roomsPerWing; depth += 1) {
      const archetype = depth === roomsPerWing - 1
        ? pickDestination(random)
        : weightedArchetype(random);

      const node = addNode(x, z, archetype, wingIndex + 1, depth + 1);
      if (!node) {
        x += d.x * 2;
        z += d.z * 2;
        continue;
      }

      edges.push({
        from: previous.id,
        to: node.id,
        kind: depth === 0 ? 'wing-entry' : 'corridor',
        width: node.size === 'small' ? 2.6 : 3.2
      });
      previous = node;

      // Secondary rooms make wings branch instead of becoming straight hallways.
      if (depth > 0 && random() > 0.38) {
        const side = DIRECTIONS[(dirIndex + (random() > 0.5 ? 1 : 3)) % 4];
        const branchDepth = depth;
        const branch = addNode(
          x + side.x * 2,
          z + side.z * 2,
          weightedArchetype(random),
          wingIndex + 1,
          branchDepth
        );
        if (branch) {
          edges.push({
            from: node.id,
            to: branch.id,
            kind: 'side-room',
            width: branch.size === 'small' ? 2.4 : 2.9
          });
        }
      }

      x += d.x * 2;
      z += d.z * 2;
    }
  });

  // Loops prevent the mansion feeling like a set of corridors with dead ends.
  const candidates = nodes.filter(n => n.id !== 'lobby');
  for (let i = 0; i < candidates.length - 2; i += 1) {
    if (random() < 0.16) {
      edges.push({
        from: candidates[i].id,
        to: candidates[i + 2].id,
        kind: 'loop',
        width: 2.8
      });
    }
  }

  // Vertical transitions are deliberately sparse: finding stairs should matter.
  const stairs = buildStairs(nodes, random);

  return {
    seed: Number(seed) || 1,
    generatorVersion: '2.0-d12-mansion',
    wings,
    roomsPerWing,
    nodes,
    edges,
    stairs,
    playerSlots: Math.min(8, clampInt(options.maxPlayers, 1, 8, 8)),
    cacheKey: `mansion:${Number(seed) || 1}:v2`
  };
}

function buildStairs(nodes, random) {
  const candidates = nodes.filter(n => n.id !== 'lobby' && n.depth > 1);
  const count = Math.min(5, Math.max(1, Math.floor(candidates.length / 5)));
  const chosen = shuffle(candidates, random).slice(0, count);

  return chosen.map((node, i) => ({
    id: `stairs-${i + 1}`,
    room: node.id,
    direction: random() > 0.5 ? 'up' : 'down',
    destination: 'unresolved'
  }));
}

function weightedArchetype(random) {
  const total = ROOM_ARCHETYPES.reduce((sum, r) => sum + r.weight, 0);
  let roll = random() * total;
  for (const room of ROOM_ARCHETYPES) {
    roll -= room.weight;
    if (roll <= 0) return room.type;
  }
  return ROOM_ARCHETYPES[0].type;
}

function pickDestination(random) {
  return pick(['grand-hall', 'gallery', 'chapel', 'machine-room', 'library'], random);
}

function pick(list, random) {
  return list[Math.floor(random() * list.length)];
}

function shuffledDirections(random) {
  return shuffle(DIRECTIONS.map((_, i) => i), random);
}

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
