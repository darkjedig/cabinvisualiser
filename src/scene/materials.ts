import * as THREE from "three";

function grain(ctx: CanvasRenderingContext2D, w: number, h: number, base: string, dark: string): void {
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 90; i += 1) {
    const y = (i / 90) * h + (Math.sin(i * 1.7) * 3);
    ctx.strokeStyle = dark;
    ctx.globalAlpha = 0.08 + (i % 5) * 0.015;
    ctx.lineWidth = i % 7 === 0 ? 3 : 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x < w; x += 8) {
      ctx.lineTo(x, y + Math.sin(x * 0.04 + i) * 2.2);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 0.12;
  for (let k = 0; k < 40; k += 1) {
    ctx.fillStyle = dark;
    ctx.beginPath();
    ctx.ellipse(Math.random() * w, Math.random() * h, 4 + Math.random() * 8, 2, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function canvasTexture(draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void, w = 512, h = 512): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("2D canvas context unavailable");
  }
  draw(ctx, w, h);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function createMaterials(): {
  spruce: THREE.MeshStandardMaterial;
  spruceVertical: THREE.MeshStandardMaterial;
  spruceFloor: THREE.MeshStandardMaterial;
  spruceRoof: THREE.MeshStandardMaterial;
  felt: THREE.MeshStandardMaterial;
  glass: THREE.MeshPhysicalMaterial;
  upvc: THREE.MeshStandardMaterial;
  charcoal: THREE.MeshStandardMaterial;
  metal: THREE.MeshStandardMaterial;
  blackPad: THREE.MeshStandardMaterial;
  white: THREE.MeshStandardMaterial;
  oak: THREE.MeshStandardMaterial;
  darkCab: THREE.MeshStandardMaterial;
  teal: THREE.MeshStandardMaterial;
  lavender: THREE.MeshStandardMaterial;
  screen: THREE.MeshStandardMaterial;
  grass: THREE.MeshStandardMaterial;
  patio: THREE.MeshStandardMaterial;
  chrome: THREE.MeshStandardMaterial;
  glossWhite: THREE.MeshPhysicalMaterial;
  glossBlack: THREE.MeshPhysicalMaterial;
  led: THREE.MeshStandardMaterial;
  glassClear: THREE.MeshPhysicalMaterial;
  bottleGreen: THREE.MeshPhysicalMaterial;
  bottleBrown: THREE.MeshPhysicalMaterial;
  bottleClear: THREE.MeshPhysicalMaterial;
  liquidAmber: THREE.MeshStandardMaterial;
  liquidWine: THREE.MeshStandardMaterial;
  cork: THREE.MeshStandardMaterial;
  galvanised: THREE.MeshStandardMaterial;
  jumboGrey: THREE.MeshStandardMaterial;
  applianceWhite: THREE.MeshStandardMaterial;
  plasticBlack: THREE.MeshStandardMaterial;
  dispose: () => void;
} {
  const spruceMap = canvasTexture((ctx, w, h) => {
    grain(ctx, w, h, "#d8c4a4", "#8a6f4c");
    for (let y = 0; y < h; y += 64) {
      ctx.fillStyle = "rgba(90, 68, 42, 0.28)";
      ctx.fillRect(0, y, w, 4);
    }
  });
  spruceMap.repeat.set(2, 8);

  const spruceVerticalMap = canvasTexture((ctx, w, h) => {
    grain(ctx, w, h, "#e2d0b4", "#9a7a52");
    for (let x = 0; x < w; x += 42) {
      ctx.fillStyle = "rgba(90, 68, 42, 0.32)";
      ctx.fillRect(x, 0, 3, h);
      ctx.fillStyle = "rgba(255, 245, 220, 0.12)";
      ctx.fillRect(x + 4, 0, 1, h);
    }
  });
  spruceVerticalMap.repeat.set(10, 3);

  const floorMap = canvasTexture((ctx, w, h) => {
    grain(ctx, w, h, "#cbb089", "#7a5a38");
    for (let x = 0; x < w; x += 48) {
      ctx.fillStyle = "rgba(70, 50, 28, 0.22)";
      ctx.fillRect(x, 0, 2, h);
    }
  });
  floorMap.repeat.set(12, 8);

  const oakMap = canvasTexture((ctx, w, h) => grain(ctx, w, h, "#b88854", "#6a4424"));
  oakMap.repeat.set(2, 1);

  const spruce = new THREE.MeshStandardMaterial({
    map: spruceMap,
    roughness: 0.82,
    metalness: 0.02,
    color: "#e8d3b0",
  });

  const spruceVertical = new THREE.MeshStandardMaterial({
    map: spruceVerticalMap,
    roughness: 0.78,
    metalness: 0.02,
    color: "#eddcc0",
  });

  const spruceFloor = new THREE.MeshStandardMaterial({
    map: floorMap,
    roughness: 0.55,
    metalness: 0.04,
    color: "#e4cba6",
  });

  const spruceRoof = new THREE.MeshStandardMaterial({
    color: "#efe6d4",
    roughness: 0.78,
    metalness: 0.02,
  });

  const felt = new THREE.MeshStandardMaterial({
    color: "#3d3d40",
    roughness: 0.92,
    metalness: 0.04,
  });

  const glass = new THREE.MeshPhysicalMaterial({
    color: "#b8d4e8",
    transmission: 0.86,
    roughness: 0.04,
    metalness: 0,
    thickness: 0.02,
    ior: 1.5,
    transparent: true,
    opacity: 0.28,
    envMapIntensity: 1.2,
    side: THREE.DoubleSide,
  });

  const upvc = new THREE.MeshStandardMaterial({
    color: "#2f3236",
    roughness: 0.35,
    metalness: 0.08,
  });

  const charcoal = new THREE.MeshStandardMaterial({
    color: "#2c2d31",
    roughness: 0.88,
    metalness: 0,
  });

  const metal = new THREE.MeshStandardMaterial({
    color: "#1a1b1d",
    roughness: 0.42,
    metalness: 0.55,
  });

  const blackPad = new THREE.MeshStandardMaterial({
    color: "#111111",
    roughness: 0.7,
    metalness: 0,
  });

  const white = new THREE.MeshStandardMaterial({
    color: "#f3f0ea",
    roughness: 0.55,
    metalness: 0,
  });

  const oak = new THREE.MeshStandardMaterial({
    map: oakMap,
    roughness: 0.6,
    metalness: 0.04,
    color: "#c99662",
  });

  const darkCab = new THREE.MeshStandardMaterial({
    color: "#1e1c1a",
    roughness: 0.48,
    metalness: 0.08,
  });

  const teal = new THREE.MeshStandardMaterial({
    color: "#1f5c66",
    roughness: 0.45,
    metalness: 0,
  });

  const lavender = new THREE.MeshStandardMaterial({
    color: "#b79bb0",
    roughness: 0.4,
    metalness: 0,
  });

  const screen = new THREE.MeshStandardMaterial({
    color: "#0b1220",
    roughness: 0.22,
    metalness: 0.4,
    emissive: "#102030",
    emissiveIntensity: 0.35,
  });

  const grass = new THREE.MeshStandardMaterial({
    color: "#4a6b3a",
    roughness: 1,
    metalness: 0,
  });

  const patio = new THREE.MeshStandardMaterial({
    color: "#9aa0a4",
    roughness: 0.85,
    metalness: 0.05,
  });

  const chrome = new THREE.MeshStandardMaterial({
    color: "#c5c8cc",
    roughness: 0.18,
    metalness: 0.85,
  });

  const glossWhite = new THREE.MeshPhysicalMaterial({
    color: "#f4f6f8",
    roughness: 0.12,
    metalness: 0.08,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
  });

  const glossBlack = new THREE.MeshPhysicalMaterial({
    color: "#141518",
    roughness: 0.16,
    metalness: 0.18,
    clearcoat: 0.85,
    clearcoatRoughness: 0.1,
  });

  const led = new THREE.MeshStandardMaterial({
    color: "#7fe7ff",
    emissive: "#3ad4ff",
    emissiveIntensity: 2.4,
    roughness: 0.3,
    metalness: 0,
  });

  const glassClear = new THREE.MeshPhysicalMaterial({
    color: "#e8f4ff",
    transmission: 0.92,
    roughness: 0.04,
    metalness: 0,
    thickness: 0.008,
    ior: 1.5,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide,
  });

  const bottleGreen = new THREE.MeshPhysicalMaterial({
    color: "#1f4a32",
    transmission: 0.35,
    roughness: 0.12,
    metalness: 0.05,
    thickness: 0.012,
    transparent: true,
    opacity: 0.72,
    side: THREE.DoubleSide,
  });

  const bottleBrown = new THREE.MeshPhysicalMaterial({
    color: "#5a3214",
    transmission: 0.22,
    roughness: 0.18,
    metalness: 0.04,
    thickness: 0.012,
    transparent: true,
    opacity: 0.82,
    side: THREE.DoubleSide,
  });

  const bottleClear = new THREE.MeshPhysicalMaterial({
    color: "#dfe8f0",
    transmission: 0.7,
    roughness: 0.06,
    metalness: 0.02,
    thickness: 0.01,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
  });

  const liquidAmber = new THREE.MeshStandardMaterial({
    color: "#c47a22",
    roughness: 0.25,
    metalness: 0.02,
    transparent: true,
    opacity: 0.85,
  });

  const liquidWine = new THREE.MeshStandardMaterial({
    color: "#6b1024",
    roughness: 0.28,
    metalness: 0.02,
    transparent: true,
    opacity: 0.88,
  });

  const cork = new THREE.MeshStandardMaterial({
    color: "#c4a06a",
    roughness: 0.9,
    metalness: 0,
  });

  const galvanised = new THREE.MeshStandardMaterial({
    color: "#4a4e52",
    roughness: 0.38,
    metalness: 0.72,
  });

  const jumboGrey = new THREE.MeshStandardMaterial({
    color: "#6d6f74",
    roughness: 0.92,
    metalness: 0,
  });

  const applianceWhite = new THREE.MeshStandardMaterial({
    color: "#f3f4f6",
    roughness: 0.28,
    metalness: 0.08,
  });

  const plasticBlack = new THREE.MeshStandardMaterial({
    color: "#1a1a1c",
    roughness: 0.55,
    metalness: 0.04,
  });

  const maps = [spruceMap, spruceVerticalMap, floorMap, oakMap];

  return {
    spruce,
    spruceVertical,
    spruceFloor,
    spruceRoof,
    felt,
    glass,
    upvc,
    charcoal,
    metal,
    blackPad,
    white,
    oak,
    darkCab,
    teal,
    lavender,
    screen,
    grass,
    patio,
    chrome,
    glossWhite,
    glossBlack,
    led,
    glassClear,
    bottleGreen,
    bottleBrown,
    bottleClear,
    liquidAmber,
    liquidWine,
    cork,
    galvanised,
    jumboGrey,
    applianceWhite,
    plasticBlack,
    dispose: () => {
      for (const map of maps) {
        map.dispose();
      }
      spruce.dispose();
      spruceVertical.dispose();
      spruceFloor.dispose();
      spruceRoof.dispose();
      felt.dispose();
      glass.dispose();
      upvc.dispose();
      charcoal.dispose();
      metal.dispose();
      blackPad.dispose();
      white.dispose();
      oak.dispose();
      darkCab.dispose();
      teal.dispose();
      lavender.dispose();
      screen.dispose();
      grass.dispose();
      patio.dispose();
      chrome.dispose();
      glossWhite.dispose();
      glossBlack.dispose();
      led.dispose();
      glassClear.dispose();
      bottleGreen.dispose();
      bottleBrown.dispose();
      bottleClear.dispose();
      liquidAmber.dispose();
      liquidWine.dispose();
      cork.dispose();
      galvanised.dispose();
      jumboGrey.dispose();
      applianceWhite.dispose();
      plasticBlack.dispose();
    },
  };
}

export type Materials = ReturnType<typeof createMaterials>;
