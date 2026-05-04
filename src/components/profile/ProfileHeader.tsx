"use client";

import type { UserProfile } from "@/types";
import { FiMail, FiUser } from "react-icons/fi";

interface ProfileHeaderProps {
  profile: UserProfile & { _count?: { works: number } };
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center sm:flex-row sm:text-left">
      <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-2 border-gold bg-card">
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <FiUser size={32} className="text-gold" />
        )}
      </div>
      <div className="flex-1">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          {profile.name}
        </h1>
        {profile.bio && (
          <p className="mt-1 text-sm text-muted">{profile.bio}</p>
        )}
        <div className="mt-2 flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1">
            <FiMail size={12} />
            {profile.email}
          </span>
          {profile._count && (
            <span>{profile._count.works} 作品 Works</span>
          )}
        </div>
      </div>
    </div>
  );
}
