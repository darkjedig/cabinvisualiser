import { clampItem } from "../interaction/furniture-controls";
import type { CabinSpec } from "../cabin/types";
import type { Materials } from "../scene/materials";
import { createBar, createStool } from "./bar";
import { createDesk, createOfficeChair } from "./desk";
import { createGym } from "./gym";
import { createKallax } from "./kallax";
import { createSofa } from "./sofa";
import { createCoffeeTable, createConsoleTable } from "./tables";
import { createTvUnit } from "./tv";
import type { FurnitureDef } from "./types";

export function createAllFurniture(materials: Materials, cabin: CabinSpec): FurnitureDef[] {
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

  const consoleTable = createConsoleTable(materials);
  consoleTable.group.position.set(-0.15, 0, 1.62);

  const coffeeTable = createCoffeeTable(materials);
  coffeeTable.group.position.set(0.35, 0, 0.05);

  const items = [sofa, gym, kallax, tv, desk, chair, bar, ...stools, consoleTable, coffeeTable];
  for (const item of items) {
    clampItem(item, cabin, true);
  }
  return items;
}

export type { FurnitureDef } from "./types";
