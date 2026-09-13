import { FURNITURE } from "../config";
import type { Materials } from "../scene/materials";
import { createWasher, createDryer } from "./appliances";
import { createLBar, createLogBar } from "./bar";
import { createBarware, type BarwareKind } from "./barware";
import { createAddisShelf, createShelf, createWallShelf, type ShelfSize } from "./shelf";
import { createSofaBed } from "./sofa-bed";
import type { FurnitureDef } from "./types";

export type AddKind =
  | "bar-l"
  | "bar-log"
  | "shelf-narrow"
  | "shelf-billy"
  | "shelf-wide"
  | "shelf-cube"
  | "shelf-addis"
  | "wall-shelf"
  | "sofa-bed"
  | "washer"
  | "dryer"
  | "bottle-spirit"
  | "bottle-wine"
  | "bottle-beer"
  | "glass-wine"
  | "glass-pint"
  | "glass-tumbler";

export type AddSpec = {
  kind: AddKind;
  group: "Living" | "Bar" | "Shelves" | "Laundry" | "Drinks";
  label: string;
  size: string;
};

function cm(metres: number): string {
  return `${Math.round(metres * 100)}`;
}

const s = FURNITURE.shelves;
const w = FURNITURE.barware;

export const ADD_CATALOG: AddSpec[] = [
  { kind: "sofa-bed", group: "Living", label: "RestNest sofa bed", size: `${cm(FURNITURE.sofaBed.width)} × ${cm(FURNITURE.sofaBed.depth)} × ${cm(FURNITURE.sofaBed.height)} cm` },
  { kind: "bar-l", group: "Bar", label: "L-shaped bar", size: `${cm(FURNITURE.barL.width)} × ${cm(FURNITURE.barL.depth)} × ${cm(FURNITURE.barL.height)} cm` },
  { kind: "bar-log", group: "Bar", label: "Log cabin bar", size: `${cm(FURNITURE.barLog.width)} × ${cm(FURNITURE.barLog.run)} × ${cm(FURNITURE.barLog.height)} cm` },
  { kind: "shelf-narrow", group: "Shelves", label: "Narrow 40", size: `${cm(s.narrow.width)} × ${cm(s.narrow.depth)} × ${cm(s.narrow.height)} cm` },
  { kind: "shelf-billy", group: "Shelves", label: "Bookcase 80", size: `${cm(s.billy.width)} × ${cm(s.billy.depth)} × ${cm(s.billy.height)} cm` },
  { kind: "shelf-wide", group: "Shelves", label: "Low wide 120", size: `${cm(s.wide.width)} × ${cm(s.wide.depth)} × ${cm(s.wide.height)} cm` },
  { kind: "shelf-cube", group: "Shelves", label: "Cube 77", size: `${cm(s.cube.width)} × ${cm(s.cube.depth)} × ${cm(s.cube.height)} cm` },
  { kind: "shelf-addis", group: "Shelves", label: "Addis 4-tier", size: `${cm(FURNITURE.addis.width)} × ${cm(FURNITURE.addis.depth)} × ${cm(FURNITURE.addis.height)} cm` },
  { kind: "wall-shelf", group: "Shelves", label: "Wall shelf", size: `${cm(FURNITURE.wallShelf.width)} × ${cm(FURNITURE.wallShelf.depth)} cm · resize` },
  { kind: "washer", group: "Laundry", label: "Washing machine", size: `${cm(FURNITURE.washer.width)} × ${cm(FURNITURE.washer.depth)} × ${cm(FURNITURE.washer.height)} cm` },
  { kind: "dryer", group: "Laundry", label: "Tumble dryer", size: `${cm(FURNITURE.dryer.width)} × ${cm(FURNITURE.dryer.depth)} × ${cm(FURNITURE.dryer.height)} cm` },
  { kind: "bottle-spirit", group: "Drinks", label: "Spirit bottle", size: `${cm(w.bottleSpirit.height)} cm high` },
  { kind: "bottle-wine", group: "Drinks", label: "Wine bottle", size: `${cm(w.bottleWine.height)} cm high` },
  { kind: "bottle-beer", group: "Drinks", label: "Beer bottle", size: `${cm(w.bottleBeer.height)} cm high` },
  { kind: "glass-wine", group: "Drinks", label: "Wine glass", size: `${cm(w.glassWine.height)} cm high` },
  { kind: "glass-pint", group: "Drinks", label: "Pint glass", size: `${cm(w.glassPint.height)} cm high` },
  { kind: "glass-tumbler", group: "Drinks", label: "Whisky glass", size: `${cm(w.glassTumbler.height)} cm high` },
];

const SHELF_KIND: Record<string, ShelfSize> = {
  "shelf-narrow": "narrow",
  "shelf-billy": "billy",
  "shelf-wide": "wide",
  "shelf-cube": "cube",
};

const WARE_KIND: Record<string, BarwareKind> = {
  "bottle-spirit": "bottleSpirit",
  "bottle-wine": "bottleWine",
  "bottle-beer": "bottleBeer",
  "glass-wine": "glassWine",
  "glass-pint": "glassPint",
  "glass-tumbler": "glassTumbler",
};

export function createAddedItem(kind: AddKind, materials: Materials, id: string, variant = 0): FurnitureDef {
  if (kind === "bar-l") {
    return createLBar(materials, id);
  }
  if (kind === "bar-log") {
    return createLogBar(materials, id);
  }
  if (kind === "wall-shelf") {
    return createWallShelf(materials, id);
  }
  if (kind === "shelf-addis") {
    return createAddisShelf(materials, id);
  }
  if (kind === "sofa-bed") {
    return createSofaBed(materials, id);
  }
  if (kind === "washer") {
    return createWasher(materials, id);
  }
  if (kind === "dryer") {
    return createDryer(materials, id);
  }
  const shelf = SHELF_KIND[kind];
  if (shelf) {
    return createShelf(materials, shelf, id);
  }
  const ware = WARE_KIND[kind];
  if (!ware) {
    throw new Error(`Unknown add kind: ${kind}`);
  }
  return createBarware(materials, ware, id, variant);
}

export function addSpecByKind(kind: AddKind): AddSpec {
  const spec = ADD_CATALOG.find((entry) => entry.kind === kind);
  if (!spec) {
    throw new Error(`Unknown add kind: ${kind}`);
  }
  return spec;
}
