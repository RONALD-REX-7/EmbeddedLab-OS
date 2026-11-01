# EmbeddedLab OS — Application & Developer Quickstart

This directory (`embeddedlab-os/`) contains the source code, test suites, and build manifests for the **EmbeddedLab OS** Next.js web application.

For the canonical high-level system architecture, educational objectives, and engineering overview, refer to the [Root Repository README](../README.md).

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- **Node.js**: `v20.x` or `v22.x` (CI uses Node.js 22 LTS)
- **npm**: `v10.x` or higher

### 1. Installation
Ensure your terminal working directory is inside `embeddedlab-os/`:
```bash
cd embeddedlab-os
npm ci
```

### 2. Environment Configuration
Copy the template configuration:
```bash
cp .env.example .env.local
```
> [!TIP]
> **Zero-Configuration Offline Demo Mode**:
> If `.env.local` is left blank, the application automatically boots into **Local Offline Demo Mode**. All 4 laboratories (GPIO, PWM, ADC, UART), 12 interactive challenges, and deterministic AI fallback tutoring are fully functional without external Supabase or Google Gemini accounts.

To enable persistent cloud student authentication and live Google Gemini Flash AI guidance:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL (`https://xyz.supabase.co`).
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon/publishable key.
- `GEMINI_API_KEY`: Server-only Google Gemini API key from [Google AI Studio](https://aistudio.google.com/).

### 3. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the interactive student workstation.

---

## 🛠️ Package Scripts & Quality Gates

All scripts must be executed from this directory:

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `npm run dev` | `next dev` | Starts local Turbopack development server on port 3000 |
| `npm run build` | `next build` | Compiles optimized Next.js 16 production build |
| `npm run start` | `next start` | Runs the compiled production server locally |
| `npm run lint` | `eslint` | Runs ESLint 9 checks across all TypeScript/TSX source files |
| `npm run type-check` | `tsc --noEmit` | Validates strict TypeScript compilation without outputting files |
| `npm test` | `vitest run` | Executes all 17 test suites (169 unit & integration tests) |
| `npm run test:watch` | `vitest` | Runs Vitest in interactive watch mode during development |
| `npm run test:coverage`| `vitest run --coverage` | Generates detailed code coverage reports |

---

## 🧪 Verified Automated Test Suites

The test suite validates the deterministic mathematics, state machine transitions, challenge scoring, and security invariants:

```bash
npm test
```

### Verified Passing Test Inventory:
```text
 ✓ __tests__/simulator/uart.test.ts (18 tests)
 ✓ __tests__/simulator/adc.test.ts (24 tests)
 ✓ __tests__/simulator/gpio.test.ts (19 tests)
 ✓ __tests__/simulator/pwm.test.ts (12 tests)
 ✓ __tests__/stores/simulator-store.test.ts (10 tests)
 ✓ __tests__/stores/student-progress.test.ts (6 tests)
 ✓ __tests__/ai/route-security.test.ts (16 tests)
 ✓ __tests__/ai/service.test.ts (9 tests)
 ✓ __tests__/challenges/gpio-validators.test.ts (4 tests)
 ✓ __tests__/challenges/pwm-validators.test.ts (6 tests)
 ✓ __tests__/challenges/adc-validators.test.ts (7 tests)
 ✓ __tests__/challenges/uart-validators.test.ts (5 tests)
 ✓ __tests__/challenges/framework.test.ts (5 tests)
 ✓ __tests__/education/content.test.ts (3 tests)
 ✓ __tests__/legal/legal-transparency.test.ts (8 tests)
 ✓ __tests__/release-gate/release-invariants.test.ts (14 tests)
 ✓ __tests__/supabase/auth.test.ts (3 tests)

 Test Files  17 passed (17)
      Tests  169 passed (169)
```

---

## 📁 Application Directory Structure

```text
embeddedlab-os/
├── app/                      # Next.js 16 App Router
│   ├── (app)/                # Authenticated student workstation (dashboard, labs, progress, settings)
│   ├── (auth)/               # Supabase authentication pages (login, signup)
│   ├── (marketing)/          # Public landing page, privacy policy, terms, cookies
│   ├── api/                  # API routes (sanitized AI route, account deletion)
│   ├── globals.css           # Tailwind CSS v4 styling rules
│   └── layout.tsx            # Root HTML & provider shell
├── components/               # React UI components (virtual instruments, visualizers)
├── hooks/                    # Reactive simulation state hooks (useGPIOState, usePWMState, etc.)
├── lib/                      # Core business logic
│   ├── ai/                   # Rate limiter, schema sanitizer, Gemini service, offline fallback
│   ├── challenges/           # Challenge definitions & verification validators
│   ├── constants/            # Lab specifications & legal metadata
│   ├── education/            # Pedagogical derivations, guides, and curriculum
│   ├── simulator/            # Deterministic peripheral math engines (GPIO, PWM, ADC, UART)
│   └── supabase/             # Client/server Supabase factories & auth contexts
├── store/                    # Zustand persistent state stores (simulatorStore, challengeStore)
├── types/                    # Shared TypeScript interfaces & register definitions
└── __tests__/                # Vitest unit & integration test suites
```

---

## 🔒 Security & Privacy Standard
- **No Client Secrets**: Gemini API keys and Supabase Service Role keys are strictly forbidden from client code and never prefixed with `NEXT_PUBLIC_`.
- **API Guardrails**: The `/api/ai` endpoint enforces request body size limits (32 KB), sliding-window rate limits, and action allow-lists.
- **Privacy Standard**: Institutional register numbers and student personal emails are quarantined from source code and manifests.
