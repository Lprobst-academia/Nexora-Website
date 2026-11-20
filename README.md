# NEON ARCADE — Interactive 3D Game Store

A Vite + React + TypeScript prototype for a customizable, walkable 3D game showroom.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

## Demo walkthrough

1. Choose **Enter the store** on the landing page.
2. Click **Enter showroom** to enable pointer lock. Move with WASD, look with the mouse, press E near a game display, and press Escape to release the pointer.
3. Open a game to view its listing, media preview, and demo purchase flow.
4. EVO RACING includes a small keyboard arcade challenge: click **Play demo**, then press Space to boost during the 20-second round.
5. Return to the landing page and open **Store builder**.
6. Change the store name, accent colour, atmosphere, game listings, prices, descriptions and demo availability. The 3D preview updates immediately.

## Notes

- Checkout is simulated. No payment details are collected and no real payment is processed.
- Game artwork uses remote Unsplash images. Replace the image URLs in `src/data.ts` with company-owned assets for a production deployment.
- The trailer area is a designed placeholder; wire company trailer URLs to a video player for a production build.
- This is a front-end demo. Authentication, persistence, asset storage, payment integration and multi-tenant company data are not included.


## Nexora refresh (v2)

This refresh uses a calmer green-and-white interface, clearer spacing and more responsive layouts. The visual direction takes inspiration from StudyPeak's emphasis on clear navigation, structured learning content, visible progress and cross-device usability; it does not copy its branding or assets.

### Mobile showroom controls

- Use the directional pad at the bottom-left to move.
- Drag on the right side of the screen to look around.
- Walk close to a game display and tap **Open**.
- The demo challenge includes an on-screen Boost button for touch devices.

### Persistence

Store name, games, theme and accent colour are saved in the current browser using local storage. This is a front-end demo only; it does not sync between devices or users.

### GitHub Pages

The Vite configuration uses `/Nexora-Website/` as its base path. If you rename the GitHub repository, update the `base` value in `vite.config.ts` to match the new repository path.

### Prototype limitations

Checkout remains simulated, and there is no payment processor, authentication, cloud database or cross-device admin sync.
