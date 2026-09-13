import * as THREE from "three";
import { FURNITURE } from "../config";
import type { Materials } from "../scene/materials";
import { markFurniture, type FurnitureDef } from "./types";

function pad(
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

export function createSofaBed(materials: Materials, id = "sofa-bed"): FurnitureDef {
  const { width, depth, height, seatHeight } = FURNITURE.sofaBed;
  const group = new THREE.Group();
  const cloth = materials.jumboGrey;
  const armW = 0.16;
  const backT = 0.18;
  const baseH = 0.22;

  group.add(pad(width - 0.04, baseH, depth - 0.08, cloth, 0, baseH / 2, 0.02));
  group.add(pad(width - armW * 2 - 0.04, 0.12, depth - backT - 0.1, cloth, 0, seatHeight - 0.02, -0.02));

  const seatInner = width - armW * 2;
  const cw = seatInner / 3 - 0.02;
  for (let i = 0; i < 3; i += 1) {
    const x = -seatInner / 2 + cw / 2 + 0.01 + i * (cw + 0.02);
    group.add(pad(cw, 0.14, depth - backT - 0.14, cloth, x, seatHeight + 0.04, -0.04));
  }

  const backH = height - seatHeight;
  group.add(pad(width - armW * 2, backH, backT, cloth, 0, seatHeight + backH / 2, depth / 2 - backT / 2 - 0.02));
  group.add(pad(armW, height - 0.08, depth - 0.04, cloth, -width / 2 + armW / 2, (height - 0.08) / 2, 0));
  group.add(pad(armW, height - 0.08, depth - 0.04, cloth, width / 2 - armW / 2, (height - 0.08) / 2, 0));

  const feet = [
    [-width / 2 + 0.1, -depth / 2 + 0.1],
    [width / 2 - 0.1, -depth / 2 + 0.1],
    [-width / 2 + 0.1, depth / 2 - 0.1],
    [width / 2 - 0.1, depth / 2 - 0.1],
  ] as const;
  for (const [fx, fz] of feet) {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.06, 10), materials.metal);
    foot.position.set(fx, 0.03, fz);
    foot.castShadow = true;
    group.add(foot);
  }

  return markFurniture(group, {
    id,
    name: "RestNest sofa bed",
    width,
    depth,
    height,
    spawned: true,
  });
}
