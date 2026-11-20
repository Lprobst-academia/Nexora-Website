NEXORA v4.4 — TRUE 3D LOGO + IPAD LOOK FIX

Replace these files in the same directory as your existing Store3D.tsx:
- Store3D.tsx
- style.css
- nexora-mark.svg (new required asset)

The NEXORA wordmark is now built from extruded vector geometry at runtime with Three.js.
It is not a flat image or a logo printed on a screen. The logo has thickness, bevels,
metallic materials, coloured lighting, and a slow floating/rotating animation. The
separate ring remains behind it as an architectural accent.

The iPad look area now covers the right-hand side of the showroom. Drag anywhere in
that region to rotate the camera. The left-side joystick remains dedicated to movement.

Important: keep nexora-mark.svg beside Store3D.tsx because Store3D imports it with ?raw.
