# Redesign notes

Running log of decisions made during the 2026 redesign. Final summary is at the bottom once Phase 8 is done.

## Phase 1 — Clean & scaffold

### The local clone was out of date

The local `main` was 4 commits behind GitHub. The brief's audit (MockUp1–9, the CV, `whoosh.mp3`, the merge-conflicted README, `lottie-react`) describes `origin/main`, not what was on disk. A Finder duplicate ref (`.git/refs/remotes/origin/HEAD 2`) was breaking `git fetch`; it was moved out of `.git` (not deleted) and the fetch then worked.

- `redesign-2026` was branched from `origin/main` with `--no-track`, so a bare `git push` cannot target `main`.
- Local `main` had uncommitted changes (deleted workflows, deleted Firebase config inside `my-portfolio/`, small edits). They are kept in `git stash` as **"pre-redesign-2026: uncommitted local changes on main (preserved, not used)"**. Nothing was discarded. Local `main` itself was not touched.
- `origin/main` had `node_modules/` committed to git. It is now untracked and ignored.

### Audit corrections

- The root `package.json` on GitHub is the real CRA app. The bogus `"my-portfolio": "file:../my-portfolio"` dependency was in it. `my-portfolio/` was an older copy of the app and held the only `firebase.json`/`.firebaserc`; those were moved to the repo root and the folder removed.
- The Sportify link differs between old files: `Projects.js` uses `Sportify_Frontend.git`, `About.js` uses `Sportify.git`. The brief says to keep `Projects.js` links, so `Sportify_Frontend` is used.

### Versions

- **React Router 7.18** (latest v7). v8 is out, but the brief pins v7 framework mode. The two v8 future flags it warns about are switched on so the upgrade is smaller later.
- **Vite 8** — `vite-imagetools` 12 requires it.
- **TypeScript 6.0** — `typescript-eslint` doesn't support 7 yet.
- **ESLint 9** — `eslint-plugin-jsx-a11y` doesn't support 10 yet.
- No loaders anywhere: content is imported statically, so prerendering works without `.data` requests and unknown URLs don't hit loader errors.
- `npm run preview` is a small Node server that copies Firebase's behaviour (cleanUrls, no trailing slash, `404.html`), because `vite preview` doesn't apply those rules to a React Router static build.
