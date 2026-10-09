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

## Phase 3 — Content layer

All copy and data live in `app/content/`. Anything I couldn't verify is a `todo()` value. `npm run todo` regenerates `CONTENT_TODO.md` from those values plus any missing image files, so the list stays in sync with the code. Every case-study block is ≤ 60 words and every tagline ≤ 12 words (checked with a script).

### Years for earlier work — evidence

| Project             | Year                               | Evidence                                                                                                                                     |
| ------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| RentalFinder        | **2024**                           | `DV_200_Group2_Final` created 2024-05-09, first commit the same day. DV 200 = second year.                                                   |
| SuperStore          | **2024**                           | `SuperStore_DV200_Term_4` created 2024-10-29, first commit the same day.                                                                     |
| Code Kids Academy   | **2024**                           | `CodeKidsAcademy_DV_200_Theory` created 2024-10-08, first commit the same day.                                                               |
| Real Estate Website | **2024**                           | `Enzo_De_Vittorio_231244_Term3-Final-Project` created 2024-08-26, first commit 2024-08-26.                                                   |
| Sportify            | **2025**                           | `Sportify_Frontend` created 2025-03-09, first commit 2025-03-09 (`Sportify_Backend` same day).                                               |
| Escape Today        | TODO — best guess **2024**         | `EnzoDV5/Escape_Today` returns 404 (private or deleted). The stack (React/Node/Bootstrap/Firebase + Figma) matches the 2024 DV 200 projects. |
| ClimberBuddy        | TODO — best guess **2024**         | Figma file is named `UX-200` (second-year UX), and second-year DV 200 work is 2024.                                                          |
| Catch The Bokkie    | TODO — best guess **2024 or 2023** | Figma file is `UX-Term-3-Final` with no course level in the name.                                                                            |
| Agriflow            | TODO — no confident guess          | Figma file `UX-Farming-App-design` has no date or course code.                                                                               |

Projects with a TODO year appear under a "Year to confirm" group at the end of Earlier work.

Other inferences, made from course codes:

- **Built to Be Felt** is set to 2026. RR 420 is a PGDip course, and the PGDip is 2026.
- **Medihelp** is set to 2026 because it's in progress now.
- **Makerspace**, **poofy** and **VerifyLab** have TODO years.

### Collaborators

The brief lists no names for the group projects. RentalFinder and Sportify are credited by **GitHub handle**, taken from each repo's contributor list (`@JoshuaDeKlerk`, `@ZanderBez`, `@Armand1711`, `@321008Jaco`). That is verifiable, but real names and roles are TODOs. `@Armand1711` may be Armand Naudé; I didn't assume it.

### Imagery

- The old MockUp1–9 were moved to `_originals/archive/<slug>` and resized to 2400 px JPEG masters: **49 MB → about 2 MB**. vite-imagetools then emits AVIF/WebP at 480/960/1440/1920. The transparent PNGs (SuperStore, Sportify, Code Kids) are flattened onto `ink-2`.
- Four featured projects (Lente Book, Honeybee Heroes, MPG, ChronoVoyage) had no imagery in the repo. They now use **real screenshots of the live sites** captured with Playwright at 2400×1500. I dropped frames that caught text mid-animation. Each gallery image is captioned "Live site, captured October 2026", and `CONTENT_TODO.md` asks for designed mockups. One River and Stack Studio have no public URL, so they use the designed placeholder.
- The camera photos in `~/Desktop/phots` weren't used. Their subjects are unknown.
- I added the Honeybee Heroes code link (`EnzoDV08/honeybee-heroes`) because it's a public repo on Enzo's account.
- `SITE_URL` is set to `https://myportfolio-8c863.web.app`, the real Firebase default domain, because canonical and OG URLs need a real origin at build time. A custom domain is a one-line change in `site.ts`.
