export type Recognition = {
  title: string;
  detail: string;
  year: number;
  /** Short uppercase line for the marquee. */
  marquee: string;
  images?: { src: string; alt: string }[];
  mockups?: {
    laptop: string;
    phone: string;
  };
  logo?: string;
  logoLabel?: string;
  showcase?: string;
  project?: string;
};

export const recognition: Recognition[] = [
  {
    title: "Pendoring Finalist",
    detail: "Leke Lente Lingo",
    year: 2026,
    marquee: "Pendoring Finalist, Leke Lente Lingo",
    mockups: {
      laptop: "/devices/leke-lente-lingo/laptop/still-800.webp",
      phone: "/devices/leke-lente-lingo/phone/frame-47-440.webp",
    },
    showcase: "https://pendoring.awardhub.org/showcase/-id/P26-20114",
    project: "/work/leke-lente-lingo",
    logo: "logos/pendoring.png",
    logoLabel: "Pendoring",
  },
  {
    title: "Hackathon Winner",
    detail: "Open Window Hackathon",
    year: 2024,
    marquee: "Open Window Hackathon Winner, 2024",
    logo: "Openwindow.jpg",
    logoLabel: "Open Window",
    images: [
      {
        src: "Hackathon/Hackatohnteam.jpg",
        alt: "Open Window Hackathon team celebrating together outdoors",
      },
      {
        src: "Hackathon/hackathonteam2.jpg",
        alt: "Open Window Hackathon team celebrating around their arcade project",
      },
    ],
  },
  {
    title: "Top 10",
    detail: "Chandelier · Open Window Industrial Design",
    year: 2023,
    marquee: "Top 10, Open Window Industrial Design chandelier",
    logo: "Openwindow.jpg",
    logoLabel: "Open Window",
    images: [
      {
        src: "projects/Chandelleer/Enzo De Vittorio_photo_2023_2.jpg",
        alt: "Full view of the illuminated sculptural wooden chandelier",
      },
      {
        src: "projects/Chandelleer/Enzo De Vittorio_photo_2023_1.jpg",
        alt: "Close view of the chandelier's glowing bulb and layered wooden structure",
      },
      {
        src: "projects/Chandelleer/Enzo De Vittorio_photo_2023_3.jpg",
        alt: "The chandelier suspended in the studio during its photo shoot",
      },
    ],
  },
];
