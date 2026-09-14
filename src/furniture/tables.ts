import * as THREE from "three";
import { FURNITURE } from "../config";
import type { Materials } from "../scene/materials";
import { markFurniture, type FurnitureDef } from "./types";

function box(
  w: number,
  h: number,
  d: number,
  material: THREE.Material,
  x: number,
  y: number,
  z: number,
): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function knob(material: THREE.Material, x: number, y: number, z: number): THREE.Mesh {
  return box(0.022, 0.022, 0.02, material, x, y, z);
}

/**
 * Indian mango-wood sideboard / console — 53 × 17.5 × 31.5 in
 * Three equal drawers over a 2/3 + 1/3 cupboard, square block knobs.
 */
export function createConsoleTable(materials: Materials, id = "console-table", spawned = false): FurnitureDef {
  const { width, depth, height } = FURNITURE.consoleTable;
  const group = new THREE.Group();
  const wood = materials.mango;

  const topT = 0.028;
  const overhang = 0.01;
  const legH = 0.075;
  const leg = 0.048;
  const gap = 0.004;
  const rail = 0.02;
  const carcassH = height - topT - legH;
  const drawerH = carcassH * 0.3;
  const doorH = carcassH - drawerH - gap;
  const innerW = width - rail * 2;
  const drawerW = (innerW - gap * 2) / 3;
  const leftDoorW = drawerW * 2 + gap;
  const rightDoorW = drawerW;
  const faceZ = depth / 2 - 0.006;
  const carcassY = legH + carcassH / 2;

  group.add(box(width, carcassH, depth - 0.01, wood, 0, carcassY, 0));
  group.add(box(width + overhang * 2, topT, depth + overhang * 2, wood, 0, height - topT / 2, 0));

  const drawerY = legH + doorH + gap + drawerH / 2;
  for (let i = 0; i < 3; i += 1) {
    const x = -innerW / 2 + drawerW / 2 + i * (drawerW + gap);
    group.add(box(drawerW - 0.002, drawerH - 0.002, 0.014, wood, x, drawerY, faceZ));
    group.add(knob(wood, x, drawerY, faceZ + 0.016));
  }

  const doorY = legH + doorH / 2;
  const leftX = -innerW / 2 + leftDoorW / 2;
  const rightX = innerW / 2 - rightDoorW / 2;
  group.add(box(leftDoorW - 0.002, doorH - 0.002, 0.014, wood, leftX, doorY, faceZ));
  group.add(box(rightDoorW - 0.002, doorH - 0.002, 0.014, wood, rightX, doorY, faceZ));
  group.add(knob(wood, leftX + leftDoorW / 2 - 0.055, doorY, faceZ + 0.016));
  group.add(knob(wood, rightX - rightDoorW / 2 + 0.055, doorY, faceZ + 0.016));

  const inset = 0.03;
  for (const [fx, fz] of [
    [-width / 2 + inset, -depth / 2 + inset],
    [width / 2 - inset, -depth / 2 + inset],
    [-width / 2 + inset, depth / 2 - inset],
    [width / 2 - inset, depth / 2 - inset],
  ] as const) {
    group.add(box(leg, legH, leg, wood, fx, legH / 2, fz));
  }

  return markFurniture(group, {
    id,
    name: "Mango console",
    width,
    depth,
    height,
    spawned,
  });
}

/**
 * Matching Indian mango-wood coffee table — 49 × 24.5 × 18 in
 * Slab top, square legs, two drawers, lower shelf.
 */
export function createCoffeeTable(materials: Materials, id = "coffee-table", spawned = false): FurnitureDef {
  const { width, depth, height } = FURNITURE.coffeeTable;
  const group = new THREE.Group();
  const wood = materials.mango;

  const topT = 0.032;
  const overhang = 0.018;
  const leg = 0.055;
  const apronH = 0.11;
  const gap = 0.004;
  const shelfT = 0.022;
  const shelfY = 0.13;
  const drawerH = apronH - 0.02;
  const drawerW = (width - leg * 2 - gap * 3) / 2;
  const faceZ = depth / 2 - 0.008;
  const apronY = height - topT - apronH / 2;

  group.add(box(width + overhang * 2, topT, depth + overhang * 2, wood, 0, height - topT / 2, 0));
  group.add(box(width - 0.02, apronH, depth - 0.02, wood, 0, apronY, 0));
  group.add(box(width - leg * 1.4, shelfT, depth - 0.08, wood, 0, shelfY, 0));

  const drawerY = height - topT - 0.012 - drawerH / 2;
  for (const side of [-1, 1]) {
    const x = side * (drawerW / 2 + gap / 2);
    group.add(box(drawerW, drawerH, 0.014, wood, x, drawerY, faceZ));
    group.add(knob(wood, x, drawerY, faceZ + 0.016));
  }

  const insetX = width / 2 - leg / 2;
  const insetZ = depth / 2 - leg / 2;
  for (const [fx, fz] of [
    [-insetX, -insetZ],
    [insetX, -insetZ],
    [-insetX, insetZ],
    [insetX, insetZ],
  ] as const) {
    group.add(box(leg, height - topT, leg, wood, fx, (height - topT) / 2, fz));
  }

  return markFurniture(group, {
    id,
    name: "Mango coffee table",
    width,
    depth,
    height,
    spawned,
  });
}
