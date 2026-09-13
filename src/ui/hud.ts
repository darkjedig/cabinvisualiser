import { CABINS, FURNITURE } from "../config";
import type { CabinSpec } from "../cabin/types";
import { ADD_CATALOG, type AddKind, type AddSpec } from "../furniture/add-catalog";
import { canLift, type FurnitureDef } from "../furniture/types";
import type { NudgeAxis } from "../interaction/furniture-controls";

export type LayerFlag = "roof" | "snap" | "walls" | "deck" | "furniture";

export interface InventoryPiece {
  id: string;
  label: string;
  size: string;
  removable?: boolean;
}

export interface HudHandle {
  root: HTMLElement;
  setSelection: (item: FurnitureDef | null, extras?: { ceilingHit?: boolean }) => void;
  setCabin: (cabin: CabinSpec) => void;
  setPieceHidden: (id: string, hidden: boolean) => void;
  setLayer: (flag: Exclude<LayerFlag, "snap">, on: boolean) => void;
  addPiece: (piece: InventoryPiece) => void;
  removePiece: (id: string) => void;
  onSelectId: (handler: (id: string) => void) => void;
  onView: (handler: (view: string) => void) => void;
  onToggle: (handler: (flag: LayerFlag) => void) => void;
  onCabin: (handler: (id: string) => void) => void;
  onPieceVisible: (handler: (id: string, visible: boolean) => void) => void;
  onHideSelected: (handler: () => void) => void;
  onAdd: (handler: (kind: AddKind) => void) => void;
  onRemove: (handler: (id: string) => void) => void;
  onNudge: (handler: (axis: NudgeAxis, dir: number) => void) => void;
}

function cm(metres: number): string {
  return `${Math.round(metres * 100)} cm`;
}

let shownCabin: CabinSpec | null = null;

function fillCabinSpec(cabin: CabinSpec): void {
  shownCabin = cabin;
  const eyebrow = document.getElementById("cabin-brand");
  const title = document.getElementById("cabin-title");
  const spec = document.getElementById("cabin-spec");
  const note = document.getElementById("cabin-note");
  if (eyebrow) {
    eyebrow.textContent = cabin.brand;
  }
  if (title) {
    title.innerHTML = `${cabin.name}<br>${cabin.sizeLabel}`;
  }
  if (spec) {
    spec.innerHTML = `
      <div><dt>Internal</dt><dd>${cabin.internalWidth.toFixed(2)} × ${cabin.internalDepth.toFixed(2)} m</dd></div>
      <div><dt>External</dt><dd>${cabin.externalWidth.toFixed(2)} × ${cabin.externalDepth.toFixed(2)} m</dd></div>
      <div><dt>Eaves</dt><dd>${
        cabin.roofStyle === "pent"
          ? `front ${cabin.eavesFront.toFixed(2)} m · back ${cabin.eavesBack.toFixed(2)} m`
          : `${cabin.eavesFront.toFixed(2)} m · ${cabin.roofStyle === "reverse-apex" ? "reverse apex" : "apex"}`
      }</dd></div>
      <div><dt>Ridge</dt><dd>${cabin.ridgeHeight.toFixed(2)} m</dd></div>
    `;
  }
  if (note) {
    note.textContent = cabin.note;
  }
  for (const button of document.querySelectorAll<HTMLButtonElement>("[data-cabin]")) {
    button.classList.toggle("on", button.dataset.cabin === cabin.id);
  }
}

const STARTER: InventoryPiece[] = [
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

function addGroupsHtml(): string {
  const groups: Array<AddSpec["group"]> = ["Living", "Bar", "Shelves", "Laundry", "Drinks"];
  return groups
    .map((group) => {
      const items = ADD_CATALOG.filter((entry) => entry.group === group);
      return `<p class="add-label">${group}</p><div class="add-grid">${items
        .map(
          (entry) =>
            `<button type="button" data-add="${entry.kind}"><span>${entry.label}</span><small>${entry.size}</small></button>`,
        )
        .join("")}</div>`;
    })
    .join("");
}

function makeRow(piece: InventoryPiece): HTMLLIElement {
  const li = document.createElement("li");
  li.className = "inv-row";
  li.dataset.id = piece.id;
  li.innerHTML = `
    <button type="button" data-id="${piece.id}"><span>${piece.label}</span><small>${piece.size}</small></button>
    <button type="button" class="vis on" data-vis="${piece.id}" title="Hide ${piece.label}" aria-label="Hide ${piece.label}">◉</button>
    ${piece.removable ? `<button type="button" class="remove" data-remove="${piece.id}" title="Remove">×</button>` : ""}
  `;
  return li;
}

export function createHud(initial: CabinSpec): HudHandle {
  const root = document.getElementById("hud");
  if (!root) {
    throw new Error("Missing #hud");
  }

  root.innerHTML = `
    <aside class="panel panel-left">
      <p class="eyebrow" id="cabin-brand">${initial.brand}</p>
      <h1 id="cabin-title">${initial.name}<br>${initial.sizeLabel}</h1>
      <div class="cabin-switch" id="cabin-switch">
        ${CABINS.map(
          (cabin) =>
            `<button type="button" data-cabin="${cabin.id}" class="${cabin.id === initial.id ? "on" : ""}">${cabin.name}<small>${cabin.sizeLabel}</small></button>`,
        ).join("")}
      </div>
      <dl class="spec" id="cabin-spec"></dl>
      <p class="note" id="cabin-note"></p>
      <h2>Add</h2>
      <div class="add-catalog" id="add-catalog">${addGroupsHtml()}</div>
      <h2>Layers</h2>
      <div class="layers" id="layers">
        <button type="button" data-toggle="furniture" class="on">Furniture</button>
        <button type="button" data-toggle="walls" class="on">Walls</button>
        <button type="button" data-toggle="roof" class="on">Roof</button>
        <button type="button" data-toggle="deck" class="on">Deck</button>
      </div>
      <h2>Pieces</h2>
      <ul class="inventory" id="inventory"></ul>
    </aside>
    <aside class="panel panel-right" id="inspect">
      <p class="eyebrow">Selected</p>
      <h2 id="sel-name">Nothing</h2>
      <p id="sel-dims" class="dims">Click a piece to move it.</p>
      <p id="sel-warn" class="warn hidden"></p>
      <div id="sel-tools" class="sel-tools hidden">
        <div class="nudge-row hidden" id="nudge-y">
          <span>Height</span>
          <div class="nudge-btns">
            <button type="button" data-nudge="y" data-dir="-1">−</button>
            <button type="button" data-nudge="y" data-dir="1">+</button>
          </div>
        </div>
        <div class="nudge-row hidden" id="nudge-w">
          <span id="nudge-w-label">Length</span>
          <div class="nudge-btns">
            <button type="button" data-nudge="w" data-dir="-1">−</button>
            <button type="button" data-nudge="w" data-dir="1">+</button>
          </div>
        </div>
        <div class="nudge-row hidden" id="nudge-d">
          <span id="nudge-d-label">Return</span>
          <div class="nudge-btns">
            <button type="button" data-nudge="d" data-dir="-1">−</button>
            <button type="button" data-nudge="d" data-dir="1">+</button>
          </div>
        </div>
      </div>
      <button type="button" id="hide-selected" class="ghost hidden">Hide piece · H</button>
      <button type="button" id="remove-selected" class="ghost hidden">Remove · Del</button>
    </aside>
    <div class="toolbar">
      <button type="button" data-view="corner">Corner</button>
      <button type="button" data-view="top">Plan</button>
      <button type="button" data-view="front">Glazing</button>
      <button type="button" data-view="orbit">Orbit</button>
      <button type="button" data-toggle="snap" class="on">Snap 5 cm</button>
    </div>
    <p class="hint">Drag to move · Q / E rotate · R 90° · PgUp / PgDn height · , / . length · H hide · Del extras</p>
  `;

  fillCabinSpec(initial);

  const inventory = root.querySelector("#inventory");
  if (!(inventory instanceof HTMLElement)) {
    throw new Error("Missing inventory");
  }

  const hiddenPieces = new Set<string>();

  for (const piece of STARTER) {
    inventory.append(makeRow(piece));
  }

  let selectHandler: ((id: string) => void) | undefined;
  let viewHandler: ((view: string) => void) | undefined;
  let toggleHandler: ((flag: LayerFlag) => void) | undefined;
  let cabinHandler: ((id: string) => void) | undefined;
  let pieceVisibleHandler: ((id: string, visible: boolean) => void) | undefined;
  let hideSelectedHandler: (() => void) | undefined;
  let addHandler: ((kind: AddKind) => void) | undefined;
  let removeHandler: ((id: string) => void) | undefined;
  let nudgeHandler: ((axis: NudgeAxis, dir: number) => void) | undefined;

  const markPiece = (id: string, hidden: boolean): void => {
    if (hidden) {
      hiddenPieces.add(id);
    } else {
      hiddenPieces.delete(id);
    }
    const row = inventory.querySelector<HTMLElement>(`.inv-row[data-id="${id}"]`);
    const vis = inventory.querySelector<HTMLButtonElement>(`button[data-vis="${id}"]`);
    row?.classList.toggle("dimmed", hidden);
    if (vis) {
      vis.classList.toggle("on", !hidden);
      vis.textContent = hidden ? "○" : "◉";
      vis.title = hidden ? "Show piece" : "Hide piece";
    }
  };

  inventory.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const remove = target.closest("button[data-remove]");
    if (remove instanceof HTMLButtonElement && remove.dataset.remove) {
      removeHandler?.(remove.dataset.remove);
      return;
    }
    const vis = target.closest("button[data-vis]");
    if (vis instanceof HTMLButtonElement && vis.dataset.vis) {
      const id = vis.dataset.vis;
      const nextHidden = !hiddenPieces.has(id);
      markPiece(id, nextHidden);
      pieceVisibleHandler?.(id, !nextHidden);
      return;
    }
    const button = target.closest("button[data-id]");
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }
    const id = button.dataset.id;
    if (id) {
      if (hiddenPieces.has(id)) {
        markPiece(id, false);
        pieceVisibleHandler?.(id, true);
      }
      selectHandler?.(id);
    }
  });

  root.querySelector("#add-catalog")?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const button = target.closest("button[data-add]");
    if (!(button instanceof HTMLButtonElement) || !button.dataset.add) {
      return;
    }
    addHandler?.(button.dataset.add as AddKind);
  });

  root.querySelector("#cabin-switch")?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const button = target.closest("button[data-cabin]");
    if (!(button instanceof HTMLButtonElement) || !button.dataset.cabin) {
      return;
    }
    cabinHandler?.(button.dataset.cabin);
  });

  root.querySelector("#sel-tools")?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement) || !target.dataset.nudge) {
      return;
    }
    const axis = target.dataset.nudge as NudgeAxis;
    const dir = Number(target.dataset.dir);
    if (dir === 1 || dir === -1) {
      nudgeHandler?.(axis, dir);
    }
  });
  root.querySelector("#hide-selected")?.addEventListener("click", () => {
    hideSelectedHandler?.();
  });
  root.querySelector("#remove-selected")?.addEventListener("click", () => {
    const active = inventory.querySelector("button[data-id].active");
    const id = active instanceof HTMLButtonElement ? active.dataset.id : undefined;
    if (id) {
      removeHandler?.(id);
    }
  });

  const onToggleClick = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement) || !target.dataset.toggle) {
      return;
    }
    const flag = target.dataset.toggle as LayerFlag;
    target.classList.toggle("on");
    toggleHandler?.(flag);
  };

  root.querySelector("#layers")?.addEventListener("click", onToggleClick);
  root.querySelector(".toolbar")?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }
    if (target.dataset.view) {
      viewHandler?.(target.dataset.view);
    }
    if (target.dataset.toggle) {
      onToggleClick(event);
    }
  });

  return {
    root,
    setCabin: (cabin) => {
      fillCabinSpec(cabin);
    },
    setPieceHidden: (id, hidden) => {
      markPiece(id, hidden);
    },
    setLayer: (flag, on) => {
      const button = root.querySelector<HTMLButtonElement>(`[data-toggle="${flag}"]`);
      button?.classList.toggle("on", on);
    },
    addPiece: (piece) => {
      inventory.append(makeRow(piece));
    },
    removePiece: (id) => {
      hiddenPieces.delete(id);
      inventory.querySelector(`.inv-row[data-id="${id}"]`)?.remove();
    },
    setSelection: (item, extras) => {
      const name = document.getElementById("sel-name");
      const dims = document.getElementById("sel-dims");
      const warn = document.getElementById("sel-warn");
      const hide = document.getElementById("hide-selected");
      const remove = document.getElementById("remove-selected");
      const tools = document.getElementById("sel-tools");
      const nudgeY = document.getElementById("nudge-y");
      const nudgeW = document.getElementById("nudge-w");
      const nudgeD = document.getElementById("nudge-d");
      const wLabel = document.getElementById("nudge-w-label");
      const dLabel = document.getElementById("nudge-d-label");
      if (!(name && dims && warn && hide && remove && tools && nudgeY && nudgeW && nudgeD && wLabel && dLabel)) {
        return;
      }
      if (!item) {
        name.textContent = "Nothing";
        dims.textContent = "Click a piece to move it.";
        warn.classList.add("hidden");
        hide.classList.add("hidden");
        remove.classList.add("hidden");
        tools.classList.add("hidden");
        for (const button of inventory.querySelectorAll("button[data-id]")) {
          button.classList.remove("active");
        }
        return;
      }
      const deg = Math.round((item.group.rotation.y * 180) / Math.PI) % 360;
      name.textContent = item.name;
      const heightNote = canLift(item) ? `  ·  ${Math.round(item.group.position.y * 100)} cm off floor` : "";
      dims.textContent = `${cm(item.width)} × ${cm(item.depth)} × ${cm(item.height)}  ·  ${item.group.position.x.toFixed(2)}, ${item.group.position.z.toFixed(2)} m  ·  ${deg}°${heightNote}`;
      hide.classList.remove("hidden");
      remove.classList.toggle("hidden", !item.spawned);
      const showLift = canLift(item);
      const showWidth = Boolean(item.resize);
      const showDepth = Boolean(item.resize?.depthStep);
      tools.classList.toggle("hidden", !showLift && !showWidth);
      nudgeY.classList.toggle("hidden", !showLift);
      nudgeW.classList.toggle("hidden", !showWidth);
      nudgeD.classList.toggle("hidden", !showDepth);
      const isBar = Boolean(item.resize?.depthMin && item.mount !== "wall");
      wLabel.textContent = isBar ? "Long run" : "Width";
      dLabel.textContent = isBar ? "Return" : "Depth";
      if (extras?.ceilingHit) {
        warn.textContent =
          shownCabin?.roofStyle === "pent"
            ? "Too tall for the pent roof here. Slide it toward the glazed front."
            : "Too tall for the roof here. Slide it toward the ridge.";
        warn.classList.remove("hidden");
      } else {
        warn.classList.add("hidden");
      }

      for (const button of inventory.querySelectorAll("button[data-id]")) {
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
    onCabin: (handler) => {
      cabinHandler = handler;
    },
    onPieceVisible: (handler) => {
      pieceVisibleHandler = handler;
    },
    onHideSelected: (handler) => {
      hideSelectedHandler = handler;
    },
    onAdd: (handler) => {
      addHandler = handler;
    },
    onRemove: (handler) => {
      removeHandler = handler;
    },
    onNudge: (handler) => {
      nudgeHandler = handler;
    },
  };
}
