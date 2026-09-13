import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { cabinById } from "./cabin/catalog";
import { createCabin } from "./cabin/create-cabin";
import { roomBounds, type CabinSpec } from "./cabin/types";
import { FURNITURE } from "./config";
import { addSpecByKind, createAddedItem } from "./furniture/add-catalog";
import { createAllFurniture } from "./furniture/create-furniture";
import { clampItem, createFurnitureControls } from "./interaction/furniture-controls";
import { addLighting, syncWindowLight } from "./scene/lighting";
import { createMaterials } from "./scene/materials";
import { createHud } from "./ui/hud";

RectAreaLightUniformsLib.init();

const app = document.getElementById("app");
if (!app) {
  throw new Error("Missing #app");
}

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
app.append(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color("#8aa4b8");
scene.fog = new THREE.Fog("#8aa4b8", 16, 32);

const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.05, 80);
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true;
orbit.dampingFactor = 0.06;
orbit.maxPolarAngle = Math.PI * 0.49;
orbit.minDistance = 1.2;
orbit.maxDistance = 20;
orbit.target.set(0, 0.9, 0.2);

function viewsFor(cabin: CabinSpec): Record<string, { pos: THREE.Vector3; target: THREE.Vector3; fov: number }> {
  const room = roomBounds(cabin);
  const lift = Math.max(7.2, cabin.internalWidth * 1.35);
  const hasLeftGlass = cabin.openings.some((opening) => opening.wall === "left");
  return {
    corner: {
      pos: new THREE.Vector3(room.minX + 0.32, 1.56, room.minZ + 0.32),
      target: new THREE.Vector3(0.35, 0.85, room.maxZ * 0.35),
      fov: 52,
    },
    top: {
      pos: new THREE.Vector3(0.15, lift, 0.35),
      target: new THREE.Vector3(0, 0, 0),
      fov: 38,
    },
    front: {
      pos: hasLeftGlass
        ? new THREE.Vector3(room.minX - 1.4, 1.55, room.maxZ + 3.1 + cabin.platformDepth)
        : new THREE.Vector3(0.2, 1.55, room.maxZ + 3.6 + cabin.platformDepth),
      target: hasLeftGlass ? new THREE.Vector3(-0.55, 1.05, 0.35) : new THREE.Vector3(0, 1.1, 0),
      fov: 40,
    },
    orbit: {
      pos: new THREE.Vector3(room.maxX + 2.1, 3.4, room.maxZ + 3.4),
      target: new THREE.Vector3(0, 0.8, 0),
      fov: 48,
    },
  };
}

let cabin = cabinById(new URLSearchParams(window.location.search).get("cabin") ?? "terminator");
let cabinMesh: THREE.Group;
let lighting: THREE.Group;
let activeView = new URLSearchParams(window.location.search).get("view") ?? "corner";

function applyView(name: string): void {
  activeView = name;
  const view = viewsFor(cabin)[name] ?? viewsFor(cabin).corner;
  if (!view) {
    return;
  }
  camera.fov = view.fov;
  camera.position.copy(view.pos);
  orbit.target.copy(view.target);
  camera.updateProjectionMatrix();
  orbit.update();
  applyVisibility();
}

const materials = createMaterials();
cabinMesh = createCabin(cabin, materials);
scene.add(cabinMesh);
lighting = addLighting(scene, cabin);

const furniture = createAllFurniture(materials, cabin);
for (const item of furniture) {
  scene.add(item.group);
}

const layers = {
  roof: true,
  walls: true,
  deck: true,
  furniture: true,
};
const hiddenPieces = new Set<string>();
let spawnSeq = 0;

function applyVisibility(): void {
  const roof = cabinMesh.getObjectByName("layer-roof");
  const walls = cabinMesh.getObjectByName("layer-walls");
  const deck = cabinMesh.getObjectByName("layer-deck");
  if (roof) {
    roof.visible = activeView === "top" ? false : layers.roof;
  }
  if (walls) {
    walls.visible = layers.walls;
  }
  if (deck) {
    deck.visible = layers.deck;
  }
  for (const item of furniture) {
    item.group.visible = layers.furniture && !hiddenPieces.has(item.id);
  }
}

applyView(activeView);

const hud = createHud(cabin);
let controls: ReturnType<typeof createFurnitureControls>;

function hidePiece(id: string): void {
  hiddenPieces.add(id);
  hud.setPieceHidden(id, true);
  applyVisibility();
}

function removePiece(id: string): void {
  const index = furniture.findIndex((item) => item.id === id);
  const item = furniture[index];
  if (index < 0 || !item?.spawned) {
    return;
  }
  if (controls.state.selected?.id === id) {
    controls.clearSelection();
  }
  scene.remove(item.group);
  furniture.splice(index, 1);
  hiddenPieces.delete(id);
  hud.removePiece(id);
}

function spawnItem(kind: Parameters<typeof createAddedItem>[0]): void {
  spawnSeq += 1;
  const spec = addSpecByKind(kind);
  const item = createAddedItem(kind, materials, `${kind}-${spawnSeq}`, spawnSeq);
  const host = controls.state.selected;
  if (item.kind === "prop") {
    const surface = host ?? furniture.find((entry) => entry.id === "bar");
    const count = furniture.filter((entry) => entry.kind === "prop").length;
    if (surface) {
      item.group.position.set(
        surface.group.position.x + ((count % 5) - 2) * 0.09,
        surface.kind === "prop" ? surface.group.position.y : surface.height,
        surface.group.position.z + 0.02,
      );
    } else {
      item.group.position.set(((count % 5) - 2) * 0.09, FURNITURE.bar.height, 0);
    }
  } else if (item.mount === "wall") {
    const room = roomBounds(cabin);
    item.group.position.set(0, 1.4, room.minZ + item.depth / 2 + 0.02);
    item.group.rotation.y = Math.PI;
  } else if (item.lift) {
    item.group.position.set(0.2, 0, -0.2);
  } else {
    const extras = furniture.filter((entry) => entry.spawned && entry.kind === "furniture").length;
    item.group.position.set((extras % 3) * 0.35 - 0.35, 0, extras * 0.05);
  }
  clampItem(item, cabin, controls.state.snap);
  furniture.push(item);
  scene.add(item.group);
  hiddenPieces.delete(item.id);
  hud.addPiece({ id: item.id, label: spec.label, size: spec.size, removable: true });
  if (!layers.furniture) {
    layers.furniture = true;
    hud.setLayer("furniture", true);
  }
  applyVisibility();
  controls.selectById(item.id);
}

controls = createFurnitureControls(
  camera,
  renderer,
  scene,
  orbit,
  furniture,
  hud,
  () => cabin,
  hidePiece,
  removePiece,
);
hud.onSelectId((id) => {
  hiddenPieces.delete(id);
  hud.setPieceHidden(id, false);
  if (!layers.furniture) {
    layers.furniture = true;
    hud.setLayer("furniture", true);
  }
  applyVisibility();
  controls.selectById(id);
});
hud.onView((view) => applyView(view));
hud.onToggle((flag) => {
  if (flag === "snap") {
    controls.state.snap = !controls.state.snap;
    return;
  }
  layers[flag] = !layers[flag];
  if (flag === "furniture" && !layers.furniture) {
    controls.clearSelection();
  }
  applyVisibility();
});
hud.onPieceVisible((id, visible) => {
  if (visible) {
    hiddenPieces.delete(id);
  } else {
    hiddenPieces.add(id);
    if (controls.state.selected?.id === id) {
      controls.clearSelection();
    }
  }
  applyVisibility();
});
hud.onHideSelected(() => {
  const id = controls.state.selected?.id;
  if (!id) {
    return;
  }
  controls.clearSelection();
  hidePiece(id);
});
hud.onAdd((kind) => {
  spawnItem(kind);
});
hud.onRemove((id) => {
  removePiece(id);
});
hud.onNudge((axis, dir) => {
  controls.nudge(axis, dir);
});
hud.onCabin((id) => {
  cabin = cabinById(id);
  scene.remove(cabinMesh);
  cabinMesh = createCabin(cabin, materials);
  scene.add(cabinMesh);
  syncWindowLight(lighting, cabin);
  controls.reclamp();
  hud.setCabin(cabin);
  applyView(activeView);
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function tick(): void {
  orbit.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

tick();

window.addEventListener("beforeunload", () => {
  controls.dispose();
  materials.dispose();
  renderer.dispose();
});
