import * as THREE from "three";
import { ROOM } from "../config";

export function addLighting(scene: THREE.Scene): void {
  const hemi = new THREE.HemisphereLight(0xe8f2ff, 0x6b5340, 0.85);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xfff1d6, 1.65);
  sun.position.set(2.4, 6.2, 8.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -8;
  sun.shadow.camera.right = 8;
  sun.shadow.camera.top = 8;
  sun.shadow.camera.bottom = -8;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 24;
  sun.shadow.bias = -0.0004;
  scene.add(sun);

  const bounce = new THREE.DirectionalLight(0xc5d8e8, 0.35);
  bounce.position.set(-4, 3, -3);
  scene.add(bounce);

  const warmA = new THREE.PointLight(0xffc27a, 6, 7, 2);
  warmA.position.set(-1.1, 2.05, 0.4);
  scene.add(warmA);

  const warmB = new THREE.PointLight(0xffd7a1, 5, 7, 2);
  warmB.position.set(1.2, 2.05, -0.2);
  scene.add(warmB);

  const windowFill = new THREE.RectAreaLight(0xdcecff, 8, 4.4, 2.0);
  windowFill.position.set(0, 1.4, ROOM.maxZ + 0.2);
  windowFill.lookAt(0, 1.1, 0);
  scene.add(windowFill);
}
