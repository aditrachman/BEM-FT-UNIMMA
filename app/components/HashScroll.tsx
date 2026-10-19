"use client";

import { useEffect } from "react";

// Scroll to hash when the landing page loads or when the hash changes
// (same-page anchor clicks).
export default function HashScroll() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let activeId = "";

    const scrollToHash = () => {
      const id = window.location.hash.slice(1);
      activeId = id;
      if (timer) clearTimeout(timer);
      if (!id) return;
      let tries = 0;
      const attempt = () => {
        if (activeId !== id) return; // superseded by a newer hash
        const el = document.getElementById(id);
        if (el) return void el.scrollIntoView({ behavior: "smooth" });
        // lazy content may render late; retry for up to ~5s
        if (tries++ < 50) timer = setTimeout(attempt, 100);
      };
      attempt();
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash, false);
    return () => {
      window.removeEventListener("hashchange", scrollToHash);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return null;
}
