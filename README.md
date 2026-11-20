# Nexora Arcade — 3D Game Store Prototype

A React + TypeScript + Vite + Three.js virtual game-store prototype.

## Features
- Walkable 3D showroom with smooth keyboard movement and touch controls
- Press **E** near a display to open its game details
- Six individual mini demos, one for each starter game
- Demo checkout and a persistent “My Games” library (local browser storage)
- Store builder with editable store identity, theme, game listings, cover uploads and centrepiece logo upload
- Responsive layouts for desktop, iPad and phones

## Run locally

```bash
npm install
npm run dev
```

## Publish
The Vite base path is configured for the GitHub Pages repository `/Nexora-Website/`. The existing GitHub Actions workflow builds and deploys the site on pushes to `main`.

## Prototype limitations
- Checkout is simulated; no real payment is collected.
- Purchased games are stored in the current browser only, not in a shared account/backend.
- Uploaded images and store customizations are stored in browser local storage.
- Starter game demos are small original mini-game prototypes, not the full games.
