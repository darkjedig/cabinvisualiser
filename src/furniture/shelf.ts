import * as THREE from "three";
import { FURNITURE } from "../config";
import type { Materials } from "../scene/materials";
import { clearMeshes, markFurniture, snapSize, type FurnitureDef } from "./types";

export type ShelfSize = keyof typeof FURNITURE.shelves;

function board(
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

export function createShelf(materials: Materials, size: ShelfSize, id: string): FurnitureDef {
  const spec = FURNITURE.shelves[size];
  const group = new THREE.Group();
  const t = size === "cube" ? 0.03 : 0.022;
  const finish = size === "cube" ? materials.white : materials.oak;
  const { width, depth, height, boards } = spec;

  group.add(board(width, t, depth, finish, 0, t / 2, 0));
  group.add(board(width, t, depth, finish, 0, height - t / 2, 0));
  group.add(board(t, height, depth, finish, -width / 2 + t / 2, height / 2, 0));
  group.add(board(t, height, depth, finish, width / 2 - t / 2, height / 2, 0));
  group.add(board(width - t * 2, height - t * 2, 0.01, finish, 0, height / 2, -depth / 2 + 0.006));

  const innerH = height - t * 2;
  const gaps = boards - 1;
  for (let i = 1; i < boards; i += 1) {
    const y = t + (innerH * i) / gaps;
    group.add(board(width - t * 2, t, depth - 0.01, finish, 0, y, 0.004));
  }

  if (size === "cube") {
    group.add(board(t, height - t * 2, depth, finish, 0, height / 2, 0));
  }

  const names: Record<ShelfSize, string> = {
    narrow: "Narrow bookcase",
    billy: "Bookcase 80",
    wide: "Low wide shelf",
    cube: "Cube shelf 77",
  };

  const hangable = size === "cube" || size === "wide";

  return markFurniture(group, {
    id,
    name: names[size],
    width,
    depth,
    height,
    spawned: true,
    lift: hangable,
    mount: "floor",
  });
}

function fillWallShelf(group: THREE.Group, materials: Materials, width: number, depth: number, height: number): void {
  group.add(board(width, height, depth, materials.oak, 0, height / 2, 0));
  const bracketY = -0.04;
  const inset = Math.min(0.12, width / 2 - 0.04);
  for (const side of [-1, 1]) {
    const arm = board(0.04, 0.02, depth - 0.02, materials.metal, side * (width / 2 - inset), bracketY, 0.01);
    group.add(arm);
    const wallPlate = board(0.04, 0.1, 0.012, materials.metal, side * (width / 2 - inset), bracketY - 0.04, -depth / 2 + 0.008);
    group.add(wallPlate);
  }
}

export function createWallShelf(materials: Materials, id: string, width = FURNITURE.wallShelf.width): FurnitureDef {
  const spec = FURNITURE.wallShelf;
  const group = new THREE.Group();
  const startW = snapSize(width, spec.widthMin, spec.widthMax, spec.widthStep);
  fillWallShelf(group, materials, startW, spec.depth, spec.height);

  const item = markFurniture(group, {
    id,
    name: "Wall shelf",
    width: startW,
    depth: spec.depth,
    height: spec.height,
    spawned: true,
    lift: true,
    mount: "wall",
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
    fillWallShelf(group, materials, item.width, item.depth, item.height);
    group.userData.width = item.width;
    group.userData.depth = item.depth;
  };

  return item;
}

export function createAddisShelf(materials: Materials, id: string): FurnitureDef {
  const spec = FURNITURE.addis;
  const group = new THREE.Group();
  const { width, depth, height, boards } = spec;
  const post = 0.035;
  const boardT = 0.025;
  const finish = materials.plasticBlack;

  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      group.add(
        board(post, height, post, finish, sx * (width / 2 - post / 2), height / 2, sz * (depth / 2 - post / 2)),
      );
    }
  }

  for (let i = 0; i < boards; i += 1) {
    const y = boardT / 2 + (i * (height - boardT)) / (boards - 1);
    group.add(board(width - 0.02, boardT, depth - 0.02, finish, 0, y, 0));
  }

  return markFurniture(group, {
    id,
    name: "Addis 4-tier",
    width,
    depth,
    height,
    spawned: true,
  });
}
