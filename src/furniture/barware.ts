import * as THREE from "three";
import { FURNITURE } from "../config";
import type { Materials } from "../scene/materials";
import { markFurniture, type FurnitureDef } from "./types";

export type BarwareKind = keyof typeof FURNITURE.barware;

function cap(materials: Materials, y: number, r: number): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.012, 12), materials.metal);
  mesh.position.y = y;
  return mesh;
}

function spiritBottle(materials: Materials, tint: THREE.Material): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.038, 0.2, 14), tint);
  body.position.y = 0.11;
  body.castShadow = true;
  g.add(body);
  const shoulder = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.035, 0.04, 12), tint);
  shoulder.position.y = 0.23;
  g.add(shoulder);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.015, 0.07, 10), tint);
  neck.position.y = 0.28;
  g.add(neck);
  g.add(cap(materials, 0.322, 0.013));
  const label = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.07, 0.002), materials.oak);
  label.position.set(0, 0.12, 0.037);
  g.add(label);
  return g;
}

function wineBottle(materials: Materials): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.034, 0.2, 14), materials.bottleGreen);
  body.position.y = 0.11;
  body.castShadow = true;
  g.add(body);
  const shoulder = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.032, 0.05, 12), materials.bottleGreen);
  shoulder.position.y = 0.235;
  g.add(shoulder);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.013, 0.07, 10), materials.bottleGreen);
  neck.position.y = 0.29;
  g.add(neck);
  const foil = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.03, 10), materials.metal);
  foil.position.y = 0.325;
  g.add(foil);
  return g;
}

function beerBottle(materials: Materials): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.03, 0.15, 14), materials.bottleBrown);
  body.position.y = 0.085;
  body.castShadow = true;
  g.add(body);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.026, 0.055, 12), materials.bottleBrown);
  neck.position.y = 0.185;
  g.add(neck);
  g.add(cap(materials, 0.22, 0.013));
  const label = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 0.002), materials.white);
  label.position.set(0, 0.09, 0.03);
  g.add(label);
  return g;
}

function wineGlass(materials: Materials): THREE.Group {
  const g = new THREE.Group();
  const profile = [
    new THREE.Vector2(0.0, 0),
    new THREE.Vector2(0.032, 0),
    new THREE.Vector2(0.01, 0.008),
    new THREE.Vector2(0.006, 0.09),
    new THREE.Vector2(0.038, 0.12),
    new THREE.Vector2(0.042, 0.18),
    new THREE.Vector2(0.03, 0.205),
    new THREE.Vector2(0.022, 0.21),
  ];
  const bowl = new THREE.Mesh(new THREE.LatheGeometry(profile, 18), materials.glassClear);
  bowl.castShadow = true;
  g.add(bowl);
  const wine = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.028, 0.035, 14), materials.liquidWine);
  wine.position.y = 0.145;
  g.add(wine);
  return g;
}

function pintGlass(materials: Materials): THREE.Group {
  const g = new THREE.Group();
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.032, 0.15, 18, 1, true), materials.glassClear);
  glass.position.y = 0.075;
  glass.castShadow = true;
  g.add(glass);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.006, 16), materials.glassClear);
  base.position.y = 0.003;
  g.add(base);
  const beer = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.029, 0.11, 16), materials.liquidAmber);
  beer.position.y = 0.06;
  g.add(beer);
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.034, 0.018, 16), materials.white);
  head.position.y = 0.122;
  g.add(head);
  return g;
}

function tumbler(materials: Materials): THREE.Group {
  const g = new THREE.Group();
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.032, 0.085, 16, 1, true), materials.glassClear);
  glass.position.y = 0.043;
  glass.castShadow = true;
  g.add(glass);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.005, 14), materials.glassClear);
  base.position.y = 0.003;
  g.add(base);
  const drink = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.028, 0.04, 14), materials.liquidAmber);
  drink.position.y = 0.028;
  g.add(drink);
  return g;
}

const NAMES: Record<BarwareKind, string> = {
  bottleSpirit: "Spirit bottle",
  bottleWine: "Wine bottle",
  bottleBeer: "Beer bottle",
  glassWine: "Wine glass",
  glassPint: "Pint glass",
  glassTumbler: "Whisky glass",
};

export function createBarware(materials: Materials, kind: BarwareKind, id: string, variant = 0): FurnitureDef {
  const spec = FURNITURE.barware[kind];
  const group = new THREE.Group();
  const tints = [materials.bottleClear, materials.bottleBrown, materials.teal, materials.bottleGreen];
  const tint = tints[variant % tints.length] ?? materials.bottleClear;

  if (kind === "bottleSpirit") {
    group.add(spiritBottle(materials, tint));
  } else if (kind === "bottleWine") {
    group.add(wineBottle(materials));
  } else if (kind === "bottleBeer") {
    group.add(beerBottle(materials));
  } else if (kind === "glassWine") {
    group.add(wineGlass(materials));
  } else if (kind === "glassPint") {
    group.add(pintGlass(materials));
  } else {
    group.add(tumbler(materials));
  }

  return markFurniture(group, {
    id,
    name: NAMES[kind],
    width: spec.width,
    depth: spec.depth,
    height: spec.height,
    kind: "prop",
    spawned: true,
  });
}
