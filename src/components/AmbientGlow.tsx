"use client";

import { useEffect } from "react";

export function AmbientGlow() {
  useEffect(() => {
    const glow = document.getElementById("ambientGlow");
    if (!glow) return;

    let gx = window.innerWidth / 2;
    let gy = window.innerHeight / 2;
    let tx = gx;
    let ty = gy;

    const onMouse = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      glow.style.opacity = "1";
    };
    const onLeave = () => {
      glow.style.opacity = "0";
    };
    const onEnter = () => {
      glow.style.opacity = "1";
    };

    document.addEventListener("mousemove", onMouse);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    let raf: number;
    const loop = () => {
      gx += (tx - gx) * 0.06;
      gy += (ty - gy) * 0.06;
      glow.style.left = `${gx}px`;
      glow.style.top = `${gy}px`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener("mousemove", onMouse);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div id="ambientGlow" aria-hidden="true" />;
}
