import * as THREE from "three";
import { FURNITURE } from "../config";
import type { Materials } from "../scene/materials";
import { markFurniture, type FurnitureDef } from "./types";

function cushion(w: number, h: number, d: number, material: THREE.Material, x: number, y: number, z: number): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function createSofa(materials: Materials): FurnitureDef {
  const { width, depth, height, seatHeight } = FURNITURE.sofa;
  const group = new THREE.Group();

  const seatD = 0.98;
  const backT = 0.22;
  const armW = 0.2;
  const chaiseW = 0.98;

  group.add(cushion(width, 0.16, seatD, materials.charcoal, 0, 0.18, depth / 2 - seatD / 2));
  group.add(cushion(chaiseW, 0.16, depth - 0.08, materials.charcoal, width / 2 - chaiseW / 2, 0.18, 0));

  const seatY = seatHeight;
  const mainCushions = 3;
  const mainInner = width - armW * 2;
  const cw = mainInner / mainCushions - 0.03;
  for (let i = 0; i < mainCushions; i += 1) {
    const x = -width / 2 + armW + cw / 2 + 0.02 + i * (cw + 0.03);
    group.add(cushion(cw, 0.18, seatD - 0.12, materials.charcoal, x, seatY, depth / 2 - seatD / 2 + 0.02));
  }
  group.add(cushion(chaiseW - 0.08, 0.18, depth - seatD - 0.02, materials.charcoal, width / 2 - chaiseW / 2, seatY, -depth / 2 + (depth - seatD) / 2));

  const backH = height - seatHeight;
  group.add(cushion(width - 0.04, backH, backT, materials.charcoal, 0, seatHeight + backH / 2, depth / 2 - backT / 2));
  group.add(cushion(backT, backH, depth - backT, materials.charcoal, width / 2 - backT / 2, seatHeight + backH / 2, -backT / 2));

  group.add(cushion(armW, height - 0.12, seatD + 0.04, materials.charcoal, -width / 2 + armW / 2, (height - 0.12) / 2, depth / 2 - seatD / 2));
  group.add(cushion(chaiseW + 0.04, height - 0.18, armW, materials.charcoal, width / 2 - chaiseW / 2, (height - 0.18) / 2, -depth / 2 + armW / 2));

  const pillow = (color: THREE.Material, x: number, z: number, rot: number): void => {
    const p = cushion(0.38, 0.32, 0.12, color, x, seatHeight + 0.34, z);
    p.rotation.y = rot;
    group.add(p);
  };
  pillow(materials.teal, -0.55, depth / 2 - 0.38, 0.2);
  pillow(materials.teal, 0.15, depth / 2 - 0.4, -0.15);
  pillow(materials.lavender, 0.72, depth / 2 - 0.42, 0.35);

  const throwMesh = cushion(0.7, 0.08, 0.45, materials.lavender, -0.85, seatHeight + 0.22, depth / 2 - 0.55);
  throwMesh.rotation.z = 0.18;
  group.add(throwMesh);

  const feet = [
    [-width / 2 + 0.12, -depth / 2 + 0.12],
    [width / 2 - 0.12, -depth / 2 + 0.12],
    [-width / 2 + 0.12, depth / 2 - 0.12],
    [width / 2 - 0.12, depth / 2 - 0.12],
  ] as const;
  for (const [fx, fz] of feet) {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.08, 10), materials.metal);
    foot.position.set(fx, 0.04, fz);
    foot.castShadow = true;
    group.add(foot);
  }

  return markFurniture(group, {
    id: "sofa",
    name: "Corner sofa",
    width,
    depth,
    height,
  });
}
