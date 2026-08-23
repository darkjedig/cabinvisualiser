# Agent memory

## Current objective

Interactive 1:1 visualiser of the Dunster House Terminator pent log cabin (W5.0m × D4.0m) so the owner can test real furniture in the real room.

## Technical architecture

- Vite + TypeScript + Three.js
- Cabin dimensions from Dunster House product spec (not the 18×10 figures in the original draft of dimensions.txt)
- Furniture sizes from dimensions.txt
- Drag / rotate on the XZ plane, 5 cm snap, wall clamp, pent-roof height warning

## Recent progress

- Built cabin, furniture set, HUD, and interaction
- Replaced the placeholder TV cabinet with the TRIOBLADE 200×35×45 cm high-gloss LED unit
- Default layout keeps the glazed front walkway open and parks the gym in the high-eaves half

## Known issues

- Piece-to-piece overlap is allowed so the user can experiment
- Layout is not persisted yet

## Next steps

- Optional save/load of layouts
- Optional overlap warnings
