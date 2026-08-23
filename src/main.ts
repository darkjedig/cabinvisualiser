import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { createCabin } from "./cabin/create-cabin";
import { createAllFurniture } from "./furniture/create-furniture";
import { createFurnitureControls } from "./interaction/furniture-controls";
import { addLighting } from "./scene/lighting";
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
scene.fog = new THREE.Fog("#8aa4b8", 14, 28);

const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.05, 80);
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true;
orbit.dampingFactor = 0.06;
orbit.maxPolarAngle = Math.PI * 0.49;
orbit.minDistance = 1.2;
orbit.maxDistance = 16;
orbit.target.set(0, 0.9, 0.2);

const views: Record<string, { pos: THREE.Vector3; target: THREE.Vector3; fov: number }> = {
  corner: {
    pos: new THREE.Vector3(-2.05, 1.56, -1.55),
    target: new THREE.Vector3(0.35, 0.85, 0.7),
    fov: 52,
  },
  top: {
    pos: new THREE.Vector3(0.15, 7.4, 0.35),
    target: new THREE.Vector3(0, 0, 0),
    fov: 38,
  },
  front: {
    pos: new THREE.Vector3(0.2, 1.55, 5.4),
    target: new THREE.Vector3(0, 1.1, 0),
    fov: 40,
  },
  orbit: {
    pos: new THREE.Vector3(4.6, 3.4, 5.2),
    target: new THREE.Vector3(0, 0.8, 0),
    fov: 48,
  },
};

function setRoofVisible(visible: boolean): void {
  cabin.traverse((child) => {
    if (child.name === "roof" || child.name === "roof-boards") {
      child.visible = visible;
    }
  });
}

function applyView(name: string): void {
  const view = views[name] ?? views.corner;
  if (!view) {
    return;
  }
  camera.fov = view.fov;
  camera.position.copy(view.pos);
  orbit.target.copy(view.target);
  camera.updateProjectionMatrix();
  orbit.update();
  if (name === "top") {
    setRoofVisible(false);
  }
}

const materials = createMaterials();
const cabin = createCabin(materials);
scene.add(cabin);
addLighting(scene);

const furniture = createAllFurniture(materials);
for (const item of furniture) {
  scene.add(item.group);
}

const initialView = new URLSearchParams(window.location.search).get("view") ?? "corner";
applyView(initialView);

const hud = createHud();
const controls = createFurnitureControls(camera, renderer, scene, orbit, furniture, hud);
hud.onSelectId((id) => controls.selectById(id));
hud.onView((view) => applyView(view));
hud.onToggle((flag) => {
  if (flag === "roof") {
    cabin.traverse((child) => {
      if (child.name === "roof" || child.name === "roof-boards" || child.name === "purlin") {
        child.visible = !child.visible;
      }
    });
  }
  if (flag === "snap") {
    controls.state.snap = !controls.state.snap;
  }
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
