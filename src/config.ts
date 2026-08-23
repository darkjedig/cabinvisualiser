/**
 * Dunster House Terminator Pent Log Cabin — W5.0m × D4.0m
 * https://dunsterhouse.co.uk/log-cabins/pent/terminator-log-cabin-w5-0m-x-d4-0m
 *
 * Furniture sizes come from dimensions.txt (real measured pieces).
 */

export const CABIN = {
  externalWidth: 4.99,
  externalDepth: 3.99,
  internalWidth: 4.77,
  internalDepth: 3.77,
  wallThickness: 0.045,
  floorThickness: 0.019,
  roofThickness: 0.019,
  ridgeHeight: 2.49,
  eavesFrontBoards: 2.3,
  eavesBackBoards: 1.9,
  eavesFrontPurlins: 2.16,
  eavesBackPurlins: 1.76,
  doorWalkWidth: 1.11,
  doorWalkHeight: 1.82,
  windowOpenWidth: 0.44,
  windowOpenHeight: 1.37,
  roofOverhangFront: 0.36,
  roofOverhangSides: 0.12,
  roofOverhangBack: 0.12,
  logCourse: 0.145,
} as const;

export const FURNITURE = {
  sofa: { width: 2.36, depth: 1.52, height: 0.86, seatHeight: 0.44 },
  desk: { width: 1.2, depth: 0.6, height: 0.75 },
  kallax: { width: 0.77, height: 0.77, depth: 0.39, count: 2 },
  tv: { width: 1.23, height: 0.71, depth: 0.06 },
  tvUnit: { width: 2.0, depth: 0.35, height: 0.45 },
  gym: { width: 1.02, depth: 1.85, height: 2.08 },
  bar: { width: 1.12, depth: 0.48, height: 1.05 },
  stool: { width: 0.34, depth: 0.34, height: 0.72 },
  chair: { width: 0.62, depth: 0.62, height: 1.12 },
} as const;

export const ROOM = {
  minX: -CABIN.internalWidth / 2,
  maxX: CABIN.internalWidth / 2,
  minZ: -CABIN.internalDepth / 2,
  maxZ: CABIN.internalDepth / 2,
} as const;

/** Ceiling height under roof boards at a given world Z. Front is +Z. */
export function ceilingAt(z: number): number {
  const t = (z - ROOM.minZ) / CABIN.internalDepth;
  return CABIN.eavesBackBoards + t * (CABIN.eavesFrontBoards - CABIN.eavesBackBoards);
}
