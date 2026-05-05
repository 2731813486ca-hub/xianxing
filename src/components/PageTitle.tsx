"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export function PageTitle() {
  const { user, loading } = useAuth();

  useEffect(() => {
    const base = "先行 | 作品展示平台";
    if (!loading && user?.name) {
      document.title = `${base} — ${user.name}`;
    } else {
      document.title = base;
    }
  }, [user, loading]);

  return null;
}
