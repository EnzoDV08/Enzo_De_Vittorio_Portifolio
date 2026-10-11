import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

function hydrate() {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <HydratedRouter />
      </StrictMode>,
    );
  });
}

// The prerendered HTML is complete and usable on its own (links are real <a>s), so let the
// browser paint it first and hydrate on the next frame. Keeps first paint and LCP independent
// of how long the JavaScript takes to evaluate.
requestAnimationFrame(() => setTimeout(hydrate, 0));
