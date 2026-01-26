"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import UserMenu from "./UserMenu";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { isAuthenticated, loading } = useAuth();

  return (
    <header className="w-full px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-gray-700 p-2">

          <Image
            src="/favicon.png"
            alt="Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          </div>
          <h1 className="hidden md:block text-lg text-gray-900 tracking-tight capitalize font-bold">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="w-20 h-8 bg-gray-200 animate-pulse rounded" />
          ) : isAuthenticated ? (
            <UserMenu />
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-900 hover:text-gray-700 text-sm font-medium"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="bg-[#F4D03F] text-yellow-900 px-4 py-2 rounded-full hover:bg-[#F1C40F] text-sm font-medium"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
