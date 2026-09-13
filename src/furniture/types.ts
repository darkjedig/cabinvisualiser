import * as THREE from "three";

export type FurnitureKind = "furniture" | "prop";
export type Mount = "floor" | "wall";

export interface ResizeSpec {
  widthMin: number;
  widthMax: number;
  widthStep: number;
  depthMin?: number;
  depthMax?: number;
  depthStep?: number;
}

export interface FurnitureDef {
  id: string;
  name: string;
  width: number;
  depth: number;
  height: number;
  group: THREE.Group;
  kind: FurnitureKind;
  spawned: boolean;
  lift: boolean;
  mount: Mount;
  resize?: ResizeSpec;
  rebuild?: () => void;
}

export function markFurniture(
  group: THREE.Group,
  def: Omit<FurnitureDef, "group" | "kind" | "spawned" | "lift" | "mount"> & {
    kind?: FurnitureKind;
    spawned?: boolean;
    lift?: boolean;
    mount?: Mount;
    resize?: ResizeSpec;
    rebuild?: () => void;
  },
): FurnitureDef {
  const kind = def.kind ?? "furniture";
  const spawned = def.spawned ?? false;
  const lift = def.lift ?? false;
  const mount = def.mount ?? "floor";
  group.name = def.id;
  group.userData = {
    furnitureId: def.id,
    label: def.name,
    width: def.width,
    depth: def.depth,
    height: def.height,
    selectable: true,
    kind,
    spawned,
    lift,
    mount,
  };
  return { ...def, kind, spawned, lift, mount, group };
}

export function clearMeshes(group: THREE.Group): void {
  const children = [...group.children];
  for (const child of children) {
    group.remove(child);
    child.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.geometry.dispose();
      }
    });
  }
}

export function snapSize(value: number, min: number, max: number, step: number): number {
  const snapped = Math.round(value / step) * step;
  return Math.min(max, Math.max(min, snapped));
}

export function canLift(item: FurnitureDef): boolean {
  return item.lift || item.kind === "prop";
}

export function roundedBox(
  w: number,
  h: number,
  d: number,
  radius: number,
  material: THREE.Material,
): THREE.Mesh {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.radius = radius;
  return mesh;
}
