import type { CabinSpec } from "./types";

/**
 * Dunster House Terminator pent — W5.0m × D4.0m
 * https://dunsterhouse.co.uk/log-cabins/pent/terminator-log-cabin-w5-0m-x-d4-0m
 */
export const TERMINATOR: CabinSpec = {
  id: "terminator",
  brand: "Dunster House",
  name: "Terminator",
  sizeLabel: "5.0 × 4.0 m",
  url: "https://dunsterhouse.co.uk/log-cabins/pent/terminator-log-cabin-w5-0m-x-d4-0m",
  note: "Pent roof slopes down to the back wall. The Marcy gym is 208 cm tall — it only clears the ceiling in the front half of this cabin.",
  externalWidth: 4.99,
  externalDepth: 3.99,
  internalWidth: 4.77,
  internalDepth: 3.77,
  wallThickness: 0.045,
  floorThickness: 0.019,
  roofThickness: 0.019,
  ridgeHeight: 2.49,
  eavesFront: 2.3,
  eavesBack: 1.9,
  roofOverhangFront: 0.36,
  roofOverhangSides: 0.12,
  roofOverhangBack: 0.12,
  logCourse: 0.145,
  platformDepth: 0,
  cladding: "horizontal",
  frame: "upvc",
  fascia: false,
  roofStyle: "pent",
  doorStyle: "french",
  openings: [
    { type: "window", wall: "front", x: -1.78, outerW: 0.58, outerH: 1.86, sill: 0.42 },
    { type: "door", wall: "front", x: -0.48, outerW: 1.28, outerH: 2.02, sill: 0 },
    { type: "window", wall: "front", x: 0.62, outerW: 0.58, outerH: 1.86, sill: 0.42 },
    { type: "window", wall: "front", x: 1.72, outerW: 0.58, outerH: 1.86, sill: 0.42 },
  ],
};

/**
 * BillyOh Dojo E insulated — 18×10 ft
 * https://www.gardenbuildingsdirect.co.uk/log-cabins/dojo-insulated/38386
 */
export const DOJO: CabinSpec = {
  id: "dojo",
  brand: "BillyOh",
  name: "Dojo E Insulated",
  sizeLabel: "18 × 10 ft",
  url: "https://www.gardenbuildingsdirect.co.uk/log-cabins/dojo-insulated/38386",
  note: "Insulated garden room with floor-to-ceiling glass wrapping the front-left corner, a solid right-hand wall, and a raised front deck. Internal floor is 5.19 × 2.92 m — only 10 ft deep.",
  externalWidth: 5.35,
  externalDepth: 3.06,
  internalWidth: 5.19,
  internalDepth: 2.92,
  wallThickness: 0.08,
  floorThickness: 0.019,
  roofThickness: 0.011,
  ridgeHeight: 2.49,
  eavesFront: 2.49,
  eavesBack: 2.19,
  roofOverhangFront: 0.42,
  roofOverhangSides: 0.1,
  roofOverhangBack: 0.1,
  logCourse: 0.145,
  platformDepth: 1.05,
  cladding: "vertical",
  frame: "timber",
  fascia: true,
  roofStyle: "pent",
  doorStyle: "french",
  openings: [
    { type: "window", wall: "front", x: -2.06, outerW: 0.9, outerH: 2.18, sill: 0.05 },
    { type: "door", wall: "front", x: -0.68, outerW: 1.7, outerH: 2.2, sill: 0 },
    { type: "window", wall: "front", x: 0.7, outerW: 0.9, outerH: 2.18, sill: 0.05 },
    { type: "window", wall: "left", x: 1.02, outerW: 0.9, outerH: 2.18, sill: 0.05 },
    { type: "window", wall: "left", x: 0.06, outerW: 0.9, outerH: 2.18, sill: 0.05 },
  ],
};

/**
 * BillyOh Fraya pent — W5.0m × D4.0m (44mm)
 * https://www.gardenbuildingsdirect.co.uk/log-cabins/fraya/30248
 */
export const FRAYA: CabinSpec = {
  id: "fraya",
  brand: "BillyOh",
  name: "Fraya Pent",
  sizeLabel: "5.0 × 4.0 m",
  url: "https://www.gardenbuildingsdirect.co.uk/log-cabins/fraya/30248",
  note: "Pent roof with a 41 cm front overhang, central extra-high double doors and two opening windows. Back eaves are 2.07 m, so the 208 cm gym needs to sit toward the glazed front.",
  externalWidth: 5.11,
  externalDepth: 4.21,
  internalWidth: 4.81,
  internalDepth: 3.61,
  wallThickness: 0.044,
  floorThickness: 0.011,
  roofThickness: 0.011,
  ridgeHeight: 2.33,
  eavesFront: 2.33,
  eavesBack: 2.07,
  roofOverhangFront: 0.414,
  roofOverhangSides: 0.12,
  roofOverhangBack: 0.12,
  logCourse: 0.145,
  platformDepth: 0,
  cladding: "horizontal",
  frame: "upvc",
  fascia: false,
  roofStyle: "pent",
  doorStyle: "french",
  openings: [
    { type: "window", wall: "front", x: -1.62, outerW: 0.78, outerH: 1.45, sill: 0.48 },
    { type: "door", wall: "front", x: 0, outerW: 1.72, outerH: 2.0, sill: 0 },
    { type: "window", wall: "front", x: 1.62, outerW: 0.78, outerH: 1.45, sill: 0.48 },
  ],
};

/**
 * Redlands 20' × 10' Birkdale log cabin — 44mm reverse apex
 * https://www.sheds.co.uk/redlands-20-x-10-birkdale-log-cabin-44mm.html
 */
export const BIRKDALE: CabinSpec = {
  id: "birkdale",
  brand: "Redlands",
  name: "Birkdale",
  sizeLabel: "20 × 10 ft",
  url: "https://www.sheds.co.uk/redlands-20-x-10-birkdale-log-cabin-44mm.html",
  note: "Reverse-apex 44mm log cabin. Internal floor is 5.67 × 2.67 m — wider than the others but only 8'9\" deep. Eaves 2.19 m, so the 208 cm gym clears, but walking space behind it is tight.",
  externalWidth: 5.76,
  externalDepth: 2.76,
  internalWidth: 5.672,
  internalDepth: 2.672,
  wallThickness: 0.044,
  floorThickness: 0.019,
  roofThickness: 0.019,
  ridgeHeight: 2.47,
  eavesFront: 2.189,
  eavesBack: 2.189,
  roofOverhangFront: 0.12,
  roofOverhangSides: 0.095,
  roofOverhangBack: 0.07,
  logCourse: 0.145,
  platformDepth: 0,
  cladding: "horizontal",
  frame: "timber",
  fascia: false,
  roofStyle: "reverse-apex",
  doorStyle: "half-glazed",
  openings: [
    { type: "window", wall: "front", x: -1.58, outerW: 0.82, outerH: 1.88, sill: 0.08 },
    { type: "door", wall: "front", x: 0, outerW: 1.52, outerH: 1.88, sill: 0 },
    { type: "window", wall: "front", x: 1.58, outerW: 0.82, outerH: 1.88, sill: 0.08 },
    { type: "window", wall: "left", x: 0.82, outerW: 0.82, outerH: 1.88, sill: 0.08 },
  ],
};

/**
 * UDPATIO 8×8 ft galvanized steel apex storage shed
 * https://www.amazon.co.uk/dp/B0DFW4CCZJ
 * From the product dimension image:
 *   Front face: 250 cm roof overhang width, 235 cm base width
 *   Side face:  248 cm roof overhang depth, 235 cm base depth
 *   Ridge height: 194 cm, eaves height: 168 cm
 *   Door: 120 × 165 cm double-door
 *   59.41 sq ft floor (≈ 5.52 m²)
 */
export const UDPATIO: CabinSpec = {
  id: "udpatio",
  brand: "UDPATIO",
  name: "8×8 Metal Shed",
  sizeLabel: "8 × 8 ft",
  url: "https://www.amazon.co.uk/dp/B0DFW4CCZJ",
  note: "Galvanized steel apex shed. Internal floor is only 2.28 × 2.28 m and the ridge is 1.94 m — the 208 cm gym does not fit.",
  externalWidth: 2.50,
  externalDepth: 2.48,
  internalWidth: 2.28,
  internalDepth: 2.28,
  wallThickness: 0.035,
  floorThickness: 0.012,
  roofThickness: 0.008,
  ridgeHeight: 1.94,
  eavesFront: 1.68,
  eavesBack: 1.68,
  roofOverhangFront: 0.075,
  roofOverhangSides: 0.065,
  roofOverhangBack: 0.075,
  logCourse: 0.145,
  platformDepth: 0,
  cladding: "metal",
  frame: "upvc",
  fascia: false,
  roofStyle: "apex",
  doorStyle: "solid",
  openings: [
    { type: "door", wall: "front", x: 0, outerW: 1.20, outerH: 1.65, sill: 0 },
  ],
};

export const CABINS: CabinSpec[] = [TERMINATOR, DOJO, FRAYA, BIRKDALE, UDPATIO];

export function cabinById(id: string): CabinSpec {
  return CABINS.find((cabin) => cabin.id === id) ?? TERMINATOR;
}
