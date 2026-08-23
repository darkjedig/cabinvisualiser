import * as THREE from "three";
import { FURNITURE } from "../config";
import type { Materials } from "../scene/materials";
import { markFurniture, type FurnitureDef } from "./types";

/**
 * TRIOBLADE 200cm high-gloss LED TV stand
 * https://www.amazon.co.uk/TRIOBLADE-Stand-Cabinet-Storage-Entertainment/dp/B0F1TNF48C
 * 200 × 35 × 45 cm — 2 open bays, 2 drawers, 2 handleless doors.
 */
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

export function createTvUnit(materials: Materials): FurnitureDef {
  const unit = FURNITURE.tvUnit;
  const tv = FURNITURE.tv;
  const group = new THREE.Group();
  const gloss = materials.glossWhite;
  const black = materials.glossBlack;
  const led = materials.led;

  const t = 0.018;
  const plinth = 0.03;
  const innerH = unit.height - plinth - t;
  const innerD = unit.depth - t;
  const columns = [0.36, 0.38, 0.36, 0.45, 0.45];
  let cursor = -unit.width / 2;

  group.add(panel(unit.width, plinth, unit.depth, gloss, 0, plinth / 2, 0));
  group.add(panel(unit.width, t, unit.depth + 0.01, gloss, 0, unit.height - t / 2, 0.005));
  group.add(panel(unit.width - t * 2, innerH, t, gloss, 0, plinth + innerH / 2, -unit.depth / 2 + t / 2));

  const bays: Array<{ x0: number; x1: number; kind: "open" | "drawers" | "door" }> = [];
  for (const [index, width] of columns.entries()) {
    const x0 = cursor;
    const x1 = cursor + width;
    const kind = index === 0 || index === 2 ? "open" : index === 1 ? "drawers" : "door";
    bays.push({ x0, x1, kind });
    cursor = x1;
  }

  for (const [index, bay] of bays.entries()) {
    const cx = (bay.x0 + bay.x1) / 2;
    const bw = bay.x1 - bay.x0;
    group.add(panel(t, innerH, innerD, gloss, bay.x0 + t / 2, plinth + innerH / 2, t / 2));
    if (index === bays.length - 1) {
      group.add(panel(t, innerH, innerD, gloss, bay.x1 - t / 2, plinth + innerH / 2, t / 2));
    }

    if (bay.kind === "open") {
      group.add(panel(bw - t * 2, t, innerD - 0.01, materials.oak, cx, plinth + innerH / 2, 0.01));
      const inset = panel(bw - t * 2.4, innerH - t, 0.008, materials.oak, cx, plinth + innerH / 2, -unit.depth / 2 + t + 0.01);
      group.add(inset);
      group.add(panel(bw - t * 2, 0.006, 0.006, led, cx, unit.height - t - 0.004, unit.depth / 2 - 0.012));
      group.add(panel(0.006, innerH - 0.02, 0.006, led, bay.x0 + t + 0.004, plinth + innerH / 2, unit.depth / 2 - 0.012));
      group.add(panel(0.006, innerH - 0.02, 0.006, led, bay.x1 - t - 0.004, plinth + innerH / 2, unit.depth / 2 - 0.012));
      group.add(panel(bw - t * 2, 0.006, 0.006, led, cx, plinth + 0.01, unit.depth / 2 - 0.012));
    }

    if (bay.kind === "drawers") {
      const drawerH = (innerH - 0.012) / 2;
      for (const row of [0, 1]) {
        const y = plinth + 0.006 + drawerH / 2 + row * (drawerH + 0.006);
        group.add(panel(bw - t * 2 - 0.006, drawerH, 0.016, gloss, cx, y, unit.depth / 2 - 0.002));
        group.add(panel(bw - t * 2.6, 0.004, 0.004, led, cx, y - drawerH / 2 + 0.01, unit.depth / 2 + 0.006));
      }
    }

    if (bay.kind === "door") {
      group.add(panel(bw - t - 0.008, innerH - 0.01, 0.016, black, cx, plinth + innerH / 2, unit.depth / 2 - 0.002));
    }
  }

  group.add(panel(unit.width - 0.04, 0.007, 0.007, led, 0, unit.height - 0.006, unit.depth / 2 + 0.004));

  const screenY = unit.height + 0.03 + tv.height / 2;
  const screenZ = 0.02;
  group.add(panel(tv.width, tv.height, tv.depth, materials.metal, 0, screenY, screenZ));
  group.add(panel(tv.width - 0.04, tv.height - 0.04, 0.01, materials.screen, 0, screenY, screenZ + tv.depth / 2 + 0.002));
  group.add(panel(0.32, 0.03, 0.14, materials.metal, 0, unit.height + 0.015, screenZ));

  return markFurniture(group, {
    id: "tv",
    name: "TRIOBLADE TV unit + 55\"",
    width: unit.width,
    depth: unit.depth,
    height: unit.height + tv.height + 0.04,
  });
}
