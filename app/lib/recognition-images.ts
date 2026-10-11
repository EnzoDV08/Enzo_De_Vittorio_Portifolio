import { toMap, type Picture } from "./images";

const pictures = import.meta.glob<Picture>(
  [
    "../assets/Hackathon/*.{jpg,jpeg,png}",
    "../assets/projects/Chandelleer/*.{jpg,jpeg,png}",
    "../assets/Openwindow.jpg",
    "../assets/logos/*.{jpg,jpeg,png}",
  ],
  {
    eager: true,
    import: "default",
    query: { w: "480;960", format: "avif;webp", as: "picture" },
  },
);

const byKey = toMap(pictures);

export function getRecognitionPicture(key: string): Picture | undefined {
  return byKey.get(key);
}
