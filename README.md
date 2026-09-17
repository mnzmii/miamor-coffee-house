# Miamor Coffee House — Landing Page

Official landing page for Miamor Coffee House. Single-page showcase with WhatsApp-based reservations.

## Sections

- **Hero** — tagline + CTAs
- **Info & Location** — opening hours, address, Google Maps
- **Our Story** — about the brand
- **Private Rooms** — 6 rooms with photo carousel (replace `miamor_logo.jpg` in `public/` for branded navbar)
- **Menu** — link to full menu PDF
- **Reviews** — Google reviews
- **Book a Table** — inline form → WhatsApp

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- Lucide Icons

## Setup

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`.

## Build

```bash
npm run build
```

Output in `dist/` folder.

## Config

Update `MENU_PDF_URL` and `ADMIN_WHATSAPP` in `src/lib/constants.js`.