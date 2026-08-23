# Cabin Visualiser

A real-scale Three.js planner for a [Dunster House Terminator 5m × 4m pent log cabin](https://dunsterhouse.co.uk/log-cabins/pent/terminator-log-cabin-w5-0m-x-d4-0m).

Furniture uses the measured sizes in `dimensions.txt`. Nothing is shrunk to make the room look emptier.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Controls

- **Drag** a piece to move it on the floor (5 cm snap)
- **Alt-drag**, **Q / E**, or **[ / ]** to rotate
- **R** snaps rotation by 90°
- Right-drag / scroll to orbit
- **Corner / Plan / Glazing / Orbit** cameras
- **Roof** hides the pent roof so you can place from above

The gym is 2.08 m tall. The roof drops to 1.90 m at the back wall, so the machine only clears in the front half of the cabin. A red box appears if a piece is too tall for that spot.

The TV sits on the [TRIOBLADE 200 × 35 × 45 cm](https://www.amazon.co.uk/TRIOBLADE-Stand-Cabinet-Storage-Entertainment/dp/B0F1TNF48C) high-gloss LED unit. That cabinet is 2 m wide — do not shrink it.

## Room

| | Metric |
| --- | --- |
| Internal | 4.77 × 3.77 m |
| External | 4.99 × 3.99 m |
| Front eaves | 2.30 m |
| Back eaves | 1.90 m |
