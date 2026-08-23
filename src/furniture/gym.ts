import * as THREE from "three";
import { FURNITURE } from "../config";
import type { Materials } from "../scene/materials";
import { markFurniture, type FurnitureDef } from "./types";

function tube(material: THREE.Material, r: number, len: number): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 10), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function pad(w: number, h: number, d: number, material: THREE.Material): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function makeLabel(): THREE.MeshStandardMaterial {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, 128, 512);
    ctx.save();
    ctx.translate(64, 256);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = "#d3122a";
    ctx.font = "bold 54px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("MARCY", 0, 0);
    ctx.restore();
  }
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshStandardMaterial({ map, roughness: 0.55, metalness: 0.1 });
}

export function createGym(materials: Materials): FurnitureDef {
  const { width, depth, height } = FURNITURE.gym;
  const group = new THREE.Group();
  const steel = materials.metal;

  const base = pad(0.12, 0.06, depth, steel);
  base.position.set(0, 0.03, 0);
  group.add(base);

  const rear = pad(width, 0.06, 0.12, steel);
  rear.position.set(0, 0.03, -depth / 2 + 0.08);
  group.add(rear);

  const tower = pad(0.42, height - 0.08, 0.36, steel);
  tower.position.set(0, (height - 0.08) / 2, -depth / 2 + 0.22);
  group.add(tower);

  const shroud = pad(0.4, height - 0.2, 0.08, makeLabel());
  shroud.position.set(0.22, height / 2 - 0.04, -depth / 2 + 0.22);
  group.add(shroud);

  for (let i = 0; i < 14; i += 1) {
    const plate = pad(0.32, 0.035, 0.22, materials.blackPad);
    plate.position.set(0, 0.22 + i * 0.055, -depth / 2 + 0.22);
    group.add(plate);
  }

  const post = pad(0.08, 1.15, 0.08, steel);
  post.position.set(0, 0.72, -0.18);
  group.add(post);

  const seat = pad(0.42, 0.08, 0.4, materials.blackPad);
  seat.position.set(0, 0.52, 0.08);
  group.add(seat);

  const back = pad(0.42, 0.52, 0.08, materials.blackPad);
  back.position.set(0, 0.86, -0.16);
  back.rotation.x = -0.12;
  group.add(back);

  const preacher = pad(0.46, 0.08, 0.28, materials.blackPad);
  preacher.position.set(0, 0.78, 0.42);
  preacher.rotation.x = 0.55;
  group.add(preacher);

  const preacherPost = pad(0.05, 0.55, 0.05, steel);
  preacherPost.position.set(0, 0.4, 0.38);
  group.add(preacherPost);

  const armPivot = pad(width - 0.08, 0.06, 0.06, steel);
  armPivot.position.set(0, 1.42, -0.08);
  group.add(armPivot);

  for (const side of [-1, 1]) {
    const arm = pad(0.05, 0.9, 0.05, steel);
    arm.position.set(side * 0.4, 1.02, 0.18);
    arm.rotation.x = 0.35;
    group.add(arm);
    const foam = tube(materials.blackPad, 0.035, 0.32);
    foam.position.set(side * 0.4, 0.78, 0.32);
    group.add(foam);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.012, 8, 16, Math.PI), steel);
    handle.position.set(side * 0.4, 0.62, 0.42);
    handle.rotation.y = side * 0.4;
    handle.castShadow = true;
    group.add(handle);
  }

  const boom = pad(0.06, 0.06, 0.7, steel);
  boom.position.set(0, height - 0.08, -depth / 2 + 0.55);
  group.add(boom);

  const lat = pad(0.92, 0.03, 0.03, steel);
  lat.position.set(0, height - 0.22, -0.15);
  group.add(lat);
  for (const side of [-1, 1]) {
    const bend = pad(0.22, 0.03, 0.03, steel);
    bend.position.set(side * 0.52, height - 0.3, -0.15);
    bend.rotation.z = side * 0.45;
    group.add(bend);
  }

  const cable = tube(materials.metal, 0.006, 0.95);
  cable.position.set(0, height - 0.55, -0.12);
  group.add(cable);

  const pulley = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.01, 8, 14), steel);
  pulley.position.set(0, height - 0.1, -0.12);
  pulley.rotation.y = Math.PI / 2;
  group.add(pulley);

  const legPost = pad(0.05, 0.42, 0.05, steel);
  legPost.position.set(0, 0.28, 0.72);
  group.add(legPost);

  for (const pair of [
    [0.18, 0.62],
    [0.18, 0.82],
    [0.38, 0.62],
    [0.38, 0.82],
  ] as const) {
    const roller = tube(materials.blackPad, 0.045, 0.36);
    roller.rotation.z = Math.PI / 2;
    roller.position.set(0, pair[0], pair[1]);
    group.add(roller);
  }

  return markFurniture(group, {
    id: "gym",
    name: "Marcy multi-gym",
    width,
    depth,
    height,
  });
}
