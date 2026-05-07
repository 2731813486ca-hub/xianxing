"use client";
import { useState, useEffect } from "react";

export function useFirstVisit(key = "xianxing-entrance-shown"): boolean | null {
  const [isFirstVisit, setIsFirstVisit] = useState<boolean | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      return !sessionStorage.getItem(key);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (isFirstVisit === true) {
      try {
        sessionStorage.setItem(key, "1");
      } catch {}
    }
  }, [isFirstVisit, key]);

  return isFirstVisit;
}
