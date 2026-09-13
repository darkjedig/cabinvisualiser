import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ceilingAt, roomBounds, type CabinSpec } from "../cabin/types";
import { canLift, snapSize, type FurnitureDef } from "../furniture/types";

export interface ControlState {
  selected: FurnitureDef | null;
  snap: boolean;
  ceilingHit: boolean;
}

interface HudApi {
  setSelection: (item: FurnitureDef | null, extras?: { ceilingHit?: boolean }) => void;
  setPieceHidden?: (id: string, hidden: boolean) => void;
}

function snapToWall(item: FurnitureDef, cabin: CabinSpec): void {
  const hanging = item.mount === "wall" || (item.lift && item.group.position.y > 0.12);
  if (!hanging) {
    return;
  }
  const room = roomBounds(cabin);
  const inset = item.depth / 2 + 0.015;
  const pos = item.group.position;
  const options = [
    { dist: Math.abs(room.maxZ - inset - pos.z), apply: (): void => { pos.z = room.maxZ - inset; item.group.rotation.y = 0; } },
    { dist: Math.abs(pos.z - (room.minZ + inset)), apply: (): void => { pos.z = room.minZ + inset; item.group.rotation.y = Math.PI; } },
    { dist: Math.abs(pos.x - (room.minX + inset)), apply: (): void => { pos.x = room.minX + inset; item.group.rotation.y = Math.PI / 2; } },
    { dist: Math.abs(room.maxX - inset - pos.x), apply: (): void => { pos.x = room.maxX - inset; item.group.rotation.y = -Math.PI / 2; } },
  ];
  options.sort((a, b) => a.dist - b.dist);
  const nearest = options[0];
  if (nearest && nearest.dist < 0.42) {
    nearest.apply();
  }
}

export function clampItem(item: FurnitureDef, cabin: CabinSpec, snap: boolean): boolean {
  const room = roomBounds(cabin);
  const yaw = item.group.rotation.y;
  const aligned = Math.abs(Math.cos(yaw)) > 0.7;
  const extX = aligned ? item.width / 2 : item.depth / 2;
  const extZ = aligned ? item.depth / 2 : item.width / 2;
  item.group.position.x = THREE.MathUtils.clamp(
    item.group.position.x,
    room.minX + extX + 0.02,
    room.maxX - extX - 0.02,
  );
  item.group.position.z = THREE.MathUtils.clamp(
    item.group.position.z,
    room.minZ + extZ + 0.02,
    room.maxZ - extZ - 0.02,
  );
  if (snap) {
    item.group.position.x = Math.round(item.group.position.x / 0.05) * 0.05;
    item.group.position.z = Math.round(item.group.position.z / 0.05) * 0.05;
  }
  if (canLift(item)) {
    const minY = item.mount === "wall" ? 0.35 : 0;
    const maxY = Math.max(minY, ceilingAt(item.group.position.z, cabin, item.group.position.x) - item.height - 0.02);
    item.group.position.y = THREE.MathUtils.clamp(item.group.position.y, minY, maxY);
    if (snap) {
      const step = item.kind === "prop" ? 0.01 : 0.05;
      item.group.position.y = Math.round(item.group.position.y / step) * step;
    }
    snapToWall(item, cabin);
  } else {
    item.group.position.y = 0;
  }
  return item.group.position.y + item.height > ceilingAt(item.group.position.z, cabin, item.group.position.x) - 0.04;
}

export type NudgeAxis = "y" | "w" | "d";

export function applyNudge(item: FurnitureDef, axis: NudgeAxis, dir: number): void {
  if (axis === "y" && canLift(item)) {
    const step = item.kind === "prop" ? 0.02 : 0.05;
    item.group.position.y += dir * step;
    return;
  }
  const resize = item.resize;
  if (!resize || !item.rebuild) {
    return;
  }
  if (axis === "w") {
    item.width = snapSize(item.width + dir * resize.widthStep, resize.widthMin, resize.widthMax, resize.widthStep);
    item.rebuild();
    return;
  }
  if (resize.depthMin === undefined || resize.depthMax === undefined || resize.depthStep === undefined) {
    return;
  }
  item.depth = snapSize(item.depth + dir * resize.depthStep, resize.depthMin, resize.depthMax, resize.depthStep);
  item.rebuild();
}

export function createFurnitureControls(
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  orbit: OrbitControls,
  items: FurnitureDef[],
  hud: HudApi,
  getCabin: () => CabinSpec,
  onHidePiece?: (id: string) => void,
  onRemovePiece?: (id: string) => void,
): { state: ControlState; selectById: (id: string) => void; clearSelection: () => void; reclamp: () => void; nudge: (axis: NudgeAxis, dir: number) => void; dispose: () => void } {
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
      if (!item.group.visible) {
        continue;
      }
      item.group.traverse((child) => {
        if (child instanceof THREE.Mesh && child.visible) {
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
    state.ceilingHit = clampItem(item, getCabin(), state.snap);
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
    if (event.key === "h" || event.key === "H") {
      const id = state.selected.id;
      select(null);
      onHidePiece?.(id);
      return;
    }
    if ((event.key === "Delete" || event.key === "Backspace") && state.selected.spawned) {
      event.preventDefault();
      const id = state.selected.id;
      select(null);
      onRemovePiece?.(id);
      return;
    }
    if (canLift(state.selected) && (event.key === "PageUp" || event.key === "=")) {
      event.preventDefault();
      applyNudge(state.selected, "y", 1);
    } else if (canLift(state.selected) && (event.key === "PageDown" || event.key === "-")) {
      event.preventDefault();
      applyNudge(state.selected, "y", -1);
    } else if (state.selected.resize && (event.key === "," || event.key === "<")) {
      applyNudge(state.selected, "w", -1);
    } else if (state.selected.resize && (event.key === "." || event.key === ">")) {
      applyNudge(state.selected, "w", 1);
    } else if (state.selected.resize?.depthStep && (event.key === ";" || event.key === ":")) {
      applyNudge(state.selected, "d", -1);
    } else if (state.selected.resize?.depthStep && (event.key === "'" || event.key === "\"")) {
      applyNudge(state.selected, "d", 1);
    } else if (event.key === "q" || event.key === "Q" || event.key === "[") {
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
    clearSelection: () => {
      select(null);
    },
    nudge: (axis, dir) => {
      if (!state.selected) {
        return;
      }
      applyNudge(state.selected, axis, dir);
      applyBounds(state.selected);
      refreshHelper(state.selected);
      hud.setSelection(state.selected, { ceilingHit: state.ceilingHit });
    },
    reclamp: () => {
      for (const item of items) {
        clampItem(item, getCabin(), state.snap);
      }
      if (state.selected) {
        applyBounds(state.selected);
        refreshHelper(state.selected);
        hud.setSelection(state.selected, { ceilingHit: state.ceilingHit });
      }
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
