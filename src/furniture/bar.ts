import * as THREE from "three";
import { FURNITURE } from "../config";
import type { Materials } from "../scene/materials";
import { clearMeshes, markFurniture, snapSize, type FurnitureDef } from "./types";

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

export function createLBar(materials: Materials, id = "bar-l"): FurnitureDef {
  const spec = FURNITURE.barL;
  const group = new THREE.Group();
  fillLBar(group, materials, spec.width, spec.depth, spec.height);

  const item = markFurniture(group, {
    id,
    name: "L-shaped bar",
    width: spec.width,
    depth: spec.depth,
    height: spec.height,
    spawned: true,
    resize: {
      widthMin: spec.widthMin,
      widthMax: spec.widthMax,
      widthStep: spec.widthStep,
      depthMin: spec.depthMin,
      depthMax: spec.depthMax,
      depthStep: spec.depthStep,
    },
  });

  item.rebuild = () => {
    item.width = snapSize(item.width, spec.widthMin, spec.widthMax, spec.widthStep);
    item.depth = snapSize(item.depth, spec.depthMin, spec.depthMax, spec.depthStep);
    clearMeshes(group);
    fillLBar(group, materials, item.width, item.depth, item.height);
    group.userData.width = item.width;
    group.userData.depth = item.depth;
  };

  return item;
}

function fillLBar(
  group: THREE.Group,
  materials: Materials,
  width: number,
  depth: number,
  height: number,
): void {
  const run = FURNITURE.barL.run;
  const fridgeW = FURNITURE.barL.fridgeW;
  const bodyH = height - 0.04;
  const returnLen = Math.max(0.08, depth - run);

  const main = new THREE.Mesh(new THREE.BoxGeometry(width, bodyH, run), materials.darkCab);
  main.position.set(0, bodyH / 2, depth / 2 - run / 2);
  main.castShadow = true;
  main.receiveShadow = true;
  group.add(main);

  const mainTop = new THREE.Mesh(new THREE.BoxGeometry(width + 0.04, 0.04, run + 0.04), materials.oak);
  mainTop.position.set(0, height, depth / 2 - run / 2);
  mainTop.castShadow = true;
  mainTop.receiveShadow = true;
  group.add(mainTop);

  const retX = -width / 2 + run / 2;
  const retZ = -depth / 2 + returnLen / 2;
  const ret = new THREE.Mesh(new THREE.BoxGeometry(run, bodyH, returnLen), materials.darkCab);
  ret.position.set(retX, bodyH / 2, retZ);
  ret.castShadow = true;
  ret.receiveShadow = true;
  group.add(ret);

  const retTop = new THREE.Mesh(new THREE.BoxGeometry(run + 0.04, 0.04, returnLen + 0.02), materials.oak);
  retTop.position.set(retX, height, retZ - 0.01);
  retTop.castShadow = true;
  retTop.receiveShadow = true;
  group.add(retTop);

  const fridgeX = Math.min(width / 2 - fridgeW / 2 - 0.04, width / 2 - fridgeW / 2 - 0.02);
  const fridge = new THREE.Mesh(new THREE.BoxGeometry(fridgeW, 0.72, run - 0.06), materials.metal);
  fridge.position.set(fridgeX, 0.38, depth / 2 - run / 2 + 0.01);
  fridge.castShadow = true;
  group.add(fridge);

  const fridgeDoor = new THREE.Mesh(new THREE.BoxGeometry(fridgeW - 0.04, 0.66, 0.02), materials.chrome);
  fridgeDoor.position.set(fridgeX, 0.4, depth / 2 - 0.01);
  group.add(fridgeDoor);

  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.16, 0.02), materials.metal);
  handle.position.set(fridgeX + fridgeW / 2 - 0.06, 0.42, depth / 2 + 0.01);
  group.add(handle);

  const doorW = width - fridgeW - run - 0.12;
  if (doorW > 0.2) {
    const door = new THREE.Mesh(new THREE.BoxGeometry(doorW, 0.7, 0.02), materials.darkCab);
    door.position.set(-0.08, 0.4, depth / 2 + 0.005);
    group.add(door);
    const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.03, 10), materials.chrome);
    knob.rotation.x = Math.PI / 2;
    knob.position.set(doorW / 2 - 0.22, 0.4, depth / 2 + 0.02);
    group.add(knob);
  }

  const foot = new THREE.Mesh(new THREE.BoxGeometry(run - 0.08, 0.12, Math.max(0.06, returnLen - 0.08)), materials.oak);
  foot.position.set(retX, 0.18, retZ);
  group.add(foot);
}

function logBox(
  group: THREE.Group,
  material: THREE.Material,
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number,
): void {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
}

function logCourses(
  group: THREE.Group,
  material: THREE.Material,
  length: number,
  height: number,
  thickness: number,
  alongX: boolean,
  x: number,
  z: number,
  logCourse: number,
): void {
  const courses = Math.max(1, Math.round(height / logCourse));
  const courseH = height / courses;
  for (let i = 0; i < courses; i += 1) {
    const y = courseH * 0.5 + i * courseH;
    const inset = i % 2 === 0 ? 0.007 : -0.007;
    const extra = 0.07;
    if (alongX) {
      logBox(group, material, length + extra, courseH * 0.9, thickness, x, y, z + inset);
    } else {
      logBox(group, material, thickness, courseH * 0.9, length + extra, x + inset, y, z);
    }
  }
}

function fillLogBar(
  group: THREE.Group,
  materials: Materials,
  width: number,
  depth: number,
  height: number,
): void {
  const { run, logCourse, overhang } = FURNITURE.barLog;
  const bodyH = height - 0.05;
  const returnLen = Math.max(0.12, depth - run);
  const thick = 0.08;
  const frontZ = depth / 2;
  const backZ = -depth / 2;
  const leftX = -width / 2;
  const rightX = width / 2;
  const innerX = leftX + run;
  const innerZ = frontZ - run;

  logCourses(group, materials.spruce, width, bodyH, thick, true, 0, frontZ - thick / 2, logCourse);
  logCourses(group, materials.spruce, run, bodyH, thick, false, rightX - thick / 2, frontZ - run / 2, logCourse);
  logCourses(group, materials.spruce, depth, bodyH, thick, false, leftX + thick / 2, 0, logCourse);
  logCourses(group, materials.spruce, run, bodyH, thick, true, leftX + run / 2, backZ + thick / 2, logCourse);
  logCourses(group, materials.spruce, returnLen, bodyH, thick, false, innerX - thick / 2, backZ + returnLen / 2, logCourse);
  logCourses(group, materials.spruce, width - run, bodyH, thick, true, (innerX + rightX) / 2, innerZ + thick / 2, logCourse);

  const topY = height - 0.025;
  logBox(group, materials.oak, width + overhang * 2, 0.05, run + overhang * 2, 0, topY, frontZ - run / 2);
  logBox(group, materials.oak, run + overhang * 2, 0.05, returnLen + overhang, leftX + run / 2, topY, backZ + returnLen / 2 - overhang * 0.2);

  const tapX = innerX + 0.06;
  const tapZ = innerZ - 0.06;
  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.032, 0.42, 12), materials.chrome);
  column.position.set(tapX, height + 0.21, tapZ);
  column.castShadow = true;
  group.add(column);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.032, 12, 8), materials.chrome);
  cap.position.set(tapX, height + 0.43, tapZ);
  group.add(cap);
  for (const side of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.11, 8), materials.chrome);
    arm.rotation.z = Math.PI / 2;
    arm.position.set(tapX + side * 0.05, height + 0.32, tapZ + 0.04);
    group.add(arm);
    const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.012, 0.07, 8), materials.chrome);
    spout.position.set(tapX + side * 0.09, height + 0.285, tapZ + 0.05);
    group.add(spout);
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.07, 0.018), materials.metal);
    handle.position.set(tapX + side * 0.09, height + 0.36, tapZ + 0.02);
    group.add(handle);
  }

  const opticsX = rightX - 0.22;
  const opticsZ = frontZ - run / 2;
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.014, 0.48, 10), materials.chrome);
  post.position.set(opticsX, height + 0.24, opticsZ);
  post.castShadow = true;
  group.add(post);
  const rail = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.016, 0.016), materials.chrome);
  rail.position.set(opticsX, height + 0.46, opticsZ);
  group.add(rail);
  for (const side of [-1, 1]) {
    const measure = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.016, 0.05, 10), materials.chrome);
    measure.position.set(opticsX + side * 0.07, height + 0.43, opticsZ);
    group.add(measure);
    const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.032, 0.18, 12), side < 0 ? materials.bottleClear : materials.bottleGreen);
    bottle.position.set(opticsX + side * 0.07, height + 0.58, opticsZ);
    bottle.castShadow = true;
    group.add(bottle);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.02, 0.06, 8), side < 0 ? materials.bottleClear : materials.bottleGreen);
    neck.position.set(opticsX + side * 0.07, height + 0.47, opticsZ);
    group.add(neck);
  }

  for (const x of [-0.18, 0.12]) {
    const pint = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.03, 0.14, 14, 1, true), materials.glassClear);
    pint.position.set(x, height + 0.07, frontZ - 0.18);
    group.add(pint);
    const beer = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.027, 0.09, 12), materials.liquidAmber);
    beer.position.set(x, height + 0.05, frontZ - 0.18);
    group.add(beer);
  }
}

export function createLogBar(materials: Materials, id = "bar-log"): FurnitureDef {
  const spec = FURNITURE.barLog;
  const group = new THREE.Group();
  fillLogBar(group, materials, spec.width, spec.depth, spec.height);

  const item = markFurniture(group, {
    id,
    name: "Log cabin bar",
    width: spec.width,
    depth: spec.depth,
    height: spec.height,
    spawned: true,
    resize: {
      widthMin: spec.widthMin,
      widthMax: spec.widthMax,
      widthStep: spec.widthStep,
      depthMin: spec.depthMin,
      depthMax: spec.depthMax,
      depthStep: spec.depthStep,
    },
  });

  item.rebuild = () => {
    item.width = snapSize(item.width, spec.widthMin, spec.widthMax, spec.widthStep);
    item.depth = snapSize(item.depth, spec.depthMin, spec.depthMax, spec.depthStep);
    clearMeshes(group);
    fillLogBar(group, materials, item.width, item.depth, item.height);
    group.userData.width = item.width;
    group.userData.depth = item.depth;
  };

  return item;
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
