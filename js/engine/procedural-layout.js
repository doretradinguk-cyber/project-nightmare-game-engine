const DIRECTIONS = [
  { x: 1, z: 0, name: 'east' },
  { x: -1, z: 0, name: 'west' },
  { x: 0, z: 1, name: 'south' },
  { x: 0, z: -1, name: 'north' }
];

export function createLayout(seed = Date.now(), options = {}) {
  const random = mulberry32(Number(seed) || 1);
  const wings = clampInt(options.wings, 2, 5, 3);
  const roomsPerWing = clampInt(options.roomsPerWing, 3, 7, 4);
  const nodes = [];
  const edges = [];
  const occupied = new Set();
  const key = (x, z) => `${x},${z}`;
  const addNode = (x, z, type, wing) => {
    const k = key(x, z);
    if (occupied.has(k)) return null;
    occupied.add(k);
    const node = { id: `room-${nodes.length + 1}`, x, z, type, wing };
    nodes.push(node);
    return node;
  };

  addNode(0, 0, 'hub', 0);
  const wingAngles = Array.from({ length: wings }, (_, i) => Math.round((i / wings) * 4));

  wingAngles.forEach((dirIndex, wing) => {
    const d = DIRECTIONS[dirIndex % DIRECTIONS.length];
    let x = d.x * 2;
    let z = d.z * 2;
    let previous = nodes[0];

    for (let i = 0; i < roomsPerWing; i += 1) {
      const type = i === roomsPerWing - 1 ? 'destination' : pickType(random, i);
      const node = addNode(x, z, type, wing + 1);
      if (!node) continue;
      edges.push({ from: previous.id, to: node.id, kind: 'corridor' });
      previous = node;

      if (i > 0 && random() > 0.45) {
        const side = DIRECTIONS[(dirIndex + (random() > 0.5 ? 1 : 3)) % 4];
        const branch = addNode(x + side.x * 2, z + side.z * 2, pickType(random, i), wing + 1);
        if (branch) edges.push({ from: node.id, to: branch.id, kind: 'side-room' });
      }

      x += d.x * 2;
      z += d.z * 2;
    }
  });

  const candidates = nodes.filter(n => n.type !== 'hub');
  for (let i = 0; i < candidates.length - 1; i += 1) {
    if (random() < 0.22) edges.push({ from: candidates[i].id, to: candidates[i + 1].id, kind: 'loop' });
  }

  return {
    seed: Number(seed) || 1,
    wings,
    nodes,
    edges,
    stairs: buildStairs(nodes, random),
    playerSlots: Math.min(8, clampInt(options.maxPlayers, 1, 8, 8))
  };
}

function buildStairs(nodes, random) {
  return nodes.filter((node, i) => i > 0 && random() > 0.72)
    .slice(0, 3)
    .map((node, i) => ({ id: `stairs-${i + 1}`, room: node.id, direction: random() > 0.5 ? 'up' : 'down' }));
}

function pickType(random, depth) {
  const types = depth === 0 ? ['hall', 'room', 'gallery'] : ['room', 'storage', 'study', 'gallery', 'hall'];
  return types[Math.floor(random() * types.length)];
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
