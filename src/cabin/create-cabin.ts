import * as THREE from "three";
import type { Materials } from "../scene/materials";
import { ceilingAt, isApexRoof, roomBounds, type CabinOpening, type CabinSpec } from "./types";

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
  logCourse: number,
): void {
  const courses = Math.max(1, Math.round(height / logCourse));
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

function frameMaterial(spec: CabinSpec, materials: Materials): THREE.Material {
  return spec.frame === "timber" ? materials.oak : materials.upvc;
}

function wallMaterial(spec: CabinSpec, materials: Materials): THREE.Material {
  if (spec.cladding === "metal") {
    return materials.galvanised;
  }
  return spec.cladding === "vertical" ? materials.spruceVertical : materials.spruce;
}

function glazedUnit(
  materials: Materials,
  frameMat: THREE.Material,
  outerW: number,
  outerH: number,
  frame: number,
  sill = 0.08,
): THREE.Group {
  const unit = new THREE.Group();
  const depth = 0.07;
  unit.add(box(outerW, frame, depth, frameMat, 0, outerH - frame / 2, 0));
  unit.add(box(outerW, frame, depth, frameMat, 0, frame / 2, 0));
  unit.add(box(frame, outerH - frame * 2, depth, frameMat, -outerW / 2 + frame / 2, outerH / 2, 0));
  unit.add(box(frame, outerH - frame * 2, depth, frameMat, outerW / 2 - frame / 2, outerH / 2, 0));
  unit.add(box(outerW, sill, depth + 0.02, frameMat, 0, sill / 2, 0.01));

  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(outerW - frame * 2, Math.max(0.1, outerH - frame * 2 - sill * 0.4)),
    materials.glass,
  );
  glass.position.set(0, outerH / 2 + sill * 0.1, 0);
  unit.add(glass);
  return unit;
}

function doorFrame(
  doors: THREE.Group,
  frameMat: THREE.Material,
  outerW: number,
  outerH: number,
  depth: number,
): void {
  doors.add(box(outerW + 0.08, 0.07, depth + 0.02, frameMat, 0, outerH + 0.02, 0));
  doors.add(box(outerW + 0.08, 0.08, 0.1, frameMat, 0, 0.04, 0.01));
  doors.add(box(0.07, outerH, depth, frameMat, -outerW / 2 - 0.02, outerH / 2, 0));
  doors.add(box(0.07, outerH, depth, frameMat, outerW / 2 + 0.02, outerH / 2, 0));
  doors.add(box(0.05, outerH - 0.08, depth, frameMat, 0, outerH / 2, 0));
}

function frenchDoors(
  materials: Materials,
  frameMat: THREE.Material,
  outerW: number,
  outerH: number,
): THREE.Group {
  const doors = new THREE.Group();
  const frame = 0.06;
  const depth = 0.08;
  doorFrame(doors, frameMat, outerW, outerH, depth);

  const leafW = (outerW - 0.05) / 2;
  for (const side of [-1, 1]) {
    const x = side * (leafW / 2 + 0.025);
    const leaf = glazedUnit(materials, frameMat, leafW, outerH - 0.1, frame, 0.12);
    leaf.position.set(x, 0.05, 0);
    doors.add(leaf);
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.12, 10), materials.metal);
    handle.rotation.z = Math.PI / 2;
    handle.position.set(x - side * 0.08, 1.0, 0.05);
    doors.add(handle);
  }
  return doors;
}

function halfGlazedDoors(
  materials: Materials,
  frameMat: THREE.Material,
  outerW: number,
  outerH: number,
): THREE.Group {
  const doors = new THREE.Group();
  const depth = 0.08;
  const stile = 0.055;
  const rail = 0.075;
  doorFrame(doors, frameMat, outerW, outerH, depth);

  const leafW = (outerW - 0.05) / 2;
  const solidH = Math.max(0.54, outerH * 0.33);
  for (const side of [-1, 1]) {
    const x = side * (leafW / 2 + 0.025);
    doors.add(box(stile, outerH - 0.1, depth, frameMat, x - leafW / 2 + stile / 2, outerH / 2, 0));
    doors.add(box(stile, outerH - 0.1, depth, frameMat, x + leafW / 2 - stile / 2, outerH / 2, 0));
    doors.add(box(leafW, rail, depth, frameMat, x, outerH - 0.05 - rail / 2, 0));
    doors.add(box(leafW, rail, depth, frameMat, x, solidH + 0.02, 0));
    doors.add(box(leafW, rail, depth, frameMat, x, 0.05 + rail / 2, 0));
    const panelH = Math.max(0.28, solidH - rail * 1.4);
    doors.add(box(leafW - stile * 2, panelH, 0.036, frameMat, x, 0.05 + rail + panelH / 2, 0));
    const glassH = Math.max(0.28, outerH - 0.12 - solidH - rail);
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(leafW - stile * 2, glassH), materials.glass);
    glass.position.set(x, solidH + rail * 0.6 + glassH / 2, 0.01);
    doors.add(glass);
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.12, 10), materials.metal);
    handle.rotation.z = Math.PI / 2;
    handle.position.set(x - side * 0.08, 1.0, 0.05);
    doors.add(handle);
  }
  return doors;
}

function solidDoors(
  materials: Materials,
  frameMat: THREE.Material,
  outerW: number,
  outerH: number,
): THREE.Group {
  const doors = new THREE.Group();
  const depth = 0.05;
  doorFrame(doors, frameMat, outerW, outerH, depth);
  const leafW = (outerW - 0.04) / 2;
  for (const side of [-1, 1]) {
    const x = side * (leafW / 2 + 0.02);
    doors.add(box(leafW, outerH - 0.08, depth, materials.galvanised, x, outerH / 2, 0));
    for (let i = 0; i < 4; i += 1) {
      const y = 0.22 + i * ((outerH - 0.4) / 3);
      doors.add(box(leafW - 0.04, 0.018, 0.02, frameMat, x, y, 0.02));
    }
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.1, 10), materials.chrome);
    handle.rotation.z = Math.PI / 2;
    handle.position.set(x - side * 0.12, 1.0, 0.04);
    doors.add(handle);
  }
  return doors;
}

function placeOpening(
  materials: Materials,
  spec: CabinSpec,
  opening: CabinOpening,
  wallZ: number,
  wallTop: number,
  wall: number,
): THREE.Group {
  const cluster = new THREE.Group();
  const wallMat = wallMaterial(spec, materials);
  const frameMat = frameMaterial(spec, materials);
  if (opening.type === "window") {
    const above = wallTop - (opening.sill + opening.outerH);
    if (above > 0.04) {
      cluster.add(box(opening.outerW, above, wall, wallMat, opening.x, opening.sill + opening.outerH + above / 2, wallZ));
    }
    if (opening.sill > 0.04) {
      cluster.add(box(opening.outerW, opening.sill, wall, wallMat, opening.x, opening.sill / 2, wallZ));
    }
    const unit = glazedUnit(materials, frameMat, opening.outerW, opening.outerH, spec.frame === "timber" ? 0.042 : 0.055, Math.max(0.04, opening.sill * 0.2));
    unit.position.set(opening.x, opening.sill, wallZ);
    cluster.add(unit);
  } else {
    const above = wallTop - opening.outerH;
    if (above > 0.04) {
      cluster.add(box(opening.outerW, above, wall, wallMat, opening.x, opening.outerH + above / 2, wallZ));
    }
    const doors =
      spec.doorStyle === "half-glazed"
        ? halfGlazedDoors(materials, frameMat, opening.outerW, opening.outerH)
        : spec.doorStyle === "solid"
          ? solidDoors(materials, frameMat, opening.outerW, opening.outerH)
          : frenchDoors(materials, frameMat, opening.outerW, opening.outerH);
    doors.position.set(opening.x, 0, wallZ);
    cluster.add(doors);
  }
  return cluster;
}

function solidSpans(
  min: number,
  max: number,
  openings: Array<{ centre: number; width: number }>,
): Array<{ a: number; b: number }> {
  const sorted = [...openings].sort((a, b) => a.centre - b.centre);
  const spans: Array<{ a: number; b: number }> = [];
  let cursor = min;
  for (const opening of sorted) {
    const a = opening.centre - opening.width / 2;
    const b = opening.centre + opening.width / 2;
    if (a > cursor + 0.02) {
      spans.push({ a: cursor, b: a });
    }
    cursor = Math.max(cursor, b);
  }
  if (cursor < max - 0.02) {
    spans.push({ a: cursor, b: max });
  }
  return spans;
}

function coveredBy(value: number, openings: Array<{ centre: number; width: number }>): boolean {
  return openings.some((opening) => Math.abs(value - opening.centre) < opening.width / 2 - 0.01);
}

function addRoof(
  roofLayer: THREE.Group,
  spec: CabinSpec,
  materials: Materials,
  room: { minX: number; maxX: number; minZ: number; maxZ: number },
  iw: number,
  id: number,
  wall: number,
): void {
  const roofW = spec.externalWidth + spec.roofOverhangSides * 2;
  const roofD = spec.externalDepth + spec.roofOverhangFront + spec.roofOverhangBack + spec.platformDepth * 0.15;
  const frontY = spec.eavesFront + 0.04;
  const backY = spec.eavesBack + 0.04;
  const ridgeY = spec.ridgeHeight + 0.04;

  if (isApexRoof(spec)) {
    const frontEdgeZ = room.maxZ + wall + spec.roofOverhangFront;
    const backEdgeZ = room.minZ - wall - spec.roofOverhangBack;
    const ridgeZ = (frontEdgeZ + backEdgeZ) / 2;
    const frontRun = Math.max(0.2, frontEdgeZ - ridgeZ);
    const backRun = Math.max(0.2, ridgeZ - backEdgeZ);
    const frontLen = Math.hypot(frontRun, ridgeY - frontY);
    const backLen = Math.hypot(backRun, ridgeY - backY);
    const frontTilt = Math.atan2(ridgeY - frontY, frontRun);
    const backTilt = Math.atan2(ridgeY - backY, backRun);

    const frontPlane = new THREE.Mesh(new THREE.BoxGeometry(roofW, spec.roofThickness, frontLen), materials.felt);
    frontPlane.rotation.x = frontTilt;
    frontPlane.position.set(0, (ridgeY + frontY) / 2, (ridgeZ + frontEdgeZ) / 2);
    frontPlane.castShadow = true;
    frontPlane.receiveShadow = true;
    frontPlane.name = "roof";
    roofLayer.add(frontPlane);

    const backPlane = new THREE.Mesh(new THREE.BoxGeometry(roofW, spec.roofThickness, backLen), materials.felt);
    backPlane.rotation.x = -backTilt;
    backPlane.position.set(0, (ridgeY + backY) / 2, (ridgeZ + backEdgeZ) / 2);
    backPlane.castShadow = true;
    backPlane.receiveShadow = true;
    backPlane.name = "roof-back";
    roofLayer.add(backPlane);

    const frontBoards = new THREE.Mesh(
      new THREE.BoxGeometry(iw, 0.02, Math.hypot(id / 2 + 0.04, ridgeY - frontY)),
      materials.spruceRoof,
    );
    frontBoards.rotation.x = frontTilt;
    frontBoards.position.set(0, (ridgeY + frontY) / 2 - 0.03, (ridgeZ + room.maxZ) / 2);
    frontBoards.name = "roof-boards";
    roofLayer.add(frontBoards);

    const backBoards = new THREE.Mesh(
      new THREE.BoxGeometry(iw, 0.02, Math.hypot(id / 2 + 0.04, ridgeY - backY)),
      materials.spruceRoof,
    );
    backBoards.rotation.x = -backTilt;
    backBoards.position.set(0, (ridgeY + backY) / 2 - 0.03, (ridgeZ + room.minZ) / 2);
    roofLayer.add(backBoards);

    roofLayer.add(box(roofW - 0.06, 0.1, 0.1, materials.oak, 0, ridgeY - 0.06, ridgeZ));

    const purlinCount = 5;
    for (let i = 0; i < purlinCount; i += 1) {
      const t = i / (purlinCount - 1);
      const z = room.minZ + t * id;
      const beam = box(iw - 0.08, 0.1, 0.08, materials.oak, 0, ceilingAt(z, spec) - 0.07, z);
      beam.name = "purlin";
      roofLayer.add(beam);
    }

    for (let i = 0; i < 6; i += 1) {
      const x = -iw / 2 + 0.25 + i * ((iw - 0.5) / 5);
      const rafter = box(
        0.07,
        0.09,
        spec.roofOverhangFront + 0.18,
        materials.oak,
        x,
        frontY - 0.05,
        room.maxZ + wall + spec.roofOverhangFront * 0.45,
      );
      rafter.rotation.x = frontTilt;
      roofLayer.add(rafter);
    }

    const barge = 0.05;
    const leftFront = box(barge, 0.12, frontLen, materials.oak, -roofW / 2 + barge / 2, (ridgeY + frontY) / 2, (ridgeZ + frontEdgeZ) / 2);
    leftFront.rotation.x = frontTilt;
    roofLayer.add(leftFront);
    const leftBack = box(barge, 0.12, backLen, materials.oak, -roofW / 2 + barge / 2, (ridgeY + backY) / 2, (ridgeZ + backEdgeZ) / 2);
    leftBack.rotation.x = -backTilt;
    roofLayer.add(leftBack);
    const rightFront = leftFront.clone();
    rightFront.position.x = roofW / 2 - barge / 2;
    roofLayer.add(rightFront);
    const rightBack = leftBack.clone();
    rightBack.position.x = roofW / 2 - barge / 2;
    roofLayer.add(rightBack);
    return;
  }

  const roof = new THREE.Mesh(new THREE.BoxGeometry(roofW, spec.roofThickness, roofD), spec.cladding === "metal" ? materials.galvanised : materials.felt);
  const midY = (frontY + backY) / 2;
  const dz = spec.externalDepth + spec.roofOverhangFront * 0.5;
  const angle = Math.atan2(frontY - backY, dz);
  roof.rotation.x = -angle;
  roof.position.set(0, midY + 0.06, spec.roofOverhangFront * 0.18);
  roof.castShadow = true;
  roof.receiveShadow = true;
  roof.name = "roof";
  roofLayer.add(roof);

  if (spec.cladding !== "metal") {
    const underside = new THREE.Mesh(new THREE.BoxGeometry(iw, 0.02, id + 0.08), materials.spruceRoof);
    underside.rotation.x = -angle;
    underside.position.set(0, midY - 0.03, 0.02);
    underside.name = "roof-boards";
    roofLayer.add(underside);

    const purlinCount = 5;
    for (let i = 0; i < purlinCount; i += 1) {
      const t = i / (purlinCount - 1);
      const z = room.minZ + t * id;
      const beam = box(iw - 0.08, 0.1, 0.08, materials.oak, 0, ceilingAt(z, spec) - 0.07, z);
      beam.name = "purlin";
      roofLayer.add(beam);
    }

    for (let i = 0; i < 6; i += 1) {
      const x = -iw / 2 + 0.25 + i * ((iw - 0.5) / 5);
      const rafter = box(0.07, 0.09, spec.roofOverhangFront + 0.15, materials.oak, x, frontY - 0.08, room.maxZ + wall + 0.16);
      rafter.rotation.x = -angle;
      roofLayer.add(rafter);
    }
  }

  if (!spec.fascia) {
    return;
  }
  const fasciaH = 0.18;
  const fasciaD = 0.06;
  const frontFasciaZ = room.maxZ + wall + spec.roofOverhangFront * 0.55;
  const backFasciaZ = room.minZ - wall - spec.roofOverhangBack * 0.4;
  roofLayer.add(box(roofW, fasciaH, fasciaD, materials.oak, 0, frontY - 0.02, frontFasciaZ));
  roofLayer.add(box(roofW, fasciaH, fasciaD, materials.oak, 0, backY - 0.02, backFasciaZ));
  const sideLen = roofD - 0.04;
  const leftFascia = box(fasciaD, fasciaH, sideLen, materials.oak, -roofW / 2 + fasciaD / 2, midY + 0.02, spec.roofOverhangFront * 0.18);
  leftFascia.rotation.x = -angle;
  roofLayer.add(leftFascia);
  const rightFascia = box(fasciaD, fasciaH, sideLen, materials.oak, roofW / 2 - fasciaD / 2, midY + 0.02, spec.roofOverhangFront * 0.18);
  rightFascia.rotation.x = -angle;
  roofLayer.add(rightFascia);
}

export function createCabin(spec: CabinSpec, materials: Materials): THREE.Group {
  const cabinGroup = new THREE.Group();
  cabinGroup.name = "cabin";
  cabinGroup.userData.cabinId = spec.id;

  const walls = new THREE.Group();
  walls.name = "layer-walls";
  const roofLayer = new THREE.Group();
  roofLayer.name = "layer-roof";
  const deckLayer = new THREE.Group();
  deckLayer.name = "layer-deck";
  const ground = new THREE.Group();
  ground.name = "layer-ground";

  const room = roomBounds(spec);
  const iw = spec.internalWidth;
  const id = spec.internalDepth;
  const wall = spec.wallThickness;
  const frontZ = room.maxZ + wall / 2;
  const backZ = room.minZ - wall / 2;
  const leftX = room.minX - wall / 2;
  const rightX = room.maxX + wall / 2;
  const frontH = spec.eavesFront;
  const backH = spec.eavesBack;
  const wallMat = wallMaterial(spec, materials);
  const frameMat = frameMaterial(spec, materials);

  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(iw, spec.floorThickness, id),
    spec.cladding === "metal" ? materials.galvanised : materials.spruceFloor,
  );
  floor.position.y = -spec.floorThickness / 2;
  floor.receiveShadow = true;
  floor.name = "layer-floor";
  cabinGroup.add(floor);

  if (spec.cladding === "horizontal") {
    addLogCourses(walls, wallMat, iw + wall * 2, backH, wall, true, 0, backZ, spec.logCourse);
  } else {
    walls.add(box(iw + wall * 2, backH, wall, wallMat, 0, backH / 2, backZ));
  }

  const leftOpenings = spec.openings.filter((opening) => opening.wall === "left");
  const rightOpenings = spec.openings.filter((opening) => opening.wall === "right");
  const leftCuts = leftOpenings.map((opening) => ({ centre: opening.x, width: opening.outerW }));
  const rightCuts = rightOpenings.map((opening) => ({ centre: opening.x, width: opening.outerW }));

  const samples = 18;
  for (let i = 0; i < samples; i += 1) {
    const z0 = room.minZ - wall + (id + wall * 2) * (i / samples);
    const z1 = room.minZ - wall + (id + wall * 2) * ((i + 1) / samples);
    const midZ = (z0 + z1) / 2;
    const h = ceilingAt(THREE.MathUtils.clamp(midZ, room.minZ, room.maxZ), spec);
    const segD = z1 - z0;
    if (!coveredBy(midZ, leftCuts)) {
      walls.add(box(wall, h, segD, wallMat, leftX, h / 2, midZ));
    }
    if (!coveredBy(midZ, rightCuts)) {
      walls.add(box(wall, h, segD, wallMat, rightX, h / 2, midZ));
    }
  }

  const frontOpenings = spec.openings.filter((opening) => opening.wall === "front");
  const frontCuts = frontOpenings.map((opening) => ({ centre: opening.x, width: opening.outerW }));
  for (const span of solidSpans(room.minX, room.maxX, frontCuts)) {
    const spanW = span.b - span.a;
    const spanX = (span.a + span.b) / 2;
    if (spec.cladding === "vertical") {
      walls.add(box(spanW, frontH, wall, wallMat, spanX, frontH / 2, frontZ));
    } else {
      addLogCourses(walls, wallMat, spanW, frontH, wall, true, spanX, frontZ, spec.logCourse);
    }
  }
  for (const opening of frontOpenings) {
    walls.add(placeOpening(materials, spec, opening, frontZ, frontH, wall));
  }

  for (const opening of leftOpenings) {
    const wallTop = ceilingAt(THREE.MathUtils.clamp(opening.x, room.minZ, room.maxZ), spec);
    const cluster = placeOpening(materials, spec, { ...opening, x: 0 }, 0, wallTop, wall);
    cluster.rotation.y = Math.PI / 2;
    cluster.position.set(leftX, 0, opening.x);
    walls.add(cluster);
  }

  for (const opening of rightOpenings) {
    const wallTop = ceilingAt(THREE.MathUtils.clamp(opening.x, room.minZ, room.maxZ), spec);
    const cluster = placeOpening(materials, spec, { ...opening, x: 0 }, 0, wallTop, wall);
    cluster.rotation.y = -Math.PI / 2;
    cluster.position.set(rightX, 0, opening.x);
    walls.add(cluster);
  }

  if (leftOpenings.length > 0 && frontOpenings.length > 0) {
    const corner = box(0.08, frontH, 0.08, frameMat, room.minX, frontH / 2, room.maxZ);
    walls.add(corner);
  }

  addRoof(roofLayer, spec, materials, room, iw, id, wall);

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(spec.externalWidth + 0.1, 0.1, spec.externalDepth + 0.1),
    materials.patio,
  );
  base.position.set(0, -spec.floorThickness - 0.05, 0);
  base.receiveShadow = true;
  ground.add(base);

  if (spec.platformDepth > 0.05) {
    const deckW = spec.externalWidth + 0.2;
    const deck = new THREE.Mesh(new THREE.BoxGeometry(deckW, 0.08, spec.platformDepth), materials.oak);
    deck.position.set(0, -0.02, room.maxZ + spec.platformDepth / 2 + wall);
    deck.receiveShadow = true;
    deck.castShadow = true;
    deckLayer.add(deck);
  }

  const patio = new THREE.Mesh(
    new THREE.BoxGeometry(spec.externalWidth + 2.2, 0.04, 3.4 + spec.platformDepth),
    materials.patio,
  );
  patio.position.set(0, -0.04, room.maxZ + 1.55 + spec.platformDepth * 0.3);
  patio.receiveShadow = true;
  ground.add(patio);

  const grass = new THREE.Mesh(new THREE.CircleGeometry(22, 48), materials.grass);
  grass.rotation.x = -Math.PI / 2;
  grass.position.y = -0.06;
  grass.receiveShadow = true;
  ground.add(grass);

  const dimMat = new THREE.LineBasicMaterial({ color: 0xc45c26 });
  const floorOutline = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(room.minX, 0.01, room.minZ),
      new THREE.Vector3(room.maxX, 0.01, room.minZ),
      new THREE.Vector3(room.maxX, 0.01, room.maxZ),
      new THREE.Vector3(room.minX, 0.01, room.maxZ),
    ]),
    dimMat,
  );
  floorOutline.name = "floor-outline";
  cabinGroup.add(floorOutline);

  cabinGroup.add(walls);
  cabinGroup.add(roofLayer);
  cabinGroup.add(deckLayer);
  cabinGroup.add(ground);

  return cabinGroup;
}
