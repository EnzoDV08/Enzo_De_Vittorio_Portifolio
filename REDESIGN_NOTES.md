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

## Phase 4 — Layout & motion infrastructure

- **GSAP** plugins (ScrollTrigger, SplitText, useGSAP) are registered once, browser-only, in `app/lib/gsap.ts`. Every animation runs inside `useGSAP` with a scope, so its tweens and ScrollTriggers are reverted when its component unmounts. That's how triggers die on route change. A global "kill all" would also kill triggers the incoming page has just created, because child effects run before parent effects.
- **Lenis** runs on GSAP's ticker (`autoRaf: false`) and is created only when motion is allowed. It uses native scroll position, so keyboard scrolling, find-in-page and anchor links still work. On each new page it syncs to whatever `<ScrollRestoration>` set: top for links, the saved spot for back/forward. That way leftover inertia can't fight React Router.
- **Page transition**: an ink panel wipes up with the destination title in mono, navigation happens underneath, then the panel wipes off — 0.3 s + 0.34 s. It plays only for in-app link clicks through `TransitionLink`. Back/forward and modified clicks (new tab) are instant, and reduced motion skips it.
- **Focus**: after each client navigation, focus moves to `<main tabindex=-1>` so screen readers start at the new content. There's a skip link. The mobile menu sets `inert` on `main` and the footer, locks scroll (Lenis stop + `overflow: hidden`), closes on Esc, and returns focus to the toggle — unless a link inside it navigated, in which case the new page takes focus.
- **Cursor**: fine pointers with motion allowed only. The native cursor stays everywhere except over `[data-cursor]` media, and only after the follower has mounted (`.has-cursor`), so a JS failure can never hide the cursor.
- **Scroll reveals** (`RevealText`, `RevealMedia`) skip elements already on screen at hydration, which avoids a visible-hidden-visible flash. The hero uses CSS keyframes rather than JS (see Phase 5).

## Phase 5 — Pages

### Data flows through loaders, not the JS bundle

The first full build shipped about **190 KB** of initial JS against a 130 KB budget. React 19 + React Router alone are a fixed ~107 KB. I made two structural changes:

1. **Motion islands.** Every GSAP/Lenis behaviour lives in a small lazily-loaded `fx` component (`components/motion/fx/*`). Each one still uses `useGSAP` and mounts only after hydration when motion is allowed. Content components render plain, prerendered markup, so GSAP, ScrollTrigger, SplitText and Lenis (~54 KB) are off the critical path. Each island sits inside an error boundary (`Island`), so an animation failure leaves static content instead of an error page.
2. **Route loaders.** With `ssr: false` + `prerender`, React Router runs `loader`s at build time and embeds their data in the HTML, plus a `.data` file for client navigation. Project content and image metadata now go through `lib/content.server.ts`. That's a `.server` module, so React Router guarantees it never reaches the browser. Cards get a slim `ProjectSummary`, and case studies get the full entry with images resolved. `projects.ts` is still the single source of truth with the briefed schema.

Result: **123–128 KB** initial JS per page. `postbuild` measures this on every build and fails above 130 KB.

### Other decisions

- **Hero size.** The display line is `clamp(3rem, 17vw, 11rem)` rather than `11vw`. At 11vw the phone hero was 48 px and used under 60% of the width. 17vw gives 61 px at 360 px (still fits with room), 66 px at 390, and the same 11 rem cap on desktop.
- **Hero animation** is CSS (`@keyframes rise` in line masks), not SplitText. It plays at first paint without waiting for JS, so the LCP element isn't held back by a script. SplitText drives the scroll-in headings everywhere else ("How I work", the closing CTA, case-study challenge text). Each split pads its masks so descenders aren't clipped and reverts after playing.
- **ScrollTriggers** use `toggleActions: "play none none none"` instead of `once: true`. Self-killing triggers crashed `ScrollTrigger.refresh()` when SplitText re-split during a refresh.
- **Trailing slashes.** Prerendering requests `/contact/`; the browser sees `/contact`. `usePathname()` normalises this, otherwise nav state and the footer CTA differed between the static HTML and hydration.
- **Section rhythm**: sections have top padding only, so neighbouring sections share one gap instead of stacking two.
- **Case-study gallery**: the first gallery image sits between Challenge and Approach. If two or more remain, they form the pinned horizontal strip. One leftover stays inline. Honeybee and MPG have 5 images (pinned strip of 4); ChronoVoyage has 3 (strip of 2).
- **404**: the `*` route is prerendered at `/404` and moved to `404.html`, which Firebase serves with a 404 status. A runtime 404 (e.g. client navigation to `/work/<unknown>`) renders the same page through the root error boundary.

## Phase 6 — SEO, OG, sitemap, Firebase, CI

- **Meta**: every route uses `pageMeta()` for title (`{Page} — Enzo De Vittorio`), description, canonical, Open Graph and Twitter card. JSON-LD `Person` (home, about) has `sameAs` socials (only real ones), `alumniOf` Open Window Institute and `worksFor` Stack Studio. Each case study gets a `CreativeWork`.
- **OG images** come from `npm run og`, which renders an HTML card with the real fonts and tokens in headless Chromium. They're JPEG (~65 KB each) rather than PNG. They're generated on demand and committed rather than built in CI, so CI doesn't need a browser. `postbuild` warns if a case study is missing its image.
- **Favicons** use Geist 600 outlines of "EDV" (extracted with opentype.js, so no live text), ink on accent: SVG, 32 px PNG and a 180 px apple-touch icon.
- **sitemap.xml and robots.txt** are written by `postbuild` from `staticPaths` in `react-router.config.ts`, the same list the prerender uses. The dev-only styleguide and the 404 are never in it.
- **Firebase** (checked against the hosting emulator):
  - Config is at the repo root; `public` is `build/client`, with `cleanUrls` and `trailingSlash: false`.
  - HTML and `.data` are `no-cache`, `/assets/**` is `immutable` for a year, and images/PDF are cached one day. Later header rules override earlier ones; the emulator confirmed this.
  - Basic security headers are on. No CSP yet: React Router's inline hydration scripts would need hashes.
  - Unknown URLs get `404.html` with a real 404 status. `/work/<unknown>` also ends on the 404 page through a small `clientLoader`. React logs one recoverable hydration warning for that case, because the 404 HTML was rendered for a different route.
- **CI** runs on Node 20 with `setup-node` npm cache: `npm ci` → typecheck → lint → build → deploy. It keeps the existing service-account secret and project ID. EmailJS keys come from optional repo secrets; without them the form stays hidden.
