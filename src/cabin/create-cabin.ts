import * as THREE from "three";
import { CABIN, ROOM } from "../config";
import type { Materials } from "../scene/materials";

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

function addLogCourses(
  group: THREE.Group,
  material: THREE.Material,
  length: number,
  height: number,
  thickness: number,
  alongX: boolean,
  x: number,
  z: number,
): void {
  const courses = Math.max(1, Math.round(height / CABIN.logCourse));
  const courseH = height / courses;
  for (let i = 0; i < courses; i += 1) {
    const y = courseH * 0.5 + i * courseH;
    const inset = i % 2 === 0 ? 0.006 : -0.006;
    if (alongX) {
      group.add(box(length + 0.08, courseH * 0.92, thickness, material, x, y, z + inset));
    } else {
      group.add(box(thickness, courseH * 0.92, length + 0.08, material, x + inset, y, z));
    }
  }
}

function glazedUnit(
  materials: Materials,
  outerW: number,
  outerH: number,
  frame: number,
  sill = 0.08,
): THREE.Group {
  const unit = new THREE.Group();
  const depth = 0.07;
  unit.add(box(outerW, frame, depth, materials.upvc, 0, outerH - frame / 2, 0));
  unit.add(box(outerW, frame, depth, materials.upvc, 0, frame / 2, 0));
  unit.add(box(frame, outerH - frame * 2, depth, materials.upvc, -outerW / 2 + frame / 2, outerH / 2, 0));
  unit.add(box(frame, outerH - frame * 2, depth, materials.upvc, outerW / 2 - frame / 2, outerH / 2, 0));
  unit.add(box(outerW, sill, depth + 0.02, materials.upvc, 0, sill / 2, 0.01));

  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(outerW - frame * 2, outerH - frame * 2 - sill * 0.4),
    materials.glass,
  );
  glass.position.set(0, outerH / 2 + sill * 0.1, 0);
  unit.add(glass);
  return unit;
}

function frenchDoors(materials: Materials, outerW: number, outerH: number): THREE.Group {
  const doors = new THREE.Group();
  const frame = 0.06;
  const depth = 0.08;
  doors.add(box(outerW + 0.08, 0.07, depth + 0.02, materials.upvc, 0, outerH + 0.02, 0));
  doors.add(box(outerW + 0.08, 0.08, 0.1, materials.upvc, 0, 0.04, 0.01));
  doors.add(box(0.07, outerH, depth, materials.upvc, -outerW / 2 - 0.02, outerH / 2, 0));
  doors.add(box(0.07, outerH, depth, materials.upvc, outerW / 2 + 0.02, outerH / 2, 0));
  doors.add(box(0.05, outerH - 0.08, depth, materials.upvc, 0, outerH / 2, 0));

  const leafW = (outerW - 0.05) / 2;
  for (const side of [-1, 1]) {
    const x = side * (leafW / 2 + 0.025);
    const leaf = glazedUnit(materials, leafW, outerH - 0.1, frame, 0.12);
    leaf.position.set(x, 0.05, 0);
    doors.add(leaf);
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.12, 10), materials.metal);
    handle.rotation.z = Math.PI / 2;
    handle.position.set(x - side * 0.08, 1.0, 0.05);
    doors.add(handle);
  }
  return doors;
}

function ceilingHeightAt(z: number): number {
  const t = (z - ROOM.minZ) / CABIN.internalDepth;
  return CABIN.eavesBackBoards + t * (CABIN.eavesFrontBoards - CABIN.eavesBackBoards);
}

export function createCabin(materials: Materials): THREE.Group {
  const cabin = new THREE.Group();
  cabin.name = "cabin";

  const iw = CABIN.internalWidth;
  const id = CABIN.internalDepth;
  const wall = CABIN.wallThickness;
  const frontZ = ROOM.maxZ + wall / 2;
  const backZ = ROOM.minZ - wall / 2;
  const leftX = ROOM.minX - wall / 2;
  const rightX = ROOM.maxX + wall / 2;

  const floor = new THREE.Mesh(new THREE.BoxGeometry(iw, CABIN.floorThickness, id), materials.spruceFloor);
  floor.position.y = -CABIN.floorThickness / 2;
  floor.receiveShadow = true;
  cabin.add(floor);

  const backH = CABIN.eavesBackBoards;
  addLogCourses(cabin, materials.spruce, iw + wall * 2, backH, wall, true, 0, backZ);

  const samples = 18;
  for (let i = 0; i < samples; i += 1) {
    const z0 = ROOM.minZ - wall + (id + wall * 2) * (i / samples);
    const z1 = ROOM.minZ - wall + (id + wall * 2) * ((i + 1) / samples);
    const midZ = (z0 + z1) / 2;
    const h = ceilingHeightAt(THREE.MathUtils.clamp(midZ, ROOM.minZ, ROOM.maxZ));
    const segD = z1 - z0;
    cabin.add(box(wall, h, segD, materials.spruce, leftX, h / 2, midZ));
    cabin.add(box(wall, h, segD, materials.spruce, rightX, h / 2, midZ));
  }

  const frontH = CABIN.eavesFrontBoards;
  const windowOuterW = 0.58;
  const windowOuterH = 1.86;
  const windowSill = 0.42;
  const doorOuterW = 1.28;
  const doorOuterH = 2.02;

  const openings = [
    { type: "window" as const, x: -1.78 },
    { type: "door" as const, x: -0.48 },
    { type: "window" as const, x: 0.62 },
    { type: "window" as const, x: 1.72 },
  ];

  const wallTop = frontH;
  const spans: Array<{ x0: number; x1: number }> = [];
  let cursor = ROOM.minX;
  for (const opening of openings) {
    const half = opening.type === "door" ? doorOuterW / 2 : windowOuterW / 2;
    const x0 = opening.x - half;
    const x1 = opening.x + half;
    if (x0 > cursor + 0.02) {
      spans.push({ x0: cursor, x1: x0 });
    }
    cursor = x1;
  }
  if (cursor < ROOM.maxX - 0.02) {
    spans.push({ x0: cursor, x1: ROOM.maxX });
  }

  for (const span of spans) {
    const w = span.x1 - span.x0;
    cabin.add(box(w, wallTop, wall, materials.spruce, (span.x0 + span.x1) / 2, wallTop / 2, frontZ));
  }

  for (const opening of openings) {
    if (opening.type === "window") {
      const above = wallTop - (windowSill + windowOuterH);
      if (above > 0.04) {
        cabin.add(box(windowOuterW, above, wall, materials.spruce, opening.x, windowSill + windowOuterH + above / 2, frontZ));
      }
      cabin.add(box(windowOuterW, windowSill, wall, materials.spruce, opening.x, windowSill / 2, frontZ));
      const unit = glazedUnit(materials, windowOuterW, windowOuterH, 0.055);
      unit.position.set(opening.x, windowSill, frontZ);
      cabin.add(unit);
    } else {
      const above = wallTop - doorOuterH;
      if (above > 0.04) {
        cabin.add(box(doorOuterW, above, wall, materials.spruce, opening.x, doorOuterH + above / 2, frontZ));
      }
      const doors = frenchDoors(materials, doorOuterW, doorOuterH);
      doors.position.set(opening.x, 0, frontZ);
      cabin.add(doors);
    }
  }

  const roofW = CABIN.externalWidth + CABIN.roofOverhangSides * 2;
  const roofD =
    CABIN.externalDepth + CABIN.roofOverhangFront + CABIN.roofOverhangBack;
  const roof = new THREE.Mesh(new THREE.BoxGeometry(roofW, CABIN.roofThickness, roofD), materials.felt);
  const frontY = CABIN.eavesFrontBoards + 0.04;
  const backY = CABIN.eavesBackBoards + 0.04;
  const midY = (frontY + backY) / 2;
  const dz = CABIN.externalDepth + CABIN.roofOverhangFront * 0.5;
  const angle = Math.atan2(frontY - backY, dz);
  roof.rotation.x = -angle;
  roof.position.set(0, midY + 0.06, CABIN.roofOverhangFront * 0.18);
  roof.castShadow = true;
  roof.receiveShadow = true;
  roof.name = "roof";
  cabin.add(roof);

  const underside = new THREE.Mesh(new THREE.BoxGeometry(iw, 0.02, id + 0.08), materials.spruceRoof);
  underside.rotation.x = -angle;
  underside.position.set(0, midY - 0.03, 0.02);
  underside.name = "roof-boards";
  cabin.add(underside);

  const purlinCount = 5;
  for (let i = 0; i < purlinCount; i += 1) {
    const t = i / (purlinCount - 1);
    const z = ROOM.minZ + t * id;
    const y = ceilingHeightAt(z) - 0.07;
    const beam = box(iw - 0.08, 0.1, 0.08, materials.oak, 0, y, z);
    beam.name = "purlin";
    cabin.add(beam);
  }

  for (let i = 0; i < 6; i += 1) {
    const x = -iw / 2 + 0.25 + i * ((iw - 0.5) / 5);
    const rafter = box(0.07, 0.09, CABIN.roofOverhangFront + 0.15, materials.oak, x, frontY - 0.08, ROOM.maxZ + wall + 0.16);
    rafter.rotation.x = -angle;
    cabin.add(rafter);
  }

  const patio = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.04, 3.4), materials.patio);
  patio.position.set(0, -0.04, ROOM.maxZ + 1.55);
  patio.receiveShadow = true;
  cabin.add(patio);

  const grass = new THREE.Mesh(new THREE.CircleGeometry(18, 48), materials.grass);
  grass.rotation.x = -Math.PI / 2;
  grass.position.y = -0.06;
  grass.receiveShadow = true;
  cabin.add(grass);

  const dimMat = new THREE.LineBasicMaterial({ color: 0xc45c26 });
  const floorOutline = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(ROOM.minX, 0.01, ROOM.minZ),
      new THREE.Vector3(ROOM.maxX, 0.01, ROOM.minZ),
      new THREE.Vector3(ROOM.maxX, 0.01, ROOM.maxZ),
      new THREE.Vector3(ROOM.minX, 0.01, ROOM.maxZ),
    ]),
    dimMat,
  );
  floorOutline.name = "floor-outline";
  cabin.add(floorOutline);

  return cabin;
}
