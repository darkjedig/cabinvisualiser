import { CABIN, FURNITURE } from "../config";
import type { FurnitureDef } from "../furniture/types";

export interface HudHandle {
  root: HTMLElement;
  setSelection: (item: FurnitureDef | null, extras?: { ceilingHit?: boolean }) => void;
  onSelectId: (handler: (id: string) => void) => void;
  onView: (handler: (view: string) => void) => void;
  onToggle: (handler: (flag: "roof" | "snap" | "walls") => void) => void;
}

function cm(metres: number): string {
  return `${Math.round(metres * 100)} cm`;
}

export function createHud(): HudHandle {
  const root = document.getElementById("hud");
  if (!root) {
    throw new Error("Missing #hud");
  }

  root.innerHTML = `
    <aside class="panel panel-left">
      <p class="eyebrow">Dunster House</p>
      <h1>Terminator<br>5.0 × 4.0</h1>
      <dl class="spec">
        <div><dt>Internal</dt><dd>${CABIN.internalWidth.toFixed(2)} × ${CABIN.internalDepth.toFixed(2)} m</dd></div>
        <div><dt>External</dt><dd>${CABIN.externalWidth.toFixed(2)} × ${CABIN.externalDepth.toFixed(2)} m</dd></div>
        <div><dt>Eaves</dt><dd>front ${CABIN.eavesFrontBoards.toFixed(2)} m · back ${CABIN.eavesBackBoards.toFixed(2)} m</dd></div>
        <div><dt>Ridge</dt><dd>${CABIN.ridgeHeight.toFixed(2)} m</dd></div>
      </dl>
      <p class="note">Pent roof slopes down to the back wall. The Marcy gym is 208 cm tall — it only clears the ceiling in the front half of the room.</p>
      <h2>Pieces</h2>
      <ul class="inventory" id="inventory"></ul>
    </aside>
    <aside class="panel panel-right" id="inspect">
      <p class="eyebrow">Selected</p>
      <h2 id="sel-name">Nothing</h2>
      <p id="sel-dims" class="dims">Click a piece to move it.</p>
      <p id="sel-warn" class="warn hidden"></p>
    </aside>
    <div class="toolbar">
      <button type="button" data-view="corner">Corner</button>
      <button type="button" data-view="top">Plan</button>
      <button type="button" data-view="front">Glazing</button>
      <button type="button" data-view="orbit">Orbit</button>
      <button type="button" data-toggle="roof">Roof</button>
      <button type="button" data-toggle="snap" class="on">Snap 5 cm</button>
    </div>
    <p class="hint">Drag to move · Alt-drag or Q / E to rotate · R for 90° · Right-drag orbits</p>
  `;

  const inventory = root.querySelector("#inventory");
  if (!(inventory instanceof HTMLElement)) {
    throw new Error("Missing inventory");
  }

  const catalog = [
    { id: "sofa", label: "Corner sofa", size: `${cm(FURNITURE.sofa.width)} × ${cm(FURNITURE.sofa.depth)}` },
    { id: "gym", label: "Marcy gym", size: `${cm(FURNITURE.gym.width)} × ${cm(FURNITURE.gym.depth)} × ${cm(FURNITURE.gym.height)}` },
    { id: "kallax", label: "KALLAX pair", size: `${cm(FURNITURE.kallax.width * 2)} × ${cm(FURNITURE.kallax.depth)}` },
    { id: "tv", label: "TRIOBLADE + 55\"", size: `${cm(FURNITURE.tvUnit.width)} × ${cm(FURNITURE.tvUnit.depth)} × ${cm(FURNITURE.tvUnit.height)}` },
    { id: "desk", label: "Desk", size: `${cm(FURNITURE.desk.width)} × ${cm(FURNITURE.desk.depth)}` },
    { id: "chair", label: "Office chair", size: `${cm(FURNITURE.chair.width)}` },
    { id: "bar", label: "Home bar", size: `${cm(FURNITURE.bar.width)} × ${cm(FURNITURE.bar.depth)}` },
    { id: "stool-1", label: "Stool 1", size: `${cm(FURNITURE.stool.height)} high` },
    { id: "stool-2", label: "Stool 2", size: `${cm(FURNITURE.stool.height)} high` },
    { id: "stool-3", label: "Stool 3", size: `${cm(FURNITURE.stool.height)} high` },
  ];

  for (const piece of catalog) {
    const li = document.createElement("li");
    li.innerHTML = `<button type="button" data-id="${piece.id}"><span>${piece.label}</span><small>${piece.size}</small></button>`;
    inventory.append(li);
  }

  let selectHandler: ((id: string) => void) | undefined;
  let viewHandler: ((view: string) => void) | undefined;
  let toggleHandler: ((flag: "roof" | "snap" | "walls") => void) | undefined;

  inventory.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const button = target.closest("button[data-id]");
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }
    const id = button.dataset.id;
    if (id) {
      selectHandler?.(id);
    }
  });

  root.querySelector(".toolbar")?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }
    if (target.dataset.view) {
      viewHandler?.(target.dataset.view);
    }
    if (target.dataset.toggle === "roof" || target.dataset.toggle === "snap") {
      target.classList.toggle("on");
      toggleHandler?.(target.dataset.toggle);
    }
  });

  return {
    root,
    setSelection: (item, extras) => {
      const name = document.getElementById("sel-name");
      const dims = document.getElementById("sel-dims");
      const warn = document.getElementById("sel-warn");
      if (!(name && dims && warn)) {
        return;
      }
      if (!item) {
        name.textContent = "Nothing";
        dims.textContent = "Click a piece to move it.";
        warn.classList.add("hidden");
        return;
      }
      const deg = Math.round((item.group.rotation.y * 180) / Math.PI) % 360;
      name.textContent = item.name;
      dims.textContent = `${cm(item.width)} × ${cm(item.depth)} × ${cm(item.height)}  ·  ${item.group.position.x.toFixed(2)}, ${item.group.position.z.toFixed(2)} m  ·  ${deg}°`;
      if (extras?.ceilingHit) {
        warn.textContent = "Too tall for the pent roof here. Slide it toward the glazed front.";
        warn.classList.remove("hidden");
      } else {
        warn.classList.add("hidden");
      }

      for (const button of inventory.querySelectorAll("button")) {
        button.classList.toggle("active", button.getAttribute("data-id") === item.id);
      }
    },
    onSelectId: (handler) => {
      selectHandler = handler;
    },
    onView: (handler) => {
      viewHandler = handler;
    },
    onToggle: (handler) => {
      toggleHandler = handler;
    },
  };
}
