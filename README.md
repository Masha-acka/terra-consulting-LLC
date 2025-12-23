# Terra Consulting LLC - Property Listing App

A full-stack property listing application for Terra Consulting LLC (Kenya) with a "Zillow-style" split-view interface.

## Project Structure

```
terra-consulting/
├── client/                    # Next.js 15 Frontend
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   ├── components/       # React components
│   │   └── lib/              # Utilities and API
│   ├── vercel.json           # Vercel deployment config
│   └── package.json
└── server/                    # Node.js + Prisma Backend
    ├── prisma/               # Database schema
    ├── data/                 # SQLite database
    ├── src/                  # Express API
    ├── render.yaml           # Render deployment config
    └── package.json
```

## Quick Start

### 1. Start the Server (Backend)

```bash
cd server
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Server runs on `http://localhost:5000`

### 2. Start the Client (Frontend)

```bash
cd client
npm install
npm run dev
```

Client runs on `http://localhost:3000`

## Environment Variables

### Client (`client/.env.local`)

Create a `.env.local` file in the client folder:

```env
# API URL (use Render URL in production)
NEXT_PUBLIC_API_URL=http://localhost:5000

# Mapbox token (get from https://mapbox.com)
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

# WhatsApp number (country code + number)
NEXT_PUBLIC_WHATSAPP_NUMBER=254700000000
```

### Server (`server/.env`)

The server `.env` is already configured:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL="file:./data/dev.db"
ALLOWED_ORIGINS="http://localhost:3000"
```

## Deployment

### Deploy Client to Vercel

1. Push code to GitHub
2. Connect repo to Vercel
3. Set Root Directory to `client`
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL` = Your Render API URL
   - `NEXT_PUBLIC_MAPBOX_TOKEN` = Your Mapbox token
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` = Your WhatsApp number

### Deploy Server to Render

1. Push code to GitHub
2. Create new Blueprint from `server/render.yaml`
3. Set environment variable:
   - `ALLOWED_ORIGINS` = Your Vercel domain (e.g., `https://terra.vercel.app`)

## Features

- 🗺️ Interactive Mapbox map with property markers
- 📋 Zillow-style split-view layout
- 🏠 Filter by property type (Land, House, Commercial)
- 💰 Prices in KES and USD
- 📱 Responsive mobile design
- 💬 WhatsApp integration
- ✅ Title verification badges

## Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS, Framer Motion, Mapbox GL
- **Backend**: Node.js, Express, Prisma, SQLite
- **Deployment**: Vercel (client), Render (server)
