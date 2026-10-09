import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Register once, in the browser only. Prerendering imports this module but never animates.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 1 });
}

export const EASE_IN = "power3.out";
export const EASE_PAGE = "expo.inOut";

export { gsap, ScrollTrigger, SplitText, useGSAP };
