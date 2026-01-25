"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { logout } from "@/lib/services/authService";
import SideMenu from "./SideMenu";

export default function UserMenu() {
  const { profile, user } = useAuth();
  const router = useRouter();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const displayName = profile?.name || user?.email?.split("@")[0] || "User";
  const displayEmail = profile?.email || user?.email || user?.phone || "";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const result = await logout();
    if (result.success) {
      router.push("/");
      router.refresh();
    }
    setIsLoggingOut(false);
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <div className="flex flex-col items-end">
            <span className="text-base font-bold text-gray-900">{displayName}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-600">{displayEmail}</span>
          </div>
        </div>
        <button
          className="p-2 cursor-pointer rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          aria-label="Email"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </button>
        <button
          onClick={() => setIsSideMenuOpen(true)}
          className="p-2 rounded-full cursor-pointer hover:bg-gray-100 flex items-center justify-center transition-colors"
          aria-label="Menu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
      <SideMenu isOpen={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)} />
    </>
  );
}
