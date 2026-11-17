import { todo } from "./todo";
import type { Project } from "./types";

/*
 * Single source of truth for every project on the site.
 * Adding a project = one entry here + images in _originals/<slug>/ (then `npm run images`).
 * Rules: no invented facts or metrics; every text block ≤ 60 words; credit every collaborator.
 */

const CAPTURED = "Live site, captured October 2026.";
const CAPTURED_LOCAL = "Production build, captured October 2026.";

export const projects: Project[] = [
  // ───────────────────────────── Featured ─────────────────────────────
  {
    slug: "one-river-two-memories",
    title: "One River, Two Memories",
    tagline: "The 1838 Battle of Blood River / Ncome, told from two perspectives.",
    year: 2026,
    disciplines: ["Interactive", "Development"],
    // Every commit in the repo is Enzo's.
    role: "Design and development",
    client: "The heritage of the Zulu and the Afrikaans Voortrekkers",
    context: "Postgrad (PGDip), PP 410",
    stack: ["Astro", "Vanilla JS", "GSAP ScrollTrigger", "Lenis", "Canvas API", "Firebase Hosting"],
    links: {
      live: "https://one-river-two-memories-fa6f1.web.app",
      code: "https://github.com/EnzoDV08/ONE-RIVER-TWO-MEMORIES_FINAL",
    },
    featured: true,
    order: 1,
    theme: { accent: "#8FB3A6", surface: "#050507" },
    cover: "projects/one-river-two-memories/cover.jpg",
    coverAlt: "One River, Two Memories, opening scene of the scroll-driven heritage site",
    gallery: [
      {
        src: "projects/one-river-two-memories/gallery-1.jpg",
        alt: "“Same water. Same banks.” in serif type over dark, rippling water",
        caption: CAPTURED,
      },
      {
        src: "projects/one-river-two-memories/gallery-2.jpg",
        alt: "The river's two names side by side: iNcome, the Zulu name, and Blood River, the Voortrekker name",
        caption: CAPTURED,
      },
      {
        src: "projects/one-river-two-memories/gallery-3.jpg",
        alt: "An aerial view of the river through dry land, with narration about the two memories connected to it",
        caption: CAPTURED,
      },
      {
        src: "projects/one-river-two-memories/gallery-4.jpg",
        alt: "King Dingane kaSenzangakhona's story card beside an engraved portrait, the river winding behind him",
        caption: CAPTURED,
      },
      {
        src: "projects/one-river-two-memories/gallery-5.jpg",
        alt: "Andries Pretorius's story card beside a seated portrait of him, the river winding between them",
        caption: CAPTURED,
      },
      {
        src: "projects/one-river-two-memories/gallery-6.jpg",
        alt: "The aftermath as a split timeline, 1881–1902: “Authority Under Pressure” on the Zulu side, “The British Enemy Returns” on the Voortrekker side",
        caption: CAPTURED,
      },
    ],
    caseStudy: {
      challenge:
        "Tell one of South Africa's most contested days, the 1838 Battle of Blood River / Ncome, from two perspectives, without collapsing them into a single story. And make it something you move through, not a page you read.",
      approach: [
        {
          heading: "One medium, not six",
          body: "History, interaction, animation, sound, development and storytelling are treated as one material. The scroll is the narrator.",
        },
        {
          heading: "Two memories",
          body: "The same river and the same day, held side by side, each perspective given its own space in the telling.",
        },
        {
          heading: "Lean by design",
          body: "Astro and vanilla JavaScript keep the build light. GSAP ScrollTrigger sequences the scenes, Lenis smooths the scroll and the Canvas API handles what the DOM can't.",
        },
      ],
      highlights: [
        "Scroll-driven scene sequencing with GSAP ScrollTrigger",
        "Lenis smooth scrolling synced to GSAP",
        "Canvas API rendering alongside the DOM",
        "Static Astro build on Firebase Hosting",
      ],
    },
  },
  {
    slug: "leke-lente-lingo",
    title: "Leke Lente Lingo",
    tagline: "A Spring Day campaign where the crowd invents the Afrikaans words.",
    year: 2026,
    disciplines: ["Campaign", "Development"],
    role: "Campaign team · built the Lente Book website",
    client: "Lentedag",
    context: "Postgrad (PGDip), PP 410, Group 3",
    stack: ["React", "TypeScript", "Vite", "Tailwind", "Firebase"],
    links: {
      live: "https://lentebook-a7c82.web.app",
      code: "https://github.com/EnzoDV5/Leke-Lente-Lingo",
    },
    featured: true,
    order: 2,
    recognition: "Pendoring Finalist",
    theme: { accent: "#6DB8FF", surface: "#4FC6EF" },
    cover: "projects/leke-lente-lingo/cover.jpg",
    coverAlt:
      "Lente Book welcome screen, the Leke Lente Lingo logo on a bright cloud-filled sky with a hand-drawn sun",
    // Lente Book is an app: past the three onboarding screens it needs a username. The home
    // screen (gallery-4) is Enzo's own screenshot from inside the app.
    gallery: [
      {
        src: "projects/leke-lente-lingo/gallery-1.jpg",
        alt: "“Welkom by Lente Book.”, the first onboarding card under the Leke Lente Lingo logo",
        caption: CAPTURED,
      },
      {
        src: "projects/leke-lente-lingo/gallery-2.jpg",
        alt: "“Só werk die boek.”, three steps: Vind, Skep, and Stem & Versamel",
        caption: CAPTURED,
      },
      {
        src: "projects/leke-lente-lingo/gallery-3.jpg",
        alt: "“Bou jou profiel.”, a pixel-art avatar picker above the username field",
        caption: CAPTURED,
      },
      {
        src: "projects/leke-lente-lingo/gallery-4.jpg",
        alt: "The Lente Book home: the Leke Lente Lingo logo in a cloud, ringed by polaroids of shared concert photos and a live count of 1 284 photos",
        caption: CAPTURED,
      },
    ],
    caseStudy: {
      challenge:
        "Give a festival crowd a reason to play with Afrikaans. Boards and posters carry South African moments that have no Afrikaans word yet, and the crowd invents one.",
      approach: [
        {
          heading: "Lente Bingo",
          body: "A poster and board system built around Lente Bingo, a collecting mechanic. Doop Dit, Steel en Verbeter, Raai die Woord, Foto-Doop, Stem and Wildcard keep people inventing, voting and improving words.",
        },
        {
          heading: "Two winners",
          body: "The top word before the campaign becomes a performed song. The top word on festival day becomes Woord van Lentedag.",
        },
        {
          heading: "Lente Book",
          body: "The living dictionary where every word is kept. Its name cycles the word for “book” through Gauteng's four most-spoken languages. I built it.",
        },
      ],
      highlights: [
        "Lente Book built with React, TypeScript, Vite and Tailwind",
        "Firebase back end and hosting",
        "Platform name cycles “book” across four languages",
        "Pendoring Finalist, 2026",
      ],
    },
  },
  {
    slug: "honeybee-heroes",
    title: "Honeybee Heroes",
    tagline: "Adopt a hive, then talk to Mellie, a 3D bee who answers.",
    year: 2026,
    disciplines: ["Interactive", "Development"],
    // Every commit in the repo is Enzo's.
    role: "Design and development",
    client: "Honeybee Heroes",
    context: "Postgrad (PGDip), PP 410, Theme 2",
    stack: ["React", "Vite", "Three.js", "OpenAI gpt-4o-mini", "ElevenLabs TTS", "Firebase"],
    links: {
      live: "https://honey-bee-heroes.web.app",
      code: "https://github.com/EnzoDV08/honeybee-heroes",
    },
    featured: true,
    order: 3,
    theme: { accent: "#F4C04E", surface: "#F7F2E0" },
    cover: "projects/honeybee-heroes/cover.jpg",
    coverAlt:
      "Honeybee Heroes hero section, “Adopt a Hive. Support something bigger.” beside king proteas and Mellie the bee",
    gallery: [
      {
        src: "projects/honeybee-heroes/gallery-1.jpg",
        alt: "Section on the beekeepers who care for each hive, with training, local impact and future-skill cards",
        caption: CAPTURED,
      },
      {
        src: "projects/honeybee-heroes/gallery-2.jpg",
        alt: "“One landing starts the whole chain.”, a honey bee on a pink flower, with Mellie's speech bubble above",
        caption: CAPTURED,
      },
      {
        src: "projects/honeybee-heroes/gallery-3.jpg",
        alt: "“Explore the honey bee up close.”, an interactive Cape honey bee card with a range map of Southern Africa",
        caption: CAPTURED,
      },
      {
        src: "projects/honeybee-heroes/gallery-4.jpg",
        alt: "Adoption steps on stacked honeycomb cards: “Your hive is yours.” and “You follow the story.”",
        caption: CAPTURED,
      },
      {
        src: "projects/honeybee-heroes/gallery-5.jpg",
        alt: "“A third of every plate.”, a spread of fruit, vegetables and cheese with pollination stats and Mellie explaining",
        caption: CAPTURED,
      },
      {
        src: "projects/honeybee-heroes/gallery-6.jpg",
        alt: "“Four ways to become a hero.”, the Honeybee adoption package at R2,900 beside three more package cards",
        caption: CAPTURED,
      },
    ],
    caseStudy: {
      challenge:
        "Make adopting a hive feel personal for a real South African bee-adoption non-profit, on one landing page, and without a wall of text.",
      approach: [
        {
          heading: "Meet Mellie",
          body: "A 3D bee mascot, loaded as a GLB into Three.js, that visitors can talk to. Mellie answers through OpenAI gpt-4o-mini and speaks with ElevenLabs text-to-speech.",
        },
        {
          heading: "A guide on every screen",
          body: "The page moves from why farms depend on pollinators, to the people who care for each hive, to meeting your bees, with Mellie one tap away the whole time.",
        },
      ],
      highlights: [
        "Conversational 3D mascot (Three.js + GLB)",
        "AI responses with OpenAI gpt-4o-mini",
        "Voice with ElevenLabs text-to-speech",
        "React + Vite on Firebase",
      ],
    },
  },
  {
    slug: "stack-studio",
    title: "Stack Studio",
    tagline: "Our studio's own cinematic site, case studies, services and a guided brief.",
    year: 2026,
    disciplines: ["Development", "Brand"],
    // Every commit in the repo is Enzo's.
    role: "Co-founder · design and development",
    team: [
      { name: "Enzo De Vittorio", role: "Co-founder" },
      { name: "Armand Naudé", role: "Co-founder" },
    ],
    context: "Own business, co-founded with Armand Naudé",
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "GSAP", "Lenis", "Three.js", "Zod"],
    links: { live: todo("Stack Studio live URL") },
    featured: true,
    order: 4,
    theme: { accent: "#FF5A14", surface: "#0A0A0A" },
    mark: "projects/stack-studio/mark.png",
    wordmark: "projects/stack-studio/wordmark.png",
    cover: "projects/stack-studio/cover.jpg",
    coverAlt: "Stack Studio website, the STΛCK wordmark",
    gallery: [
      {
        src: "projects/stack-studio/gallery-1.jpg",
        alt: "“What do you need?”, service panels: Something new, open, beside Fix or improve it, Hosting and care and A software team",
        caption: CAPTURED_LOCAL,
      },
      {
        src: "projects/stack-studio/gallery-2.jpg",
        alt: "Services page: six service tiles, from New website to Questions, above “I need a new website.”",
        caption: CAPTURED_LOCAL,
      },
      {
        src: "projects/stack-studio/gallery-3.jpg",
        alt: "Process page: “How we work, start to finish.” and “From first message to kick-off.” beside stacked quote cards",
        caption: CAPTURED_LOCAL,
      },
      {
        src: "projects/stack-studio/gallery-4.jpg",
        alt: "The GC Solar case study on the home page, its site shown on a laptop and a phone",
        caption: CAPTURED_LOCAL,
      },
      {
        src: "projects/stack-studio/gallery-5.jpg",
        alt: "“From the first idea to what comes next.” under a strip of tool logos, beside the “A website that stands out” service",
        caption: CAPTURED_LOCAL,
      },
      {
        src: "projects/stack-studio/gallery-6.jpg",
        alt: "“Proof, not promises.”, the GC Solar and MPG Foundation case studies as device mockups",
        caption: CAPTURED_LOCAL,
      },
    ],
    caseStudy: {
      challenge:
        "A two-person studio that sells brand-led, cinematic websites needs a site that proves it by being one.",
      approach: [
        {
          heading: "A visual language",
          body: "Inter Tight and JetBrains Mono on near-black, a square grid, film grain and the orange Λ of the STΛCK mark.",
        },
        {
          heading: "Proof on every page",
          body: "Every project card and case study is a device mockup rendered from the client's real site, and the services page turns 3D devices as you scroll.",
        },
        {
          heading: "A brief, not a form",
          body: "A guided, step-by-step brief helps prospective clients say what they need and see an estimate before they ever book a call.",
        },
      ],
      highlights: [
        "Device mockups rendered from real client sites",
        "Scroll-scrubbed 3D phone and laptop (Three.js, rendered at build time)",
        "Guided project brief with an estimate",
        "GSAP + Lenis motion on React and TypeScript",
      ],
    },
  },
  {
    slug: "mpg-foundation",
    title: "MPG Foundation",
    tagline: "Production site for a community non-profit, built to last and be found.",
    year: 2026,
    disciplines: ["Development", "UX"],
    role: "Developer",
    team: [
      { name: "Enzo De Vittorio", role: "Development" },
      { name: "Imelda van Staden", role: "UX design" },
    ],
    client: "MPG Foundation (Make Pretoria Great)",
    context: "NPO client work",
    stack: ["Vite", "React", "Firestore", "Firebase Hosting", "Firebase Analytics", "EmailJS"],
    links: { live: "https://mpgf.org.za" },
    featured: true,
    order: 5,
    theme: { accent: "#7BC74D", surface: "#15210F" },
    cover: "projects/mpg-foundation/cover.jpg",
    coverAlt:
      "MPG Foundation home page, “Make Pretoria Great.” in large type under a jacaranda branch",
    gallery: [
      {
        src: "projects/mpg-foundation/gallery-1.jpg",
        alt: "“We just show up”, four principles beside a photo grid of community work",
        caption: CAPTURED,
      },
      {
        src: "projects/mpg-foundation/gallery-2.jpg",
        alt: "“Choosing action over silence”, the foundation's story beside the MPG logo",
        caption: CAPTURED,
      },
      {
        src: "projects/mpg-foundation/gallery-4.jpg",
        alt: "“Get Involved.”, volunteer, donation, partnership and nomination panels",
        caption: CAPTURED,
      },
      {
        src: "projects/mpg-foundation/gallery-6.jpg",
        alt: "“The same four steps, every project.”: Identify the need, Bring people together, Restore and rebuild",
        caption: CAPTURED,
      },
      {
        src: "projects/mpg-foundation/gallery-7.jpg",
        alt: "“Bringing the Centurion waterfront back to life.”, the first project, above photos of the volunteers and the restored river",
        caption: CAPTURED,
      },
      {
        src: "projects/mpg-foundation/gallery-5.jpg",
        alt: "“This city belongs to all of us.”, the closing statement on dark green",
        caption: CAPTURED,
      },
    ],
    caseStudy: {
      challenge:
        "Move a non-profit to a new domain without breaking the QR codes already printed on its material, and give it a site that is secure, fast and easy to find.",
      approach: [
        {
          heading: "A migration nobody notices",
          body: "mpgf.co.za moved to mpgf.org.za with 301 redirects preserved, so every printed QR code still lands where it should.",
        },
        {
          heading: "Forms that close the loop",
          body: "Dual-template EmailJS: the foundation gets an admin notification and the sender gets an auto-reply.",
        },
        {
          heading: "Hardened and findable",
          body: "Hardened Firestore security rules. SEO with Open Graph and JSON-LD, Google Search Console, and a YouTube facade so video doesn't slow the page down.",
        },
        {
          heading: "A brand to grow into",
          body: "A brand and style guide delivered alongside the build.",
        },
      ],
      highlights: [
        "Domain migration with 301s preserved for printed QR codes",
        "Dual-template EmailJS (admin notification + auto-reply)",
        "Hardened Firestore security rules",
        "Open Graph, JSON-LD and Google Search Console",
        "YouTube facade for performance",
      ],
    },
  },
  {
    slug: "forge-your-future",
    title: "Forge Your Future",
    // From the live site and its repo (D:/Coding/Forge_Your_Future_Open_Window: README, git):
    // Open Window's Digital Open Day campaign. A planet-orbit home, four degree worlds (Shape,
    // Capture, Imagine, Build) with their studios, people and student work, a mini game, an
    // eight-question quiz that matches you to a school and degree, and an Exam Stress Buster
    // campaign page. Built Oct–Nov 2026.
    tagline: "Four creative worlds, a mini game and a quiz that match students to a degree.",
    year: 2026,
    disciplines: ["Campaign", "Interactive"],
    role: "Frontend developer",
    team: [
      { name: "Enzo De Vittorio", role: "Frontend development" },
      { name: "Armand Naudé", role: "Mini game development" },
    ],
    // Open Window, Enzo's own university, came to him as the client for this one.
    client: "Open Window Institute",
    context: "Client work",
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "three.js", "MapLibre GL", "React Router"],
    links: { live: "https://virtualwindow.co.za/fyf/forge-your-future/" },
    featured: true,
    order: 6,
    theme: { accent: "#F2C230", surface: "#1E1257" },
    cover: "projects/forge-your-future/cover.jpg",
    coverAlt:
      "Forge Your Future home page, “Find the creative world that fits you.” beside an illustrated figure holding a game controller, film reel and colour swatches above the Forge Your Future banner",
    gallery: [
      {
        src: "projects/forge-your-future/gallery-1.jpg",
        alt: "“You've arrived in Shape”, the Visual Communication Design world, beside its character and the Shape Your Future banner",
        caption: CAPTURED,
      },
      {
        src: "projects/forge-your-future/gallery-2.jpg",
        alt: "“Now entering Capture”, the Film Arts world, a film backlot of five sets, with the Capture Your Future character",
        caption: CAPTURED,
      },
      {
        src: "projects/forge-your-future/gallery-3.jpg",
        alt: "“You've landed on Imagine”, the Game Design & Animation world, with Explore and Play mini game buttons",
        caption: CAPTURED,
      },
      {
        src: "projects/forge-your-future/gallery-4.jpg",
        alt: "“You've landed on Build”, the Creative Technologies world, a maker city drawn as a living blueprint",
        caption: CAPTURED,
      },
      {
        src: "projects/forge-your-future/gallery-5.jpg",
        alt: "The home page's degree row: Visual Communication Design, its planet ringed by student work, and its three majors",
        caption: CAPTURED,
      },
      {
        src: "projects/forge-your-future/gallery-6.jpg",
        alt: "“Where will your creative path take you?”, the eight-question quiz intro with Take the quiz",
        caption: CAPTURED,
      },
    ],
    caseStudy: {
      challenge:
        "Open Window's Digital Open Day had to speak to school learners who haven't chosen a creative field yet: four degrees that feel like places to explore, and a clear way for every visitor to find the one that fits.",
      approach: [
        {
          heading: "Four worlds, one template",
          body: "Shape, Capture, Imagine and Build share one layout driven by per-world config, so each degree gets its own colours, zones and signature interaction (a poster restyler, an edit suite, a lamp teardown) without four separate builds.",
        },
        {
          heading: "Campaign art, rebuilt in code",
          body: "Each finished poster is rebuilt from its PSD layers around a shared bag. On a world change the items dive into the bag, the character rematerialises and the new items land in place; on desktop the layers drift with the pointer.",
        },
        {
          heading: "A path to the right degree",
          body: "I developed the site's frontend, including the planet-orbit home and degree quiz. Armand developed the mini games in the four worlds.",
        },
        {
          heading: "Shipped onto the school's hosting",
          body: "A deploy script uploads the build over FTPS into its own folder on Open Window's shared hosting and removes only its own stale files, never the live quiz beside it.",
        },
      ],
      highlights: [
        "Four degree worlds from one config-driven template",
        "Campaign posters rebuilt from PSD layers, with pointer depth",
        "Planet-orbit home for mouse and touch",
        "Eight-question quiz that matches visitors to a degree",
        "Reduced-motion preferences respected",
        "FTPS deploy scoped to its own folder",
      ],
    },
  },

  // ───────────────────────────── More work ─────────────────────────────
  {
    slug: "salon-friend",
    title: "Salon Friend",
    // From the live site: accounts and sign-in, cart, checkout, and admin pages for products,
    // orders, users, analytics and emails (its deployed code), on Firebase.
    tagline: "Wholesale salon supplies store with accounts, checkout and an admin dashboard.",
    year: 2026,
    disciplines: ["Development"],
    role: todo("your role on Salon Friend"),
    client: "Salon Friend",
    context: "Client work",
    stack: ["React", "Firebase Auth", "Firestore", "Firebase Storage", "Firebase Hosting"],
    links: { live: "https://salon-friends.web.app" },
    featured: false,
    order: 7,
    theme: { accent: "#C8A867", surface: "#0A0A0B" },
    cover: "projects/salon-friend/cover.jpg",
    coverAlt:
      "Salon Friend home page, “Everything behind the chair, in one delivery.” over shelves of salon products",
  },
  {
    slug: "sympli",
    title: "Sympli",
    // From the repo (github.com/EnzoDV08/Sympli-AI-health): README, assets and git history
    // (Sep–Nov 2025, every commit Enzo's; the hero art carries his student number).
    tagline: "An AI nurse in your pocket: health chat, voice and medication reminders.",
    year: 2025,
    disciplines: ["UX", "Development"],
    role: "Design and development",
    client: "Academic",
    stack: ["Flutter", "Firebase", "OpenAI API", "Google Cloud TTS / STT", "Riverpod", "GoRouter", "Lottie"],
    links: { code: "https://github.com/EnzoDV08/Sympli-AI-health" },
    featured: false,
    earlier: true,
    order: 10,
    theme: { accent: "#1FB6A6" },
    cover: "projects/sympli/cover.jpg",
    coverAlt:
      "Three Sympli phone screens: chat history, the Sympli AI home with Quick Ask for medication and symptoms, and account settings with medication reminders",
  },
  {
    slug: "hushly-mobile-app",
    title: "Hushly Mobile App",
    tagline: "A gesture-led mindfulness app for a calmer moment, one shake away.",
    year: 2025,
    disciplines: ["UX", "Development"],
    role: "Design and development",
    client: "Academic",
    context: "Third year",
    stack: ["React Native", "Expo", "OpenAI API", "Firebase", "TypeScript", "Reanimated"],
    links: { code: "https://github.com/EnzoDV08/Hushly-MobileApp" },
    featured: false,
    earlier: true,
    order: 11,
    theme: { accent: "#7865DA" },
    cover: "projects/hushly/cover.png",
    coverAlt: "Hushly brand and three mobile app screens for mindful breathing",
  },

  // ───────────────────────────── Earlier work ─────────────────────────────
  {
    slug: "sportify",
    title: "Sportify",
    tagline: "Sports events and achievements app, React and TypeScript on .NET.",
    year: 2025,
    disciplines: ["Development"],
    role: todo("your role on the Sportify team"),
    team: [
      { name: "@JoshuaDeKlerk", role: todo("role") },
      { name: "@ZanderBez", role: todo("role") },
      { name: "@321008Jaco", role: todo("role") },
    ],
    client: "Academic",
    context: "Third year",
    stack: [
      "C#",
      ".NET",
      "pgAdmin 4",
      "Swagger",
      "React",
      "TypeScript",
      "Tailwind",
      "DaisyUI",
      "Vite",
    ],
    links: { code: "https://github.com/EnzoDV08/Sportify_Frontend.git" },
    featured: false,
    earlier: true,
    order: 12,
    theme: { accent: "#EBA43B" },
    cover: "projects/sportify/cover.jpg",
    coverAlt: "Sportify sign-up screens on a desktop, laptop and phone",
  },
  {
    slug: "superstore",
    title: "SuperStore",
    tagline: "React and Firebase marketplace with real-time order management.",
    year: 2024,
    disciplines: ["Development"],
    role: "Design and development",
    client: "Academic",
    context: "Second year, DV 200, Term 4",
    stack: ["React", "Firebase database", "Node.js", "Figma", "Bootstrap"],
    links: { code: "https://github.com/EnzoDV08/SuperStore_DV200_Term_4.git" },
    featured: false,
    earlier: true,
    order: 13,
    theme: { accent: "#E6B92F" },
    cover: "projects/superstore/cover.jpg",
    coverAlt: "SuperStore storefront and admin screens on three monitors",
  },
  {
    slug: "code-kids-academy",
    title: "Code Kids Academy",
    tagline: "Website for a coding school for kids aged 8 to 13.",
    year: 2024,
    disciplines: ["Development", "UX"],
    role: "Design and development",
    client: "Academic",
    context: "Second year, DV 200, Theory",
    stack: ["Figma", "HTML", "CSS"],
    links: { code: "https://github.com/EnzoDV08/CodeKidsAcademy_DV_200_Theory.git" },
    featured: false,
    earlier: true,
    order: 14,
    theme: { accent: "#1885D0" },
    cover: "projects/code-kids-academy/cover.jpg",
    coverAlt: "Code Kids Academy pages floating around a desktop monitor",
  },
  {
    slug: "real-estate",
    title: "Real Estate Website",
    tagline: "Property listings for buyers, sellers and admins, in PHP and MySQL.",
    year: 2024,
    disciplines: ["Development"],
    role: "Design and development",
    client: "Academic",
    context: "Second year, Term 3 final project",
    stack: ["PHP", "MySQL", "HTML", "CSS", "JavaScript"],
    links: {
      code: "https://github.com/EnzoDV08/Enzo_De_Vittorio_231244_Term3-Final-Project.git",
    },
    featured: false,
    earlier: true,
    order: 15,
    theme: { accent: "#64758D" },
    cover: "projects/real-estate/cover.jpg",
    coverAlt: "Real Estate Website listing, profile and admin pages around a laptop",
  },
  {
    slug: "rentalfinder",
    title: "RentalFinder",
    tagline: "Car rental web app built on external APIs and MongoDB.",
    year: 2024,
    disciplines: ["Development"],
    role: todo("your role on the RentalFinder team"),
    team: [
      { name: "@JoshuaDeKlerk", role: todo("role") },
      { name: "@ZanderBez", role: todo("role") },
      { name: "@Armand1711", role: todo("role") },
    ],
    client: "Academic",
    context: "Second year, DV 200, Group 2",
    stack: ["React", "MongoDB", "Node.js", "Figma", "Bootstrap"],
    links: { code: "https://github.com/EnzoDV08/DV_200_Group2_Final?tab=readme-ov-file" },
    featured: false,
    earlier: true,
    order: 16,
    theme: { accent: "#718ADD" },
    cover: "projects/rentalfinder/cover.jpg",
    coverAlt: "RentalFinder login, home and sign-up screens",
  },
  {
    slug: "escape-today",
    title: "Escape Today",
    tagline: "Platform for promoting local businesses and finding things to do.",
    year: 2024,
    disciplines: ["Development"],
    role: todo("your role on Escape Today"),
    client: todo("Escape Today client name"),
    context: "First client project",
    stack: ["React", "Firebase", "Node.js", "Figma", "Bootstrap"],
    links: { code: "https://github.com/EnzoDV5/Escape_Today.git" },
    featured: false,
    earlier: true,
    order: 17,
    theme: { accent: "#8B59D9" },
    cover: "projects/escape-today/cover.jpg",
    coverAlt: "Escape Today on a laptop, tablet and phone",
  },
  {
    slug: "catch-the-bokkie",
    title: "Catch The Bokkie",
    tagline: "Competition site prototype, find Bokkie at airports across South Africa.",
    year: 2025,
    disciplines: ["UX"],
    role: "UX and UI design",
    client: "Academic",
    context: "Third year, UX",
    stack: ["Figma", "UX", "UI", "Design system"],
    links: {
      prototype:
        "https://www.figma.com/proto/p5pNm46OTExXAImvYJOITC/UX-Term-3-Final?page-id=0%3A1&node-id=783-2487&p=f&viewport=382%2C944%2C0.03&t=3Rt3lB1He5aVainy-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=692%3A193",
    },
    featured: false,
    earlier: true,
    order: 18,
    theme: { accent: "#2772BE" },
    cover: "projects/catch-the-bokkie/cover.jpg",
    coverAlt: "Catch The Bokkie competition screens on a laptop, phone and tablet",
  },
  {
    slug: "climberbuddy",
    title: "ClimberBuddy",
    tagline: "Mobile app prototype for climbers.",
    year: 2024,
    disciplines: ["UX"],
    role: "UX and UI design",
    client: "Academic",
    context: "Second year, UX",
    stack: ["Figma", "UX", "UI", "Design system"],
    links: {
      prototype:
        "https://www.figma.com/proto/pw91ZDWO3rbXrxpGDV5MCs/UX-200?page-id=0%3A1&node-id=397-956&starting-point-node-id=460%3A256&t=6Fo2YXQdx0XeRXUa-1",
    },
    featured: false,
    earlier: true,
    order: 19,
    theme: { accent: "#D89539" },
    cover: "projects/climberbuddy/cover.jpg",
    coverAlt: "Three ClimberBuddy app screens on phones",
  },
  {
    slug: "agriflow",
    title: "Agriflow",
    tagline: "Farming app prototype that lets growers sell directly to buyers.",
    year: 2025,
    disciplines: ["UX"],
    role: "UX and UI design",
    client: "Academic",
    context: "Third year, UX and UI design",
    stack: ["Figma", "UX", "UI", "Design system"],
    links: {
      prototype:
        "https://www.figma.com/proto/hoQrbZ5yb6tRzsD6lFOnHy/UX-Farming-App-design?page-id=332%3A2000&node-id=613-4523&viewport=-310%2C375%2C0.31&t=jZQLiLBpJqZGySS5-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=613%3A4523",
    },
    featured: false,
    earlier: true,
    order: 20,
    theme: { accent: "#43A65C" },
    cover: "projects/agriflow/cover.jpg",
    coverAlt: "Agriflow earnings and onboarding screens on two phones",
  },
];

// ───────────────────────────── Queries ─────────────────────────────

const byOrder = (a: Project, b: Project) => a.order - b.order;

export const featuredProjects = projects.filter((p) => p.featured).sort(byOrder);
export const moreProjects = projects.filter((p) => !p.featured && !p.earlier).sort(byOrder);
export const earlierProjects = projects.filter((p) => p.earlier).sort(byOrder);

/** Projects with a case study page at /work/:slug. */
export const caseStudies = projects.filter((p) => p.caseStudy).sort(byOrder);

export function getProject(slug: string | undefined): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** The case study after this one, wrapping to the first. */
export function nextCaseStudy(slug: string): Project {
  const i = caseStudies.findIndex((p) => p.slug === slug);
  return caseStudies[(i + 1) % caseStudies.length]!;
}

export { disciplines } from "./disciplines";
