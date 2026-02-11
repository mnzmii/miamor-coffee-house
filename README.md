# Miamor Coffee House — Reservation & QR-Order System

A full-stack web application for managing private room reservations and QR-based walk-in orders for Miamor Coffee House.

## Features

- **Customer Booking**: Mobile-first reservation system with food pre-ordering
- **QR Walk-in**: Scan QR codes in rooms for instant ordering
- **Staff Dashboard**: Real-time order management with room assignment
- **Kitchen Board**: Live prep board with countdown timers and urgency indicators
- **Room Management**: Dynamic room configuration (add/edit/delete)
- **WhatsApp Integration**: Automated confirmation messages
- **Loyverse POS Sync**: Optional integration with Loyverse point-of-sale

## Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Lucide Icons
- **Backend/Database**: Supabase (PostgreSQL with Real-time)
- **POS Integration**: Loyverse API v1.0
- **Notifications**: WhatsApp Web Links

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env` and add your credentials:
   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Run the migration in Supabase SQL Editor:
   - Copy all content from `supabase/migration.sql`
   - Paste in SQL Editor and click **Run**

### 3. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Customer booking page |
| `/?roomId=duo` | QR walk-in (auto-assigns room) |
| `/staff` | Staff dashboard |
| `/staff/rooms` | Room management |
| `/kitchen` | Kitchen prep board |

## Database Schema

- **rooms**: Room configurations (name, capacity, tables, combinable)
- **menu_items**: Food/drink menu with Loyverse variant IDs
- **reservations**: Customer bookings with status tracking
- **reservation_items**: Order line items

## Deployment

### Vercel/Netlify (Frontend)
```bash
npm run build
```
Deploy the `dist/` folder.

### Supabase Edge Functions (Loyverse Sync)
```bash
supabase functions deploy sync-loyverse
supabase secrets set LOYVERSE_API_TOKEN=your-token
```

## License

MIT
