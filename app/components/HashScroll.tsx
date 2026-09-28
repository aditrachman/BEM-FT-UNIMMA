"use client";

import { useEffect } from "react";

// Scroll to hash when the landing page loads or when the hash changes
// (same-page anchor clicks).
export default function HashScroll() {
  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 60);
    };
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash, false);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return null;
}
