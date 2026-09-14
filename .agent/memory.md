# Agent memory

## Current objective

Interactive 1:1 visualiser so the owner can test the same real furniture in several garden cabins.

## Technical architecture

- Vite + TypeScript + Three.js
- Cabin catalog in `src/cabin/catalog.ts` (Terminator, Dojo E 18×10, Fraya 5×4, Birkdale 20×10, UDPATIO 8×8 metal)
- Furniture sizes from dimensions.txt — never scaled to fit
- Drag / rotate on the XZ plane, 5 cm snap, wall clamp, roof height warning
- Any piece can be raised / lowered (PgUp/PgDn or Height +/−) to stack; hangable shelves still snap to walls

## Recent progress

- Every furniture piece and prop can now be raised or lowered so items can stack
- Added Indian mango console (53 × 17.5 × 31.5 in) and matching coffee table (49 × 24.5 × 18 in)
- Rebuilt the Dojo E with wrap-around front-left floor-to-ceiling glass, timber frames, vertical cladding, and a front deck
- Added layer toggles (furniture / walls / roof / deck) and per-piece hide (eye button, Hide, or H)
- Added spawnable L-bar, four shelf sizes, bottles and glasses (place on the selected bar/shelf, lift with PgUp/PgDn)
- Wall shelves snap-resize; cube/low shelves hang and move up the wall; L-bar long run/return snap so the mini fridge always fits
- Added log-cabin L-bar (160 × 60 × 110 cm) with interlocking timber, slab top, beer taps and optics
- Added Redlands 20×10 Birkdale: reverse-apex roof, half-glazed timber doors, 44mm logs, wrap-around front-left window
- Added UDPATIO 8×8 galvanized metal shed, RestNest Viva sofa bed, Addis 4-tier plastic shelf, and standard washer/dryer

## Known issues

- Piece-to-piece overlap is allowed so the user can experiment
- Layout is not persisted yet
- Switching cabins keeps piece positions and only clamps them to the new walls

## Next steps

- Optional save/load of layouts
- Optional overlap warnings
