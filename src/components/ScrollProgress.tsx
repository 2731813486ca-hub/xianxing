"use client";

import { useEffect } from "react";

export function ScrollProgress() {
  useEffect(() => {
    const el = document.getElementById("scrollProgress");
    if (!el) return;
    const handleScroll = () => {
      const p = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      el.style.width = `${Math.min(p, 1) * 100}%`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return <div id="scrollProgress" aria-hidden="true" />;
}
