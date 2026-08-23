import * as THREE from "three";
import { FURNITURE } from "../config";
import type { Materials } from "../scene/materials";
import { markFurniture, type FurnitureDef } from "./types";

export function createDesk(materials: Materials): FurnitureDef {
  const { width, depth, height } = FURNITURE.desk;
  const group = new THREE.Group();

  const top = new THREE.Mesh(new THREE.BoxGeometry(width, 0.04, depth), materials.oak);
  top.position.set(0, height, 0);
  top.castShadow = true;
  top.receiveShadow = true;
  group.add(top);

  for (const [x, z] of [
    [-width / 2 + 0.06, -depth / 2 + 0.06],
    [width / 2 - 0.06, -depth / 2 + 0.06],
    [-width / 2 + 0.06, depth / 2 - 0.06],
    [width / 2 - 0.06, depth / 2 - 0.06],
  ] as const) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, height - 0.02, 0.06), materials.metal);
    leg.position.set(x, (height - 0.02) / 2, z);
    leg.castShadow = true;
    group.add(leg);
  }

  const rail = new THREE.Mesh(new THREE.BoxGeometry(width - 0.16, 0.04, 0.04), materials.metal);
  rail.position.set(0, 0.22, -depth / 2 + 0.08);
  group.add(rail);

  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.12, 12), materials.metal);
  stand.position.set(0, height + 0.08, -0.08);
  group.add(stand);
  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.18, 0.03), materials.metal);
  neck.position.set(0, height + 0.2, -0.1);
  group.add(neck);

  const bezel = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.34, 0.03), materials.metal);
  bezel.position.set(0, height + 0.38, -0.1);
  bezel.castShadow = true;
  group.add(bezel);
  const screen = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.3, 0.01), materials.screen);
  screen.position.set(0, height + 0.38, -0.084);
  group.add(screen);

  const keyboard = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.02, 0.13), materials.metal);
  keyboard.position.set(-0.08, height + 0.02, 0.12);
  group.add(keyboard);
  const mouse = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.025, 0.1), materials.metal);
  mouse.position.set(0.22, height + 0.022, 0.14);
  group.add(mouse);

  return markFurniture(group, {
    id: "desk",
    name: "Desk + PC",
    width,
    depth,
    height: height + 0.55,
  });
}

export function createOfficeChair(materials: Materials): FurnitureDef {
  const { width, depth, height } = FURNITURE.chair;
  const group = new THREE.Group();

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.04, 12), materials.metal);
  base.position.y = 0.08;
  group.add(base);

  for (let i = 0; i < 5; i += 1) {
    const a = (i / 5) * Math.PI * 2;
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.03, 0.04), materials.metal);
    arm.position.set(Math.cos(a) * 0.14, 0.06, Math.sin(a) * 0.14);
    arm.rotation.y = -a;
    group.add(arm);
    const wheel = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), materials.metal);
    wheel.position.set(Math.cos(a) * 0.24, 0.03, Math.sin(a) * 0.24);
    group.add(wheel);
  }

  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.32, 10), materials.chrome);
  column.position.y = 0.26;
  group.add(column);

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.07, 0.46), materials.charcoal);
  seat.position.y = 0.48;
  seat.castShadow = true;
  group.add(seat);

  const back = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.52, 0.07), materials.charcoal);
  back.position.set(0, 0.82, -0.2);
  back.rotation.x = -0.12;
  back.castShadow = true;
  group.add(back);

  for (const side of [-1, 1]) {
    const rest = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.28), materials.charcoal);
    rest.position.set(side * 0.24, 0.66, -0.02);
    group.add(rest);
  }

  return markFurniture(group, {
    id: "chair",
    name: "Office chair",
    width,
    depth,
    height,
  });
}
