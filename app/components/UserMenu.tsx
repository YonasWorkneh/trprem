"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { logout } from "@/lib/services/authService";

export default function UserMenu() {
  const { profile, user } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const result = await logout();
    if (result.success) {
      router.push("/");
      router.refresh();
    }
    setIsLoggingOut(false);
    setIsMenuOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-base font-bold text-gray-900">{displayName}</span>
        </div>
        <button
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
            <Link
              href="/personal"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            <Link
              href="/transactions"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Transactions
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50"
            >
              {isLoggingOut ? "Logging out..." : "Log out"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
