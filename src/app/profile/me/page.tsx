"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function ProfileMePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace(`/profile/${user.id}`);
      } else {
        router.replace("/login?redirect=/profile/me");
      }
    }
  }, [user, loading, router]);

  if (loading) return <LoadingSpinner />;
  return <LoadingSpinner />;
}
