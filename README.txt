NEXORA v4.5 — BUILD FIX + REMOVE JOYSTICK

Replace the existing root-level Store3D.tsx and style.css with these files.
Keep nexora-mark.svg in the SAME directory as Store3D.tsx.

Fixes:
- Imports useTexture from @react-three/drei (it was used but not imported).
- Removes the undefined defaultLogo reference from the Store3D component signature.
- Removes the visible virtual joystick and old D-pad.
- iPad touch movement: drag in the LEFT area to walk.
- iPad camera: drag in the RIGHT area to look around.
- Keyboard movement remains WASD / arrows; E opens the nearby game.

If GitHub Actions still fails, open Actions > failed run > build > expand
'Build' and send the actual TypeScript/Vite error lines. The screenshot showing
only the red failed check does not include the cause.
