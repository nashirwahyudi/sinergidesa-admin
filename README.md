# Backend and blockchain connector
Blockchain Connector: https://github.com/nashirwahyudi/bc-connector
Backend App: https://github.com/azuharu/sinergi-desa-backend

# SinergiDesa Dashboard

SinergiDesa is a management dashboard for village farmer cooperatives (*koperasi tani*). It gives cooperative admins a single panel to manage digital weighing transactions, an inter-cooperative marketplace, warehouse inventory, fleet logistics, and member (farmer) records — replacing manual, paper-based, or SMS/WhatsApp-driven coordination between cooperatives.

The UI, labels, and sample data are in Indonesian (Bahasa Indonesia), reflecting the target users.

## Features

- **Beranda (Dashboard)** — key metrics (active transactions, funds held in escrow, active fleet), pending action items, and a live supply/demand board between partner cooperatives.
- **Marketplace** — a catalog of commodities, fertilizer, seeds, and equipment that cooperatives can buy from and sell to each other, with a simulated purchase-to-escrow flow.
- **Stok Barang (Inventory)** — warehouse stock management for commodities, including photos, notes, and last-sync timestamps.
- **Transaksi (Dual-Witness Transactions)** — an escrow-based transaction pipeline where both sender and receiver cooperatives must confirm a shipment (with GPS geotag and photo evidence) before funds are released; includes dispute escalation.
- **Logistik (Logistics)** — real-time fleet monitoring and a backhaul "return trip" matching engine that pairs empty return routes with nearby partner shipping needs to cut fuel costs.
- **Anggota (Members)** — a directory of farmer members with per-member deposit history and production trend cards.
- **Pengaturan (Settings)** — configuration for GPS geotag tolerance, WhatsApp reminder-bot intervals, and SMS auto-correction.

The app ships with an in-memory mock dataset (`src/mockData.ts`) and a role switcher (in the sidebar) to simulate viewing the dashboard as different cooperatives — there is no backend/database wired up yet; all state lives in React `useState`.

## Tech Stack

- [React 19](https://react.dev/) + TypeScript
- [Vite 6](https://vitejs.dev/) for dev server and build
- [Tailwind CSS 4](https://tailwindcss.com/) for styling
- [lucide-react](https://lucide.dev/) for icons, [motion](https://motion.dev/) for animation
- [@google/genai](https://www.npmjs.com/package/@google/genai) (Gemini API client — currently only present as a dependency, no calls wired in yet)

## Prerequisites

- Node.js (v20+ recommended)
- npm

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the example environment file and fill in the values:
   ```bash
   cp .env.example .env
   ```
   | Variable | Description |
   | --- | --- |
   | `GEMINI_API_KEY` | API key for Gemini AI calls. |
   | `APP_URL` | The URL this app is hosted at (used for self-referential links/callbacks). |
3. Run the dev server:
   ```bash
   npm run dev
   ```
   The app runs at `http://localhost:3000` by default.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server on port 3000. |
| `npm run build` | Type-check and build a production bundle to `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run TypeScript in no-emit mode to type-check the project. |
| `npm run clean` | Remove `dist/` and `server.js`. |

## Project Structure

```
src/
├── App.tsx                # Root component: tab routing and top-level state
├── main.tsx                # React entry point
├── types.ts                 # Shared TypeScript types/interfaces
├── mockData.ts               # In-memory seed data for all views
├── index.css                 # Tailwind entry point + global styles
└── components/
    ├── Sidebar.tsx            # Navigation + demo cooperative/role switcher
    ├── Header.tsx              # Page header, notifications panel
    ├── DashboardView.tsx        # "Beranda" overview
    ├── MarketplaceView.tsx       # Inter-cooperative marketplace
    ├── InventoryView.tsx          # Warehouse stock management
    ├── DualWitnessView.tsx         # Escrow transaction confirmation flow
    └── MemberHistoryView.tsx        # Per-member transaction history
```

## Deployment

The project builds to a static bundle served by Nginx (see [Dockerfile](Dockerfile) and [nginx.conf](nginx.conf)):

```bash
docker build -t sinergidesa-admin .
docker run -p 80:80 sinergidesa-admin
```

A GitHub Actions workflow ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) builds and pushes the image to GitHub Container Registry (`ghcr.io`) on every push to `main`, then deploys it to a remote host over SSH using Podman, behind an `nginx-proxy` network with optional Let's Encrypt TLS. It requires these repository secrets: `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`, `VIRTUAL_HOST`, and optionally `LETSENCRYPT_HOST`/`LETSENCRYPT_EMAIL`.
