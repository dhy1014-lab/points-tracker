# Points Tracker

Track airline, hotel, and credit card rewards. Shared with your household via Firebase.

## Features

- **Dashboard** — points totals, estimated value, annual fees, unused credits, upcoming renewals, open opportunities
- **Cards** — track cards with annual fee, renewal date, status, Personal/Business grouping
- **Points** — track balances per program with valuation and expiration policy (with tooltip)
- **Credits** — track card credits (travel, hotel, dining, shopping, etc.) with cadence, reset date, and used/unused status
- **Opportunities** — track new card bonuses and sign-up offers with deadlines
- **Transfer partners** — full reference list (auto-populated) covering Chase UR, Amex MR, Citi TY, Capital One, and Bilt, collapsible by ecosystem
- **Drag-and-drop reordering** everywhere — cards, points, credits, and transfer partners (including reordering entire ecosystem groups)
- **Shared with your partner** — toggle between "All" (both of you, grouped by holder), or either person individually. Each person can only edit their own data.

## Setup

### 1. Firebase

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project
3. Add a **Web app** — copy the config object
4. Enable **Firestore Database** (start in test mode, then apply the rules below)
5. Enable **Authentication → Google** sign-in

### 2. Firestore security rules

In Firebase Console → Firestore → Rules, paste the contents of `firestore.rules`. This restricts access to the two emails hardcoded in `src/App.jsx` and `src/pages/Tracker.jsx` (`ALLOWED_EMAILS`) — update those if your emails differ.

### 3. Local setup

```bash
cp .env.example .env.local
# Fill in your Firebase values in .env.local

npm install
npm run dev
```

### 4. Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → import your repo
3. Add environment variables (same as your `.env.local`) in Vercel's project settings
4. Deploy — Vercel auto-detects Vite

**Add authorized domain in Firebase:**  
Firebase Console → Authentication → Settings → Authorized domains → add your `*.vercel.app` URL

---

## How sharing works

Both of you sign in with Google (emails must match the allowlist in `App.jsx` / `Tracker.jsx`). Each person's data lives under their own Firestore path, but the app automatically looks up your partner's profile by email — no codes or manual linking needed.

Use the **All / [Your name] / [Partner name]** toggle at the top to switch between combined and individual views. In "All" view, each tab shows two sections (yours, theirs) — you can see your partner's data but can't edit it, and vice versa.

