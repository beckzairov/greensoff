# Agricultural models

Three original, editable models were created in Blender 4.5.13 LTS for this site:

| Model     | Contents                                                        | Browser asset           | Editable source                 |
| --------- | --------------------------------------------------------------- | ----------------------- | ------------------------------- |
| Soil      | Cultivated ridges, soil strata, mineral inclusions              | `/models/soil.glb`      | `design/models/soil.blend`      |
| Water     | HDPE pipe, blue compression fittings, valve, gauge, drip outlet | `/models/water.glb`     | `design/models/water.blend`     |
| Nutrition | Open woven fertilizer sack, NPK lettering, loose granules       | `/models/nutrition.glb` | `design/models/nutrition.blend` |

These are illustrative models, not specifications or depictions of named commercial
products. All subjects are inanimate. Geometry, material textures, and lettering
were created for this project; no third-party model or texture is embedded.

## Build

Run `blender --background --python scripts/models/build_models.py` from the project
root. Blender is a build-time authoring tool only; users do not need it installed.
The script exports GLB files with embedded textures, saves editable Blender scenes,
and renders PNG previews. Convert the PNG previews to WebP for the viewer using
Sharp, as in `scripts/models/prepare-posters.cjs`.

The Blender download came from the official release directory:
https://download.blender.org/release/Blender4.5/

## Viewer

`app/content/models.js` maps each selection to its GLB and poster.
`app/lib/materialViewer.js` owns loading, camera controls, studio lighting, frame
scheduling, model caching, and resource disposal. `MaterialScene.jsx` provides
React lifecycle and accessible controls. Assets load only near the viewport and
only for the selected model. Subsequent visits reuse the loaded model.

The starting camera shows a three-quarter view. Dragging rotates it; buttons
provide keyboard-accessible rotation, zoom, and reset. Wheel zoom is disabled so
normal page scrolling is retained. Idle motion respects the global motion toggle,
stops after user interaction, and stops offscreen or in a background tab. Each
subject has its own static rendered fallback if WebGL or model loading fails.

## Research and decision

Searches of GitHub and model libraries found agricultural assets, but not a matched
set covering all three subjects. Original Blender modeling was selected to keep
scale, materials, subjects, and editability consistent.

- https://poly.pizza/m/fdQd2Ayb9cU (Fertile soil, Frank Lynam; considered, not used)
- https://poly.pizza/search/agriculture (model catalogue)
- https://github.com/saswatsundar123/CropForge (agricultural visualization reference)
- https://threejs.org/docs/ (GLTFLoader, OrbitControls, rendering APIs)

## Verification

Blender renders were visually reviewed. The exported models were then checked in
the actual website: soil, water, and nutrition selections loaded successfully;
zoom and rotation changed the camera view; controls and model labels were present.
Build and lint checks pass. Earlier abstract torus/orbit geometry is removed.
