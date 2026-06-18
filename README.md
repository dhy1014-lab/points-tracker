# Points Tracker

Track airline, hotel, and credit card rewards. Shared with your household via Firebase.

## Setup

### 1. Firebase

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project
3. Add a **Web app** — copy the config object
4. Enable **Firestore Database** (start in test mode, then apply the rules below)
5. Enable **Authentication → Google** sign-in

### 2. Firestore security rules

In Firebase Console → Firestore → Rules, paste the contents of `firestore.rules`.

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

## Sharing with your partner

1. Both of you sign in with Google
2. Go to the sidebar → "Share with partner"
3. Copy your **User ID** and send it to your partner (or vice versa)
4. Paste their User ID and click Connect
5. Toggle between "Mine" and their name at the top to switch views

Their data is read-only to you (and yours to them).
