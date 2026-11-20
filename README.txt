NEXORA v4.3 showroom improvements

Replace these two files in the ROOT of your existing GitHub repository:
- Store3D.tsx
- style.css

Do not put them in src/ or components/. This is the flat-root project layout.
Keep your existing App.tsx, package.json, vite.config.ts, logo asset and .github/workflows/deploy.yml.

Changes:
- Centre logo now sits on a metallic 3D backing, with a raised metallic green ring and slow subtle rotation/bobbing. Front and rear faces both show the logo.
- Showroom walls now have a soft architectural panel texture and subtle vertical detailing.
- Mobile movement now uses a large virtual analog joystick on the lower left. Drag in the lower-right pad to look around. Release the joystick to stop.
- Desktop WASD/mouse/E controls remain in place.
