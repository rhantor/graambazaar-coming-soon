# GraamBazaar — Project Setup Guide

## File Structure
```
graambazaar/
├── index.html              ← Main landing page
├── css/
│   └── style.css           ← Full design system
└── js/
    ├── firebase-config.js  ← Firebase credentials (edit this!)
    ├── effects.js          ← Cursor, particles, chain animation
    ├── timeline.js         ← Public timeline renderer
    └── admin.js            ← Admin panel (Auth + Firestore CRUD)
```

---

## Step 1 — Firebase Setup

1. Go to https://console.firebase.google.com
2. Create a new project (e.g. `graambazaar`)
3. Enable **Firestore Database** (Start in test mode for now)
4. Enable **Authentication → Email/Password**
5. Create an admin user:
   - Authentication → Users → Add User
   - Enter your email & password

6. Get your config:
   - Project Settings → General → Your Apps → Web App
   - Copy the `firebaseConfig` object

7. Open `js/firebase-config.js` and replace the placeholder values:
```js
const firebaseConfig = {
  apiKey:            "AIzaSy...",
  authDomain:        "graambazaar.firebaseapp.com",
  projectId:         "graambazaar",
  storageBucket:     "graambazaar.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc123"
};
```

---

## Step 2 — Firestore Collection Structure

Collection name: `milestones`

Each document:
```json
{
  "title":       "ডেলিভারি পোর্টাল",
  "description": "অর্ডার ট্র্যাকিং ও ডেলিভারি ম্যানেজমেন্ট সিস্টেম",
  "date":        "2025-02-01",
  "status":      "inprogress",   // "done" | "inprogress" | "pending"
  "icon":        "delivery",     // see icon keys below
  "order":       4,              // sort order on public page
  "createdAt":   Timestamp,
  "updatedAt":   Timestamp
}
```

### Icon Keys
| Key        | Icon        |
|------------|-------------|
| design     | Pencil      |
| domain     | Globe       |
| product    | Package     |
| delivery   | Truck       |
| payment    | Credit Card |
| launch     | Rocket      |
| mobile     | Smartphone  |
| security   | Shield      |
| test       | CheckSquare |
| analytics  | BarChart    |
| server     | Server      |
| users      | Users       |
| map        | Map         |
| social     | Facebook    |
| default    | Star        |

---

## Step 3 — Firestore Security Rules

In Firestore → Rules, paste:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public can READ milestones
    match /milestones/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## Step 4 — Open Admin Panel

The admin button is **hidden** from visitors.
To open: press **Ctrl + Shift + A** on the keyboard.
Login with the Firebase Auth email & password you created.

---

## Step 5 — Hosting

Since this uses ES Modules, you need a local server or hosting:

### Option A — VS Code Live Server
Install the "Live Server" extension → Right-click `index.html` → Open with Live Server

### Option B — Firebase Hosting (Recommended)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Option C — Netlify / Vercel
Just drag the `graambazaar/` folder into netlify.com/drop

---

## Notes
- Admin panel opens via keyboard shortcut only (Ctrl+Shift+A) — invisible to visitors
- Timeline updates on the public page in **real-time** without refresh via Firestore `onSnapshot`
- Subscribe form sends to Google Sheets via the existing Apps Script URL
