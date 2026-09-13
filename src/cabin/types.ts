export type CabinId = "terminator" | "dojo" | "fraya" | "birkdale" | "udpatio";
export type RoofStyle = "pent" | "apex" | "reverse-apex";
export type DoorStyle = "french" | "half-glazed" | "solid";

export interface CabinOpening {
  type: "window" | "door";
  wall: "front" | "left" | "right";
  /** Centre along X for front/right, or along Z for left/right walls. */
  x: number;
  outerW: number;
  outerH: number;
  sill: number;
}

export interface CabinSpec {
  id: CabinId;
  brand: string;
  name: string;
  sizeLabel: string;
  url: string;
  note: string;
  externalWidth: number;
  externalDepth: number;
  internalWidth: number;
  internalDepth: number;
  wallThickness: number;
  floorThickness: number;
  roofThickness: number;
  ridgeHeight: number;
  eavesFront: number;
  eavesBack: number;
  roofOverhangFront: number;
  roofOverhangSides: number;
  roofOverhangBack: number;
  logCourse: number;
  platformDepth: number;
  cladding: "horizontal" | "vertical" | "metal";
  frame: "upvc" | "timber";
  fascia: boolean;
  roofStyle: RoofStyle;
  doorStyle: DoorStyle;
  openings: CabinOpening[];
}

export interface RoomBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export function roomBounds(cabin: CabinSpec): RoomBounds {
  return {
    minX: -cabin.internalWidth / 2,
    maxX: cabin.internalWidth / 2,
    minZ: -cabin.internalDepth / 2,
    maxZ: cabin.internalDepth / 2,
  };
}

export function isApexRoof(cabin: CabinSpec): boolean {
  return cabin.roofStyle === "apex" || cabin.roofStyle === "reverse-apex";
}

export function ceilingAt(z: number, cabin: CabinSpec, _x = 0): number {
  const room = roomBounds(cabin);
  if (isApexRoof(cabin)) {
    const midZ = (room.minZ + room.maxZ) / 2;
    const half = cabin.internalDepth / 2;
    const t = half <= 0 ? 0 : Math.min(1, Math.abs(z - midZ) / half);
    return cabin.ridgeHeight - t * (cabin.ridgeHeight - cabin.eavesFront);
  }
  const t = (z - room.minZ) / cabin.internalDepth;
  return cabin.eavesBack + t * (cabin.eavesFront - cabin.eavesBack);
}
