# EmbeddedLab OS

A browser-based virtual embedded-systems laboratory for engineering students.
The platform teaches fundamental embedded concepts through deterministic software simulations — no physical hardware required.

---

## Purpose

EmbeddedLab OS simulates the behavior of a microcontroller's peripherals in a web browser, allowing students to configure, experiment with, and validate embedded systems concepts before touching real hardware.

**MVP Labs**
- GPIO — pin modes, HIGH/LOW states, transition rules
- PWM — frequency, period, duty cycle relationships
- ADC — the ADC formula, resolution, quantization error
- UART — baud rate, framing, TX/RX compatibility

---

## Architecture

```
embeddedlab-os/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Sign in / Sign up / Reset password
│   └── (app)/              # Authenticated app shell
│       ├── dashboard/      # Lab selection and progress overview
│       ├── labs/           # GPIO, PWM, ADC, UART lab workspaces
│       └── settings/       # User settings
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── lab/                # Lab-specific UI components
│   ├── simulator/          # Visualization components (waveforms, pin maps)
│   └── shared/             # Navigation, layout
├── lib/
│   ├── simulator/          # ⚠️ Pure TS simulation engine — no React here
│   │   ├── engine.ts       # Top-level SimulationEngine class
│   │   ├── gpio.ts         # GPIO state transitions
│   │   ├── pwm.ts          # PWM calculations and state transitions
│   │   ├── adc.ts          # ADC formula and state transitions
│   │   └── uart.ts         # UART framing and compatibility validation
│   ├── challenges/         # Deterministic challenge validators
│   ├── supabase/           # Supabase client helpers (client.ts, server.ts)
│   └── ai/                 # Gemini API integration (Explain/Hint/Debug only)
├── stores/                 # Zustand stores (wrap SimulationEngine)
├── types/
│   └── simulator.ts        # Shared TypeScript types — all simulation models
├── hooks/                  # Custom React hooks
└── __tests__/              # Vitest unit and integration tests
    └── simulator/          # Simulator math tests
```

### Key Architectural Rules

1. **Simulator is pure TypeScript** — `lib/simulator/` has no React imports. Tests run in Node.js without a browser.
2. **UI talks to stores, stores talk to the engine** — no page component runs simulation logic directly.
3. **Challenge validation is deterministic** — the engine determines pass/fail, not the UI or AI.
4. **AI is advisory only** — AI features (Explain, Hint, Debug) never mutate simulator state.

---

## Local Setup

### Prerequisites
- Node.js 18+
- A Supabase project (free tier works)
- A Gemini API key (free tier works)

### Steps

```bash
# 1. Clone the repo and navigate to the project
cd "EmbeddedLab OS/embeddedlab-os"

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and fill in your Supabase URL, anon key, and Gemini API key

# 4. Start the development server
npm run dev
# Open http://localhost:3000
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Your Supabase public anon key |
| `GEMINI_API_KEY` | ✅ | Gemini API key (server-side only) |
| `NEXT_PUBLIC_APP_URL` | Optional | App base URL (default: `http://localhost:3000`) |

**Never commit `.env.local` to source control.**

---

## Development Commands

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run type-check   # TypeScript type checking (tsc --noEmit)
npm run test         # Run all unit tests (Vitest)
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

---

## Testing

Tests live in `__tests__/` and use Vitest + Testing Library.

```bash
npm run test
```

The simulator math is the highest-priority test target:
- `__tests__/simulator/adc.test.ts` — ADC formula boundary tests
- `__tests__/simulator/gpio.test.ts` — GPIO state transition tests
- `__tests__/simulator/pwm.test.ts` — PWM period/duty-cycle invariants
- `__tests__/simulator/uart.test.ts` — UART framing and compatibility tests

---

## Deployment

The application is designed for deployment on Vercel.

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Set all environment variables in the Vercel project dashboard. **Do not** set `GEMINI_API_KEY` as a `NEXT_PUBLIC_` variable — it must remain server-side only.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui |
| Database + Auth | Supabase |
| State | Zustand |
| Charts | Recharts |
| Icons | Lucide React |
| AI | Google Gemini API |
| Testing | Vitest + Testing Library |
| Deployment | Vercel |

---

## MVP Scope

**In scope:** Landing page, authentication, dashboard, GPIO/PWM/ADC/UART labs, challenge system, progress tracking, AI assistance (Explain/Hint/Debug), settings.

**Explicitly out of scope for MVP:** Full CPU emulation, C compiler, SPI, I2C, CAN, RTOS, PCB design, real hardware connectivity, payments, marketplace, social features.
