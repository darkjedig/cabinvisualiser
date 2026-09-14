/**
 * Furniture sizes come from dimensions.txt (real measured pieces).
 * Cabin sizes live in src/cabin/catalog.ts so several buildings can be compared.
 */

export { BIRKDALE, CABINS, cabinById, DOJO, FRAYA, TERMINATOR, UDPATIO } from "./cabin/catalog";
export { ceilingAt, roomBounds } from "./cabin/types";
export type { CabinId, CabinSpec, RoomBounds } from "./cabin/types";

export const FURNITURE = {
  sofa: { width: 2.36, depth: 1.52, height: 0.86, seatHeight: 0.44 },
  sofaBed: {
    width: 1.73,
    depth: 1.0,
    height: 0.85,
    seatHeight: 0.44,
    bedWidth: 1.3,
    bedDepth: 1.96,
  },
  desk: { width: 1.2, depth: 0.6, height: 0.75 },
  kallax: { width: 0.77, height: 0.77, depth: 0.39, count: 2 },
  tv: { width: 1.23, height: 0.71, depth: 0.06 },
  tvUnit: { width: 2.0, depth: 0.35, height: 0.45 },
  gym: { width: 1.02, depth: 1.85, height: 2.08 },
  bar: { width: 1.12, depth: 0.48, height: 1.05 },
  barL: {
    width: 1.8,
    depth: 1.2,
    height: 1.05,
    run: 0.5,
    fridgeW: 0.46,
    widthMin: 1.0,
    widthMax: 2.4,
    widthStep: 0.05,
    depthMin: 0.9,
    depthMax: 1.8,
    depthStep: 0.05,
  },
  barLog: {
    width: 1.6,
    run: 0.6,
    depth: 1.2,
    height: 1.1,
    logCourse: 0.12,
    overhang: 0.07,
    widthMin: 1.2,
    widthMax: 2.2,
    widthStep: 0.05,
    depthMin: 0.9,
    depthMax: 1.5,
    depthStep: 0.05,
  },
  stool: { width: 0.34, depth: 0.34, height: 0.72 },
  chair: { width: 0.62, depth: 0.62, height: 1.12 },
  wallShelf: {
    width: 0.8,
    depth: 0.2,
    height: 0.04,
    widthMin: 0.4,
    widthMax: 1.6,
    widthStep: 0.05,
    depthMin: 0.15,
    depthMax: 0.25,
    depthStep: 0.05,
  },
  shelves: {
    narrow: { width: 0.4, depth: 0.28, height: 1.8, boards: 6 },
    billy: { width: 0.8, depth: 0.28, height: 1.8, boards: 6 },
    wide: { width: 1.2, depth: 0.32, height: 0.8, boards: 3 },
    cube: { width: 0.77, depth: 0.39, height: 0.77, boards: 3 },
  },
  addis: { width: 0.61, depth: 0.3, height: 1.3, boards: 4 },
  washer: { width: 0.6, depth: 0.6, height: 0.85 },
  dryer: { width: 0.6, depth: 0.6, height: 0.85 },
  consoleTable: { width: 53 * 0.0254, depth: 17.5 * 0.0254, height: 31.5 * 0.0254 },
  coffeeTable: { width: 49 * 0.0254, depth: 24.5 * 0.0254, height: 18 * 0.0254 },
  barware: {
    bottleSpirit: { width: 0.09, depth: 0.09, height: 0.32 },
    bottleWine: { width: 0.08, depth: 0.08, height: 0.33 },
    bottleBeer: { width: 0.07, depth: 0.07, height: 0.24 },
    glassWine: { width: 0.09, depth: 0.09, height: 0.21 },
    glassPint: { width: 0.085, depth: 0.085, height: 0.16 },
    glassTumbler: { width: 0.08, depth: 0.08, height: 0.09 },
  },
} as const;
