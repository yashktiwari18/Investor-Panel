# IdeaBridge Frontend (`artifacts/venturebridge`)

A modular React 19 application powered by Vite and Tailwind CSS v4, connecting collegiate creators and innovators with angel investors and grant committees.

---

## 📁 Clean & Intuitive Folder Structure

The project has been modularized into clear, purposefully named directories so any developer can understand and navigate the codebase immediately:

```text
artifacts/venturebridge/
├── src/
│   ├── components/                # Modular UI components
│   │   ├── common/                # Shared atomic primitives
│   │   │   ├── FormField.tsx      # Field, Detail, DetailBlock components
│   │   │   ├── IdeaBridgeLogo.tsx # Brand SVG logo
│   │   │   ├── MetricCard.tsx     # Stat metric card with tonal styles
│   │   │   ├── Modal.tsx          # Accessible modal dialog wrapper
│   │   │   └── StatusBadge.tsx    # Colored venture status badges
│   │   │
│   │   ├── forms/                 # Form inputs and submission flows
│   │   │   ├── ApplicationForm.tsx# "List Your Project" submission form
│   │   │   └── RaiseFundForm.tsx  # "Raise Fund" grant & angel application form
│   │   │
│   │   ├── home/                  # Homepage discovery sections
│   │   │   ├── CommunitySection.tsx # Success stories carousel & blog articles
│   │   │   ├── DealPipeline.tsx   # Curated pipeline, category tabs & price filters
│   │   │   ├── HeroBanner.tsx     # Main hero header & quick action buttons
│   │   │   ├── ProjectCards.tsx   # FeaturedHighlightCard & CompactProjectCard
│   │   │   └── SearchResultsView.tsx # Ranked search view with price breakdowns
│   │   │
│   │   ├── layout/                # Global layout chrome
│   │   │   ├── Footer.tsx         # Dark brand footer with nav & legal links
│   │   │   └── Header.tsx         # Sticky header, search bar, role drawer & filters
│   │   │
│   │   ├── modals/                # Contextual modal dialogs
│   │   │   └── VentureDetailsModal.tsx # Full venture view, budget, and interested investors
│   │   │
│   │   └── workspaces/            # Authenticated role workspaces
│   │       └── WorkspaceView.tsx  # Creator, Investor, and Administrator dashboards
│   │
│   ├── pages/                     # Dedicated full-page routes
│   │   ├── CreatorAuthPage.tsx    # Creator signup & login with validation checklist
│   │   └── InvestorAuthPage.tsx   # Investor & angel fund registration & login
│   │
│   ├── lib/                       # Utility functions
│   │   ├── search.ts              # Word-boundary search relevance scoring
│   │   └── utils.ts               # Tailwind class merger (cn helper)
│   │
│   ├── auth.ts                    # User sessions, password validation & authentication
│   ├── constants.ts               # Price ranges, category filters & role titles
│   ├── storage.ts                 # Demo seed dataset & LocalStorage persistence
│   ├── types.ts                   # Core data models (Venture, Role, DemoData)
│   ├── App.tsx                    # Clean top-level orchestrator (~600 lines)
│   └── main.tsx                   # React root entry point
```

---

## 🚀 Key Modules & Responsibilities

1. **`App.tsx` (Root Orchestrator)**:
   - Holds platform state (current role, active user, filter state, selected venture modal).
   - Routes between public showcase (`front`), authenticated role workspaces (`overview`), and dedicated auth pages (`creator-auth`, `investor-auth`).

2. **`components/home/`**:
   - `HeroBanner.tsx`: Hero title, "+ Ideas Build Tomorrow" doodle badge, and direct call-to-actions (List Your Project, Explore Investors, Raise Fund).
   - `DealPipeline.tsx`: 3 category tabs (Retail, Manufacturing, Service) and horizontal price range rows (₹ 2L - 5L up to ₹ 1Cr +).
   - `ProjectCards.tsx`: High-converting card previews with status badges, funding amounts, and interested investor counters.
   - `CommunitySection.tsx`: Success stories slider (Founders, Investors, Mentors) and IdeaBridge Blog articles.

3. **`components/forms/`**:
   - `ApplicationForm.tsx`: Standard listing form with founder details, project name, and optional tagline.
   - `RaiseFundForm.tsx`: Comprehensive application for creators seeking grant capital or early angel funding.

4. **`components/modals/VentureDetailsModal.tsx`**:
   - Displays complete project overview, founder background, milestones, and use of funds.
   - For Program Administrators: gives approval/revision controls and budget setting.
   - For Investors: shows real-time interested investor list and allows 1-click signaling of interest.

5. **`pages/CreatorAuthPage.tsx` & `pages/InvestorAuthPage.tsx`**:
   - Strict password security checklist (min 8 characters, at least 1 special character).
   - Password confirmation check during registration.
   - Role-specific onboarding fields (University for Creators; Investor Classification & Ticket Size for Investors).

6. **`auth.ts`**:
   - Handles persistent user accounts, session tokens, and role authorization.
   - Logs out on fresh page reload as requested so visitors always sign in explicitly.
