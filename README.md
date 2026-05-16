# Intelligent Bistro

A full-stack mobile restaurant ordering app with an AI-powered assistant. Built with **React Native (Expo)** and **Node.js/Express**.

Customers can browse a curated restaurant menu, manage their cart through traditional UI controls, or simply tell the AI assistant what they want in natural language — and the cart updates automatically.

---

## Features

- **Menu Browsing** — Scroll through 18 items across 4 categories (Mains, Sides, Drinks, Desserts) with category filter chips
- **Cart Management** — Add, remove, and adjust quantities with live price totals including tax
- **AI Assistant** — Type natural language like _"Add two burgers and a large lemonade"_ and the cart updates automatically
- **Dual Input** — Both UI buttons and AI assistant feed into the same cart state (single source of truth)
- **Fallback Parser** — Works without an OpenAI API key using a built-in keyword parser
- **Polished UI** — Consistent design system with toast notifications, loading states, empty states, and error handling

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile App | React Native, Expo SDK 54, Expo Router, TypeScript |
| Backend | Node.js, Express, TypeScript |
| AI Parsing | OpenAI GPT-4o-mini (optional), Keyword fallback parser |
| State | React Context + useReducer |

---

## Project Structure

```
intelligent-bistro/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express server entry
│   │   ├── routes/
│   │   │   ├── health.ts         # GET /api/health
│   │   │   ├── menu.ts           # GET /api/menu
│   │   │   └── assistant.ts      # POST /api/assistant
│   │   ├── services/
│   │   │   ├── aiParser.ts       # OpenAI-based parser
│   │   │   └── fallbackParser.ts # Keyword-based fallback
│   │   ├── data/
│   │   │   └── menu.ts           # Static menu dataset
│   │   └── types/
│   │       └── index.ts          # Shared TypeScript types
│   ├── package.json
│   └── tsconfig.json
├── mobile/
│   ├── app/
│   │   ├── _layout.tsx           # Root layout + CartProvider
│   │   └── (tabs)/
│   │       ├── _layout.tsx       # Tab navigator (Menu, Cart, Assistant)
│   │       ├── index.tsx         # Menu browsing screen
│   │       ├── cart.tsx          # Cart screen
│   │       └── assistant.tsx     # AI chat screen
│   ├── components/               # Reusable UI components
│   ├── context/
│   │   └── CartContext.tsx        # Cart state (useReducer)
│   ├── services/
│   │   └── api.ts                # API client
│   ├── constants/
│   │   └── theme.ts              # Design tokens
│   └── types/
│       └── index.ts              # TypeScript interfaces
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Expo Go** app on your phone (optional, for mobile testing)

### 1. Clone the repository

```bash
git clone https://github.com/jayd972/The-Intelligent-Bistro.git
cd The-Intelligent-Bistro
```

### 2. Start the backend

```bash
cd backend
npm install
cp .env.example .env    # Edit .env to add your OpenAI key (optional)
npm run dev
```

The server starts at **http://localhost:3000**. Verify with:
- http://localhost:3000/api/health
- http://localhost:3000/api/menu

### 3. Start the mobile app

```bash
cd mobile
npm install
npx expo start --web
```

Open **http://localhost:8081** in your browser, or scan the QR code with Expo Go on your phone.

> **Note:** The mobile app connects to `localhost:3000` by default. If testing on a physical device, update the `API_BASE` in `mobile/services/api.ts` to your computer's local IP address.

---

## AI Assistant

The assistant parses natural language into structured cart actions. It supports:

| Command | Example |
|---------|---------|
| Add items | "Add two burgers and a large lemonade" |
| Remove items | "Remove the pasta" |
| Clear cart | "Clear my cart" |
| Ask about menu | "What drinks do you have?" |
| Greetings | "Hello!" |

### How it works

```
User message → POST /api/assistant → Parser → Structured JSON → Cart update
```

**Example request:**
```
"Add two spicy chicken sandwiches and a large water"
```

**Example response:**
```json
{
  "intent": "cart_update",
  "actions": [
    {
      "type": "add_item",
      "itemName": "Spicy Chicken Sandwich",
      "quantity": 2
    },
    {
      "type": "add_item",
      "itemName": "Sparkling Water",
      "quantity": 1,
      "size": "large"
    }
  ],
  "assistantMessage": "Added 2 Spicy Chicken Sandwich, Sparkling Water (large) to your cart."
}
```

### Two-tier parsing

1. **OpenAI Parser** — Used when `OPENAI_API_KEY` is set in `.env`. Uses GPT-4o-mini with JSON mode for reliable structured output.
2. **Fallback Parser** — Keyword/regex-based parser that works without any API key. Handles common patterns out of the box.

The app gracefully degrades: if OpenAI fails (rate limit, network error), it falls back to the keyword parser automatically.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| GET | `/api/menu` | Full menu (supports `?category=mains\|sides\|drinks\|desserts`) |
| POST | `/api/assistant` | AI order parser (body: `{ "message": "..." }`) |

---

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **useReducer** over Redux | Right-sized for this app, no extra dependency |
| **Expo Router** over React Navigation | File-based routing, modern, simpler to explain |
| **Static menu data** | No database needed for a demo — keeps focus on the interesting parts |
| **Mirrored types** | Types duplicated in backend/mobile avoids monorepo complexity |
| **Fallback parser** | Shows engineering judgment — graceful degradation without paid API |
| **No authentication** | Intentionally omitted to keep scope focused |

---

## Future Improvements

- Unit and integration tests
- Real database (PostgreSQL/MongoDB)
- User authentication and order history
- Voice input for the AI assistant
- Animated transitions between screens
- Push notifications for order status
- Real payment processing integration

---
## License

MIT
