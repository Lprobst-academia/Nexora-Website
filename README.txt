NEXORA v4.7 — FULL-SCREEN IPAD DRAG CONTROLS

Replace these two files in the ROOT of your existing GitHub repository:
- Store3D.tsx
- style.css

What changed:
- Touch movement now starts anywhere on the showroom, not only in separate left/right zones.
- Drag left/right to turn the camera.
- Drag up/down to walk forward/backward.
- The old joystick and split touch zones are removed from the rendered UI.
- Buttons, links, game interaction prompt, and navigation controls are excluded from drag handling and remain clickable above the 3D scene.
- Desktop WASD, mouse look, and E interaction remain unchanged.

Do not replace package.json or the GitHub Actions workflow.
