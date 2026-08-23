import * as THREE from "three";

export interface FurnitureDef {
  id: string;
  name: string;
  width: number;
  depth: number;
  height: number;
  group: THREE.Group;
}

export function markFurniture(group: THREE.Group, def: Omit<FurnitureDef, "group">): FurnitureDef {
  group.name = def.id;
  group.userData = {
    furnitureId: def.id,
    label: def.name,
    width: def.width,
    depth: def.depth,
    height: def.height,
    selectable: true,
  };
  return { ...def, group };
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
