"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { ChartLine, FileText, Home, User } from "lucide-react";
import Link from "next/link";

type NavItemId = "home" | "markets" | "transactions" | "personal";

interface NavItem {
  id: NavItemId;
  label: string;
  requiresAuth?: boolean;
  href: string;
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", href: "/"   },
  { id: "markets", label: "Markets", href: "/markets" },
  { id: "transactions", label: "Transactions", requiresAuth: true, href: "/transactions" },
  { id: "personal", label: "Personal", requiresAuth: true, href: "/personal" },
];

function HomeIcon({ isActive }: { isActive: boolean }) {
  return (
    <Home className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-600"}`}/>
  );
}

function MarketsIcon({ isActive }: { isActive: boolean }) {
  return (
    <ChartLine className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-600"}`}/>
  );
}

function TransactionsIcon({ isActive }: { isActive: boolean }) {
  return (
    <FileText className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-600"}`}/>
  );
}

function PersonalIcon({ isActive }: { isActive: boolean }) {
  return (
    <User className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-600"}`}/>
  );
}

export default function BottomNavigation() {
  const pathname = usePathname();
  const { isAuthenticated, profile, user } = useAuth();

  const getActiveItem = (): NavItemId | null => {
    for (const item of navItems) {
      if (item.href === "/" && pathname === "/") {
        return item.id;
      }
      if (item.href !== "/" && pathname.startsWith(item.href)) {
        return item.id;
      }
    }
    return null;
  };

  const activeItem = getActiveItem();

  const renderIcon = (id: NavItemId, isActive: boolean) => {
    switch (id) {
      case "home":
        return <HomeIcon isActive={isActive} />;
      case "markets":
        return <MarketsIcon isActive={isActive} />;
      case "transactions":
        return <TransactionsIcon isActive={isActive} />;
      case "personal":
        return <PersonalIcon isActive={isActive} />;
    }
  };

  const displayEmail = profile?.email || user?.email || user?.phone || "";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/50 backdrop-blur-lg border-t border-gray-200/50 rounded-t-3xl shadow-lg">
      <div className="mx-auto px-4">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const isActive = activeItem === item.id;
            const href = item.requiresAuth && !isAuthenticated ? "/login" : item.href;
            return (
              <Link
                key={item.id}
                href={href}
                className={`flex flex-col items-center gap-1 cursor-pointer px-6 hover:bg-gray-100/50! p-2 rounded-lg transition-colors ${
                  isActive ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {renderIcon(item.id, isActive)}
                <span className="text-xs font-normal">{item.label}</span>
              </Link>
            );
          })}
        </div>
        {isAuthenticated && displayEmail && (
          <div className="px-4 pb-2 text-center">
            <span className="text-xs text-gray-600">{displayEmail}</span>
          </div>
        )}
      </div>
    </nav>
  );
}
