# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at localhost:3000
npm run build      # Production build
npm test           # Run tests (interactive watch mode)
npm test -- --watchAll=false  # Run tests once (CI mode)
```

## Architecture

This is a **React SPA with Firebase as the entire backend** — no server, no API layer. All data, auth, and file storage go directly through the Firebase SDK.

### State flow

Firebase → Redux → Components

- `src/firebase.js` — Firebase app init (auth, Firestore `db`, Storage). Credentials are currently hardcoded here (not from env).
- `src/store.js` — Redux store with two slices: `userSlice` (current user) and `podcastSlice` (podcast list).
- `src/App.js` — Mounts `onAuthStateChanged` listener that syncs Firebase auth state into Redux on every app load.

### Routing & route protection

Routes are defined in `App.js`. `src/Component/commonComponents/PrivateRoutes.jsx` wraps protected routes — it uses `useAuthState(auth)` from `react-firebase-hooks` and redirects unauthenticated users to `/`.

| Route | Access |
|---|---|
| `/` | Public — signup/login toggle |
| `/profile` | Protected |
| `/create-a-podcast` | Protected |
| `/podcasts` | Protected |
| `/podcasts/podcast/:id` | Protected |
| `/podcast/:id/create-episode` | Protected |

### Firestore data model

```
users/{uid}             — name, email, uid, profilePic
podcasts/{podcastId}    — title, description, displayImage, bannerImage, genre, createdBy
  episodes/{episodeId}  — title, description, audioFile
```

Firestore queries use `onSnapshot()` for real-time listeners (no REST calls). File uploads go to Firebase Storage; the download URL is then saved as a field in the Firestore document.

### Component conventions

- Pages live in `src/Pages/` and own their data-fetching logic (Firebase calls happen directly in page components).
- Reusable UI primitives (Button, Input, FileInput, Loader, Header) live in `src/Component/commonComponents/`.
- Domain components (AudioPlayer, PodcastCard, EpisodeDetails, forms) live under `src/Component/`.
- Styles are co-located CSS files next to each component.
