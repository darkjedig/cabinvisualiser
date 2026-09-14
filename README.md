# Cabin Visualiser

A real-scale Three.js planner for testing the same furniture in several garden cabins.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Cabins

Pick a building in the left panel. Pieces keep their real sizes.

| Cabin | Internal floor | Notes |
| --- | --- | --- |
| [Dunster House Terminator 5×4](https://dunsterhouse.co.uk/log-cabins/pent/terminator-log-cabin-w5-0m-x-d4-0m) | 4.77 × 3.77 m | Lowest back eaves (1.90 m) |
| [BillyOh Dojo E 18×10](https://www.gardenbuildingsdirect.co.uk/log-cabins/dojo-insulated/38386) | 5.19 × 2.92 m | Wider, only 10 ft deep, wrap-around left glass + deck |
| [BillyOh Fraya 5×4](https://www.gardenbuildingsdirect.co.uk/log-cabins/fraya/30248) | 4.81 × 3.61 m | Central extra-high double doors |
| [Redlands Birkdale 20×10](https://www.sheds.co.uk/redlands-20-x-10-birkdale-log-cabin-44mm.html) | 5.67 × 2.67 m | Reverse apex, 44mm logs, half-glazed doors. Only 8'9" deep |
| [UDPATIO 8×8 metal shed](https://www.amazon.co.uk/dp/B0DFW4CCZJ) | 2.37 × 2.37 m | Galvanized pent. Roof 2.05 m — gym does not fit |

`?cabin=dojo`, `?cabin=fraya`, `?cabin=birkdale`, or `?cabin=udpatio` opens that building directly.

## Controls

- **Drag** a piece to move it on the floor (5 cm snap)
- **Alt-drag**, **Q / E**, or **[ / ]** to rotate
- **R** snaps rotation by 90°
- Right-drag / scroll to orbit
- **Corner / Plan / Glazing / Orbit** cameras
- **Layers** in the left panel hide furniture, walls, roof, or the deck
- **Add** L-bar, log cabin bar, shelves, bottles and glasses from the left panel
- **Mango console** 53 × 17.5 × 31.5 in / 135 × 44 × 80 cm (Living)
- **Mango coffee table** 49 × 24.5 × 18 in / 124 × 62 × 46 cm (Living)
- **RestNest sofa bed** 173 × 100 × 85 cm (Living)
- **Addis 4-tier** plastic shelf 61 × 30 × 130 cm
- **Washer** and **dryer** 60 × 60 × 85 cm each (Laundry)
- **Log cabin bar** 160 × 60 × 110 cm timber L with interlocking logs; Long run / Return snap like the other L-bar
- **Wall shelf** hangs on a wall; **Width / Depth** in the inspect panel snap-resize it
- **Cube 77** and **Low wide 120** hang on a wall when raised
- **L-shaped bar** Long run / Return snap in 5 cm steps; the 46 cm fridge always fits (min 100 cm run)
- **◉** next to a piece (or **H**) hides that piece only
- **×** or **Delete** removes extras you added
- **PgUp / PgDn**, **+ / −**, or **Height** in the inspect panel raises or lowers any piece (5 cm snap, 1 cm for bottles and glasses) so you can stack items. Cube and low shelves still snap to a wall when lifted.

The gym is 2.08 m tall. A red box appears if a piece is too tall for the roof in that spot.

The TV sits on the [TRIOBLADE 200 × 35 × 45 cm](https://www.amazon.co.uk/TRIOBLADE-Stand-Cabinet-Storage-Entertainment/dp/B0F1TNF48C) high-gloss LED unit. That cabinet is 2 m wide — do not shrink it.
