import * as THREE from "three";
import { FURNITURE } from "../config";
import type { Materials } from "../scene/materials";
import { markFurniture, type FurnitureDef } from "./types";

export function createBar(materials: Materials): FurnitureDef {
  const { width, depth, height } = FURNITURE.bar;
  const group = new THREE.Group();

  const bodyH = height - 0.04;
  const body = new THREE.Mesh(new THREE.BoxGeometry(width, bodyH, depth), materials.darkCab);
  body.position.y = bodyH / 2;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const top = new THREE.Mesh(new THREE.BoxGeometry(width + 0.04, 0.04, depth + 0.04), materials.oak);
  top.position.y = height;
  top.castShadow = true;
  top.receiveShadow = true;
  group.add(top);

  const fridgeW = 0.46;
  const fridge = new THREE.Mesh(new THREE.BoxGeometry(fridgeW, 0.72, depth - 0.04), materials.metal);
  fridge.position.set(-width / 2 + fridgeW / 2 + 0.03, 0.38, 0.01);
  fridge.castShadow = true;
  group.add(fridge);

  const fridgeDoor = new THREE.Mesh(new THREE.BoxGeometry(fridgeW - 0.04, 0.66, 0.02), materials.chrome);
  fridgeDoor.position.set(-width / 2 + fridgeW / 2 + 0.03, 0.4, depth / 2 - 0.01);
  group.add(fridgeDoor);

  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.16, 0.02), materials.metal);
  handle.position.set(-width / 2 + fridgeW - 0.04, 0.42, depth / 2 + 0.01);
  group.add(handle);

  const door = new THREE.Mesh(new THREE.BoxGeometry(width - fridgeW - 0.1, 0.7, 0.02), materials.darkCab);
  door.position.set(width / 4, 0.4, depth / 2 + 0.005);
  group.add(door);
  const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.03, 10), materials.chrome);
  knob.rotation.x = Math.PI / 2;
  knob.position.set(width / 2 - 0.14, 0.4, depth / 2 + 0.02);
  group.add(knob);

  const bottle = (x: number, hue: THREE.Material): void => {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.028, 0.22, 10), hue);
    b.position.set(x, height + 0.13, 0);
    b.castShadow = true;
    group.add(b);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.018, 0.08, 8), hue);
    neck.position.set(x, height + 0.27, 0);
    group.add(neck);
  };
  bottle(-0.18, materials.teal);
  bottle(0.02, materials.oak);
  bottle(0.22, materials.lavender);

  return markFurniture(group, {
    id: "bar",
    name: "Home bar",
    width,
    depth,
    height,
  });
}

export function createStool(materials: Materials, id: string): FurnitureDef {
  const { width, depth, height } = FURNITURE.stool;
  const group = new THREE.Group();

  const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.04, 18), materials.oak);
  seat.position.y = height;
  seat.castShadow = true;
  group.add(seat);

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.03, 18), materials.charcoal);
  pad.position.y = height + 0.03;
  pad.castShadow = true;
  group.add(pad);

  for (let i = 0; i < 4; i += 1) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.016, height, 8), materials.metal);
    leg.position.set(Math.cos(a) * 0.11, height / 2, Math.sin(a) * 0.11);
    leg.castShadow = true;
    group.add(leg);
  }

  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.008, 8, 20), materials.metal);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.28;
  group.add(ring);

  return markFurniture(group, {
    id,
    name: "Bar stool",
    width,
    depth,
    height,
  });
}
