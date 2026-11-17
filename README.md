# Enzo De Vittorio — Portfolio

Personal portfolio of Enzo De Vittorio, developer and UX designer and co-founder of Stack Studio.

## Stack

React 19 + TypeScript · React Router v7 (framework mode, every route prerendered) · Vite · Tailwind CSS v4 · GSAP + Lenis · Netlify

## Run it

```bash
nvm use            # Node 20+
npm ci
npm run dev        # http://localhost:5173
```

| Command             | What it does                                                 |
| ------------------- | ------------------------------------------------------------ |
| `npm run dev`       | Dev server                                                   |
| `npm run build`     | Prerendered static build into `build/client`                 |
| `npm run preview`   | Serve the build like the live host (port 4173)              |
| `npm run typecheck` | Generate route types and run `tsc`                           |
| `npm run lint`      | ESLint, zero warnings allowed                                |
| `npm run format`    | Prettier                                                     |
| `npm run images`    | Resize originals in `_originals/` into `app/assets/projects` |
| `npm run shots`     | Playwright screenshots of every route into `.shots/`         |

## Content

Everything you read on the site lives in `app/content/`. Adding a project is one entry in `projects.ts` plus images — see `REDESIGN_NOTES.md`.

## Deploy

Netlify builds and deploys the site at https://enzodvportfolio.netlify.app from `EnzoDV08/Enzo_De_Vittorio_Portifolio` on `main` (settings in `netlify.toml`). Pushes to `EnzoDV5/Enzo_De_Vittorio_Portifolio` alone do not update the live site. Open tabs check `version.json` for a new deploy and reload with a fresh URL. GitHub Actions (`.github/workflows/ci.yml`) runs the type-check, lint and build on every pull request and push to `main`.
