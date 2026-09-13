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

function applianceShell(
  group: THREE.Group,
  materials: Materials,
  width: number,
  depth: number,
  height: number,
  doorOffset: number,
): void {
  const body = materials.applianceWhite;
  group.add(box(width, height - 0.06, depth - 0.04, body, 0, (height - 0.06) / 2 + 0.03, -0.01));
  group.add(box(width, 0.06, depth, body, 0, height - 0.03, 0));
  group.add(box(width - 0.04, 0.08, 0.04, materials.metal, 0, height - 0.07, depth / 2 - 0.01));

  const door = box(width - 0.06, height - 0.22, 0.04, body, 0, (height - 0.22) / 2 + 0.04, depth / 2 - 0.01);
  group.add(door);

  const glass = new THREE.Mesh(new THREE.CircleGeometry(0.16, 28), materials.glass);
  glass.position.set(doorOffset, 0.42, depth / 2 + 0.012);
  group.add(glass);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.165, 0.018, 10, 28), materials.metal);
  ring.position.set(doorOffset, 0.42, depth / 2 + 0.016);
  group.add(ring);

  const handle = box(0.018, 0.16, 0.03, materials.chrome, width / 2 - 0.08, 0.52, depth / 2 + 0.02);
  group.add(handle);

  for (const [fx, fz] of [
    [-width / 2 + 0.07, -depth / 2 + 0.07],
    [width / 2 - 0.07, -depth / 2 + 0.07],
    [-width / 2 + 0.07, depth / 2 - 0.07],
    [width / 2 - 0.07, depth / 2 - 0.07],
  ] as const) {
    group.add(box(0.05, 0.04, 0.05, materials.metal, fx, 0.02, fz));
  }
}

export function createWasher(materials: Materials, id: string): FurnitureDef {
  const { width, depth, height } = FURNITURE.washer;
  const group = new THREE.Group();
  applianceShell(group, materials, width, depth, height, -0.04);
  group.add(box(0.12, 0.05, 0.04, materials.chrome, -width / 2 + 0.12, height - 0.08, depth / 2 + 0.005));
  return markFurniture(group, {
    id,
    name: "Washing machine",
    width,
    depth,
    height,
    spawned: true,
  });
}

export function createDryer(materials: Materials, id: string): FurnitureDef {
  const { width, depth, height } = FURNITURE.dryer;
  const group = new THREE.Group();
  applianceShell(group, materials, width, depth, height, 0.02);
  group.add(box(0.08, 0.08, 0.03, materials.metal, width / 2 - 0.12, height - 0.1, depth / 2 + 0.005));
  return markFurniture(group, {
    id,
    name: "Tumble dryer",
    width,
    depth,
    height,
    spawned: true,
  });
}
