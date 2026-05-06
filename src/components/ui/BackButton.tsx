"use client";

import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="group mb-6 flex items-center gap-1.5 text-xs tracking-wider text-muted transition-colors hover:text-gold"
    >
      <FiArrowLeft
        size={14}
        className="transition-transform duration-200 group-hover:-translate-x-0.5"
      />
      返回
    </button>
  );
}
