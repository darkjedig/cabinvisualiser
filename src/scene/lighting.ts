import * as THREE from "three";
import { roomBounds, type CabinSpec } from "../cabin/types";

export function addLighting(scene: THREE.Scene, cabin: CabinSpec): THREE.Group {
  const group = new THREE.Group();
  group.name = "lighting";

  const hemi = new THREE.HemisphereLight(0xe8f2ff, 0x6b5340, 0.85);
  group.add(hemi);

  const sun = new THREE.DirectionalLight(0xfff1d6, 1.65);
  sun.position.set(2.4, 6.2, 8.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -10;
  sun.shadow.camera.right = 10;
  sun.shadow.camera.top = 10;
  sun.shadow.camera.bottom = -10;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 28;
  sun.shadow.bias = -0.0004;
  group.add(sun);

  const bounce = new THREE.DirectionalLight(0xc5d8e8, 0.35);
  bounce.position.set(-4, 3, -3);
  group.add(bounce);

  const warmA = new THREE.PointLight(0xffc27a, 6, 8, 2);
  warmA.position.set(-1.1, 2.05, 0.4);
  group.add(warmA);

  const warmB = new THREE.PointLight(0xffd7a1, 5, 8, 2);
  warmB.position.set(1.2, 2.05, -0.2);
  group.add(warmB);

  const room = roomBounds(cabin);
  const windowFill = new THREE.RectAreaLight(0xdcecff, 8, cabin.internalWidth * 0.92, 2.0);
  windowFill.name = "window-fill";
  windowFill.position.set(0, 1.4, room.maxZ + 0.2);
  windowFill.lookAt(0, 1.1, 0);
  group.add(windowFill);

  const sideFill = new THREE.RectAreaLight(0xdcecff, 0, cabin.internalDepth * 0.5, 2.0);
  sideFill.name = "side-fill";
  sideFill.position.set(room.minX - 0.2, 1.4, room.maxZ * 0.4);
  sideFill.lookAt(0, 1.1, 0);
  group.add(sideFill);

  scene.add(group);
  syncWindowLight(group, cabin);
  return group;
}

export function syncWindowLight(group: THREE.Group, cabin: CabinSpec): void {
  const fill = group.getObjectByName("window-fill");
  const side = group.getObjectByName("side-fill");
  const room = roomBounds(cabin);
  const hasLeftGlass = cabin.openings.some((opening) => opening.wall === "left");
  if (fill instanceof THREE.RectAreaLight) {
    fill.width = hasLeftGlass ? cabin.internalWidth * 0.62 : cabin.internalWidth * 0.92;
    fill.position.set(hasLeftGlass ? room.minX * 0.35 : 0, 1.4, room.maxZ + 0.2);
    fill.lookAt(0, 1.1, 0);
  }
  if (side instanceof THREE.RectAreaLight) {
    side.intensity = hasLeftGlass ? 6 : 0;
    side.width = cabin.internalDepth * 0.55;
    side.position.set(room.minX - 0.2, 1.4, room.maxZ * 0.35);
    side.lookAt(0, 1.1, 0);
  }
}
