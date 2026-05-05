"use client";

import { useState, useEffect } from "react";

export function LeftSidebar() {
  const [active, setActive] = useState<"works" | "community" | "">("");

  useEffect(() => {
    const works = document.getElementById("works");
    const community = document.getElementById("community");
    if (!works || !community) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let latest: "works" | "community" | "" = "";
        for (let i = entries.length - 1; i >= 0; i--) {
          const e = entries[i];
          if (e.isIntersecting) {
            latest = e.target.id as "works" | "community";
            break;
          }
        }
        setActive(latest);
      },
      { threshold: 0.2, rootMargin: "-80px 0px -50% 0px" }
    );

    observer.observe(works);
    observer.observe(community);
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
      <div className="relative flex flex-col items-center gap-0 rounded-full border border-white/[0.06] bg-black/30 px-3 py-5 backdrop-blur-md">
        {/* Vertical track line */}
        <div className="absolute left-1/2 top-[22px] h-[calc(100%-44px)] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

        {/* 最新作品 */}
        <button
          onClick={() => scrollTo("works")}
          className={`group relative flex flex-col items-center gap-2 transition-all duration-500 ${
            active === "works" ? "opacity-100" : "opacity-60 hover:opacity-90"
          }`}
        >
          <div
            className={`relative z-10 h-2.5 w-2.5 rounded-full border transition-all duration-500 ${
              active === "works"
                ? "border-gold bg-gold shadow-[0_0_10px_rgba(215,170,69,0.6)]"
                : "border-white/20 bg-transparent group-hover:border-gold/50"
            }`}
          />
          <span
            className={`whitespace-nowrap text-[10px] tracking-[0.2em] transition-all duration-500 ${
              active === "works"
                ? "font-semibold text-gold"
                : "font-normal text-white/30 group-hover:text-white/60"
            }`}
          >
            最新作品
          </span>
        </button>

        {/* Gap spacer */}
        <div className="h-10" />

        {/* 社群动态 */}
        <button
          onClick={() => scrollTo("community")}
          className={`group relative flex flex-col items-center gap-2 transition-all duration-500 ${
            active === "community" ? "opacity-100" : "opacity-60 hover:opacity-90"
          }`}
        >
          <div
            className={`relative z-10 h-2.5 w-2.5 rounded-full border transition-all duration-500 ${
              active === "community"
                ? "border-gold bg-gold shadow-[0_0_10px_rgba(215,170,69,0.6)]"
                : "border-white/20 bg-transparent group-hover:border-gold/50"
            }`}
          />
          <span
            className={`whitespace-nowrap text-[10px] tracking-[0.2em] transition-all duration-500 ${
              active === "community"
                ? "font-semibold text-gold"
                : "font-normal text-white/30 group-hover:text-white/60"
            }`}
          >
            社群动态
          </span>
        </button>
      </div>
    </nav>
  );
}
