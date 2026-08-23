import { ROOM } from "../config";
import type { Materials } from "../scene/materials";
import { createBar, createStool } from "./bar";
import { createDesk, createOfficeChair } from "./desk";
import { createGym } from "./gym";
import { createKallax } from "./kallax";
import { createSofa } from "./sofa";
import { createTvUnit } from "./tv";
import type { FurnitureDef } from "./types";

export function createAllFurniture(materials: Materials): FurnitureDef[] {
  const sofa = createSofa(materials);
  sofa.group.position.set(1.18, 0, -0.98);

  const gym = createGym(materials);
  gym.group.rotation.y = Math.PI;
  gym.group.position.set(-1.82, 0, 0.72);

  const kallax = createKallax(materials);
  kallax.group.rotation.y = Math.PI / 2;
  kallax.group.position.set(-2.15, 0, -0.68);

  const tv = createTvUnit(materials);
  tv.group.position.set(-1.35, 0, -1.68);

  const desk = createDesk(materials);
  desk.group.rotation.y = -Math.PI / 2;
  desk.group.position.set(2.04, 0, 0.55);

  const chair = createOfficeChair(materials);
  chair.group.rotation.y = Math.PI / 2;
  chair.group.position.set(1.42, 0, 0.55);

  const bar = createBar(materials);
  bar.group.rotation.y = Math.PI;
  bar.group.position.set(1.55, 0, 1.58);

  const stools = [0, 1, 2].map((i) => {
    const stool = createStool(materials, `stool-${i + 1}`);
    stool.group.position.set(1.15 + i * 0.38, 0, 1.18);
    return stool;
  });

  const items = [sofa, gym, kallax, tv, desk, chair, bar, ...stools];
  for (const item of items) {
    item.group.position.x = clamp(item.group.position.x, ROOM.minX + 0.2, ROOM.maxX - 0.2);
    item.group.position.z = clamp(item.group.position.z, ROOM.minZ + 0.2, ROOM.maxZ - 0.2);
  }
  return items;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export type { FurnitureDef } from "./types";
