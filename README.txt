NEXORA v4.6 — TypeScript build fix

Replace the root-level Store3D.tsx with the supplied Store3D.tsx.
Keep nexora-mark.svg in the same root directory as Store3D.tsx.

Why: App.tsx and Dashboard.tsx pass a `logo` prop to Store3D, but the
Store3D Props type did not declare it. This update adds the optional prop.
The logo geometry continues to use nexora-mark.svg.

The joystick remains removed. The touch zones remain drag-to-move on the
left and drag-to-look on the right.
