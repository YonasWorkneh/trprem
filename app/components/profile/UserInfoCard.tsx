"use client";

import { useState } from "react";
import type { Profile } from "@/lib/types/auth";

interface UserInfoCardProps {
  profile: Profile | null;
  userId: string;
}

export default function UserInfoCard({ profile, userId }: UserInfoCardProps) {
  const [copied, setCopied] = useState(false);

  const displayName = profile?.name || "User";
  const initial = displayName.charAt(0).toUpperCase();
  const shortId = userId.substring(0, 8);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(userId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = userId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
          <span className="text-2xl font-bold text-white">{initial}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-gray-900">{displayName}</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-gray-600">ID: {shortId}</span>
            <button
              onClick={handleCopyId}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              aria-label="Copy ID"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-600"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
            {copied && (
              <span className="text-xs text-green-600">Copied!</span>
            )}
          </div>
          <span className="text-sm text-gray-600">Level 1</span>
        </div>
      </div>
    </div>
  );
}
