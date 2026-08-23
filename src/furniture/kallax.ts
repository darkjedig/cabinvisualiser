import * as THREE from "three";
import { FURNITURE } from "../config";
import type { Materials } from "../scene/materials";
import { markFurniture, type FurnitureDef } from "./types";

function panel(
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

function cubeDecor(materials: Materials, x: number, y: number, z: number, variant: number): THREE.Group {
  const g = new THREE.Group();
  if (variant % 4 === 0) {
    for (let i = 0; i < 4; i += 1) {
      const book = new THREE.Mesh(
        new THREE.BoxGeometry(0.035, 0.17 + (i % 2) * 0.03, 0.13),
        i % 2 === 0 ? materials.teal : materials.oak,
      );
      book.position.set(x - 0.07 + i * 0.045, y - 0.04, z);
      book.castShadow = true;
      g.add(book);
    }
  } else if (variant % 4 === 1) {
    const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.034, 0.11, 10), materials.lavender);
    vase.position.set(x, y - 0.08, z);
    vase.castShadow = true;
    g.add(vase);
  } else if (variant % 4 === 2) {
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.09, 0.15), materials.oak);
    box.position.set(x, y - 0.09, z);
    box.castShadow = true;
    g.add(box);
  }
  return g;
}

function oneUnit(materials: Materials, originX: number): THREE.Group {
  const { width, height, depth } = FURNITURE.kallax;
  const t = 0.03;
  const unit = new THREE.Group();

  unit.add(panel(width, t, depth, materials.white, originX, t / 2, 0));
  unit.add(panel(width, t, depth, materials.white, originX, height - t / 2, 0));
  unit.add(panel(t, height, depth, materials.white, originX - width / 2 + t / 2, height / 2, 0));
  unit.add(panel(t, height, depth, materials.white, originX + width / 2 - t / 2, height / 2, 0));
  unit.add(panel(t, height - t * 2, depth, materials.white, originX, height / 2, 0));
  unit.add(panel(width - t * 2, t, depth, materials.white, originX, height / 2, 0));
  unit.add(panel(width - t * 2, height - t * 2, 0.012, materials.white, originX, height / 2, -depth / 2 + 0.006));

  const cell = (width - t * 3) / 2;
  let n = 0;
  for (const row of [0, 1]) {
    for (const col of [0, 1]) {
      const cx = originX - width / 2 + t + cell / 2 + col * (cell + t);
      const cy = t + cell / 2 + row * (cell + t);
      unit.add(cubeDecor(materials, cx, cy, 0.02, Math.round(originX * 10) + n));
      n += 1;
    }
  }
  return unit;
}

export function createKallax(materials: Materials): FurnitureDef {
  const unit = FURNITURE.kallax;
  const width = unit.width * unit.count;
  const group = new THREE.Group();
  group.add(oneUnit(materials, -unit.width / 2));
  group.add(oneUnit(materials, unit.width / 2));

  return markFurniture(group, {
    id: "kallax",
    name: "IKEA KALLAX pair",
    width,
    depth: unit.depth,
    height: unit.height,
  });
}
