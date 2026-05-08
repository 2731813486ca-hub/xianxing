"use client";

import { useEffect, useState } from "react";

export function SiteEntrance() {
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Small delay to ensure DOM is ready, then animate
    const timer = setTimeout(() => {
      setReady(true);
      // After the split animation completes (1s), hide the overlay
      const hide = setTimeout(() => setVisible(false), 1400);
      return () => clearTimeout(hide);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div id="siteEntrance" className={ready ? "split" : ""} aria-hidden="true">
      <div className="entrance-half left" />
      <div className="entrance-half right" />
      <div className="entrance-content">
        <div className="entrance-logo">先行</div>
        <div className="entrance-sub">XIANXING</div>
        <div className="entrance-bar">
          <div
            className="entrance-fill"
            style={{
              width: ready ? "100%" : "0%",
              transition: "width 0.8s cubic-bezier(0.76, 0, 0.24, 1)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
