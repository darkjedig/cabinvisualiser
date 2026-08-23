import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ceilingAt, ROOM } from "../config";
import type { FurnitureDef } from "../furniture/types";

export interface ControlState {
  selected: FurnitureDef | null;
  snap: boolean;
  ceilingHit: boolean;
}

interface HudApi {
  setSelection: (item: FurnitureDef | null, extras?: { ceilingHit?: boolean }) => void;
}

export function createFurnitureControls(
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  orbit: OrbitControls,
  items: FurnitureDef[],
  hud: HudApi,
): { state: ControlState; selectById: (id: string) => void; dispose: () => void } {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const floor = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hit = new THREE.Vector3();
  const offset = new THREE.Vector3();
  const state: ControlState = { selected: null, snap: true, ceilingHit: false };
  const helper = new THREE.BoxHelper(new THREE.Group(), 0xe8c37a);
  helper.visible = false;
  scene.add(helper);

  let dragging = false;
  let rotating = false;
  let lastX = 0;

  const setPointer = (event: PointerEvent): void => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  };

  const pickItem = (): FurnitureDef | null => {
    raycaster.setFromCamera(pointer, camera);
    const meshes: THREE.Object3D[] = [];
    for (const item of items) {
      item.group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          meshes.push(child);
        }
      });
    }
    const hits = raycaster.intersectObjects(meshes, false);
    const first = hits[0];
    if (!first) {
      return null;
    }
    let current: THREE.Object3D | null = first.object;
    while (current) {
      const match = items.find((item) => item.group === current);
      if (match) {
        return match;
      }
      current = current.parent;
    }
    return null;
  };

  const applyBounds = (item: FurnitureDef): void => {
    const yaw = item.group.rotation.y;
    const aligned = Math.abs(Math.cos(yaw)) > 0.7;
    const extX = aligned ? item.width / 2 : item.depth / 2;
    const extZ = aligned ? item.depth / 2 : item.width / 2;
    item.group.position.x = THREE.MathUtils.clamp(
      item.group.position.x,
      ROOM.minX + extX + 0.02,
      ROOM.maxX - extX - 0.02,
    );
    item.group.position.z = THREE.MathUtils.clamp(
      item.group.position.z,
      ROOM.minZ + extZ + 0.02,
      ROOM.maxZ - extZ - 0.02,
    );
    if (state.snap) {
      item.group.position.x = Math.round(item.group.position.x / 0.05) * 0.05;
      item.group.position.z = Math.round(item.group.position.z / 0.05) * 0.05;
    }
    state.ceilingHit = item.height > ceilingAt(item.group.position.z) - 0.04;
  };

  const refreshHelper = (item: FurnitureDef | null): void => {
    if (!item) {
      helper.visible = false;
      return;
    }
    helper.setFromObject(item.group);
    const material = helper.material;
    if (material instanceof THREE.LineBasicMaterial) {
      material.color.set(state.ceilingHit ? 0xc0392b : 0xe8c37a);
    }
    helper.visible = true;
  };

  const select = (item: FurnitureDef | null): void => {
    state.selected = item;
    if (item) {
      applyBounds(item);
    }
    refreshHelper(item);
    hud.setSelection(item, { ceilingHit: state.ceilingHit });
  };

  const onPointerDown = (event: PointerEvent): void => {
    if (event.button !== 0) {
      return;
    }
    setPointer(event);
    const item = pickItem();
    if (!item) {
      if (!event.shiftKey) {
        select(null);
      }
      return;
    }
    select(item);
    raycaster.setFromCamera(pointer, camera);
    if (!raycaster.ray.intersectPlane(floor, hit)) {
      return;
    }
    offset.copy(hit).sub(item.group.position);
    dragging = !event.altKey;
    rotating = event.altKey;
    lastX = event.clientX;
    orbit.enabled = false;
    renderer.domElement.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent): void => {
    if (!state.selected || (!dragging && !rotating)) {
      return;
    }
    setPointer(event);
    if (rotating) {
      state.selected.group.rotation.y += (event.clientX - lastX) * 0.01;
      lastX = event.clientX;
    } else {
      raycaster.setFromCamera(pointer, camera);
      if (!raycaster.ray.intersectPlane(floor, hit)) {
        return;
      }
      state.selected.group.position.x = hit.x - offset.x;
      state.selected.group.position.z = hit.z - offset.z;
    }
    applyBounds(state.selected);
    refreshHelper(state.selected);
    hud.setSelection(state.selected, { ceilingHit: state.ceilingHit });
  };

  const onPointerUp = (event: PointerEvent): void => {
    dragging = false;
    rotating = false;
    orbit.enabled = true;
    if (renderer.domElement.hasPointerCapture(event.pointerId)) {
      renderer.domElement.releasePointerCapture(event.pointerId);
    }
  };

  const onKey = (event: KeyboardEvent): void => {
    if (!state.selected) {
      return;
    }
    if (event.key === "q" || event.key === "Q" || event.key === "[") {
      state.selected.group.rotation.y += Math.PI / 12;
    } else if (event.key === "e" || event.key === "E" || event.key === "]") {
      state.selected.group.rotation.y -= Math.PI / 12;
    } else if (event.key === "r" || event.key === "R") {
      state.selected.group.rotation.y += Math.PI / 2;
    } else {
      return;
    }
    applyBounds(state.selected);
    refreshHelper(state.selected);
    hud.setSelection(state.selected, { ceilingHit: state.ceilingHit });
  };

  renderer.domElement.addEventListener("pointerdown", onPointerDown);
  renderer.domElement.addEventListener("pointermove", onPointerMove);
  renderer.domElement.addEventListener("pointerup", onPointerUp);
  window.addEventListener("keydown", onKey);

  return {
    state,
    selectById: (id: string) => {
      select(items.find((entry) => entry.id === id) ?? null);
    },
    dispose: () => {
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("keydown", onKey);
      scene.remove(helper);
    },
  };
}
