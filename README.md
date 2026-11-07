# IdeaBridge — Campus Innovation & Angel Investment Platform

IdeaBridge is an ecosystem connecting collegiate creators, innovators, and student founders directly with angel investors, VC syndicates, and campus grant committees.

---

## 📂 Project Architecture & Directory Structure

To keep the repository clean, maintainable, and welcoming for newcomers, the codebase is organized into modular directories:

```text
Investor-Panel/
├── artifacts/
│   └── venturebridge/                     # Main Web Application Frontend
│       ├── src/
│       │   ├── components/                # Modular UI Components
│       │   │   ├── common/                # Shared atomic widgets (Logo, Modals, Badges, Fields)
│       │   │   ├── forms/                 # Form workflows (List Project, Raise Fund)
│       │   │   ├── home/                  # Homepage discovery (HeroBanner, DealPipeline, Cards, Stories)
│       │   │   ├── layout/                # Global layout (Sticky Header, Dark Brand Footer)
│       │   │   ├── modals/                # Context modals (Venture Details, Admin review, Deal room)
│       │   │   ├── ui/                    # Base UI primitive library (Radix/Tailwind components)
│       │   │   └── workspaces/            # Authenticated role workspaces (Creator, Investor, Admin)
│       │   ├── lib/                       # Search scoring algorithms & utility helpers
│       │   ├── pages/                     # Full-page dedicated authentication screens
│       │   │   ├── CreatorAuthPage.tsx    # Creator signup & login with validation checklist
│       │   │   └── InvestorAuthPage.tsx   # Investor classification, ticket size & account setup
│       │   ├── auth.ts                    # User session management, persistence & password rules
│       │   ├── constants.ts               # Price ranges, sector categories & role titles
│       │   ├── storage.ts                 # Demo seed projects & LocalStorage operations
│       │   ├── types.ts                   # Core TypeScript types & data contracts
│       │   ├── App.tsx                    # Main orchestrator & view router (~600 clean lines)
│       │   └── main.tsx                   # React root entry point
│       ├── package.json
│       ├── tailwind.config.js
│       └── vite.config.ts
│
├── package.json                           # Root monorepo workspace configuration
├── pnpm-workspace.yaml                    # PNPM workspace definition
└── README.md                              # Project overview and navigation guide
```

---

## 🌟 Key Features & Workspaces

1. **Public Showcase & Deal Flow Pipeline**:
   - **Hero Section**: Quick action buttons for *List Your Project*, *Explore Investors*, and *Raise Fund*.
   - **Sector Filtering**: Fast switching between **Retail**, **Manufacturing**, and **Service** ventures.
   - **Price Range Rows**: Categorized funding bands from `₹ 2L - 5L` up to `₹ 1Cr +`.
   - **Community & Knowledge**: Success stories carousel and community blog articles.

2. **Dedicated Authentication Portals**:
   - **Creator Portal**: Dedicated signup/login with password security checklist (min 8 characters, at least 1 special character).
   - **Investor Portal**: Specialized registration with investor classification (*Individual Angel*, *Business Firm / Syndicate*, *VC Fund*, etc.) and ticket size ranges.

3. **Three Authenticated Workspaces**:
   - **Creator Workspace**: Submit proposals, monitor live status (*Approved*, *Under review*, *Revision requested*), and view angel interest.
   - **Investor Workspace**: Browse vetted collegiate breakouts, review use of funds, and signal investment interest with 1 click.
   - **Program Administrator**: Review applicant submissions, approve grant budgets, and leave structured feedback.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- pnpm (v9 or higher)

### Installation & Run
```bash
# 1. Install dependencies
pnpm install

# 2. Run the development server
pnpm --filter venturebridge run dev
```

### Production Build & Typecheck
```bash
# Typecheck
pnpm --filter venturebridge exec tsc --noEmit

# Production Vite build
pnpm --filter venturebridge run build
```
