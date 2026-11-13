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
