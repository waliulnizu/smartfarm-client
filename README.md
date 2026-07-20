# SmartKhamar AI — Client

AI-powered livestock & poultry farm management frontend built with Next.js 16, React 19, and Tailwind CSS 4.

## Features

- **Multi-Animal Support** — Cow, Goat, Hen, Duck with type-specific themes and forms
- **Landing Page** — Hero, features, categories, testimonials, FAQ, newsletter sections
- **Explore Page** — Browse all animals with type filters (Cow/Goat/Hen/Duck)
- **Animal Detail Page** — Full animal info with type-specific emoji and colors
- **Add Animal** — Type tabs with dynamic subType/gender fields per animal type
- **Manage Animals** — Type filter tabs, table view with edit/delete
- **Dashboard** — Per-animal-type dashboard with daily logs, weight tracking, vaccine alerts
- **AI Chat Assistant** — Groq-powered chatbot (Llama 3.3 70B) with connection status
- **AI Content Generator** — Auto-generate animal descriptions
- **Asset & Valuation** — ROI calculator, per-animal profitability analysis
- **User Management** — Admin can manage staff accounts
- **Profile** — Edit name, email, change password
- **Auth** — Email/password + Google OAuth login/register
- **Responsive** — Mobile-first design with hamburger menu

## Tech Stack

| Technology | Version |
|------------|---------|
| Next.js | 16.2 |
| React | 19.2 |
| TypeScript | 5.x |
| Tailwind CSS | 4.x |
| Axios | 1.18 |
| Recharts | 3.9 |
| TanStack Query | 5.x |
| Google OAuth | @react-oauth/google |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Setup

```bash
# Install dependencies
pnpm install

# Create .env.local
cp .env.example .env.local
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
client/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Landing page
│   │   ├── login/              # Login page
│   │   ├── register/           # Register page
│   │   ├── explore/            # Explore animals
│   │   ├── items/              # Add/Manage/Detail animals
│   │   ├── profile/            # User profile
│   │   ├── dashboard/          # Dashboard (cow/goat/hen/duck)
│   │   └── about/              # About page
│   ├── components/
│   │   ├── landing/            # Navbar, Hero, Features, Footer, etc.
│   │   ├── dashboard/          # AnimalPage, DailyLogForm, etc.
│   │   ├── ai/                 # AiChatAssistant, AiContentGenerator
│   │   ├── items/              # ItemCard
│   │   └── layout/             # Sidebar
│   ├── context/                # AuthContext, AnimalTypeContext
│   ├── services/               # API service (axios)
│   └── lib/                    # Providers (Google OAuth)
├── public/
│   └── animals/                # SVG icons (cow, goat, hen, duck)
└── .env.local
```

## API

All API requests go to `NEXT_PUBLIC_API_URL` (default: `http://localhost:5000/api`).

## Deployment

- **Vercel** — Auto-deploy from GitHub
- Set environment variables in Vercel dashboard

## License

Private — SmartKhamar AI
