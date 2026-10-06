# Contributing to EmbeddedLab OS

Thank you for your interest in contributing to **EmbeddedLab OS**!

## Code of Conduct

We are committed to providing a welcoming, inclusive, and professional environment for all contributors. Please treat everyone with respect and empathy.

---

## Development Workflow

### 1. Prerequisites
- **Node.js**: Version 20 or 22+ (LTS recommended)
- **npm**: Version 10+
- **Git**

### 2. Local Setup
```bash
# 1. Clone repository
git clone https://github.com/RONALD-REX-7/EmbeddedLab-OS.git
cd EmbeddedLab-OS/embeddedlab-os

# 2. Install dependencies
npm ci

# 3. Create environment file (optional for local demo)
cp .env.example .env.local

# 4. Start local development server
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## Quality Gates & Verification

Before submitting a Pull Request, all automated checks must pass:

```bash
# Run unit & integration test suite (169 tests)
npm test

# Run TypeScript type validation
npm run type-check

# Run ESLint validation
npm run lint

# Run production build
npm run build
```

---

## Pull Request Guidelines

1. **Branch Naming**: Use descriptive branch names (`feature/new-lab`, `fix/pwm-calc`, `docs/arch-update`).
2. **Commit Messages**: Follow conventional commits (`feat:`, `fix:`, `docs:`, `ci:`, `test:`).
3. **No Secret Commitments**: Never commit `.env.local`, API keys, or private tokens.
4. **Pure State Validators**: New laboratory challenges must include deterministic unit tests in `__tests__/`.
