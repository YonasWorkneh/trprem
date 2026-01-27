"use client";

import Link from "next/link";
import { X } from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    id: "ai-arbitrage",
    label: "AI Arbitrage",
    description: "Automated trading strategies",
    href: "/ai-arbitrage",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ color: 'var(--theme-primary)' }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cpu w-5 h-5"><rect width="16" height="16" x="4" y="4" rx="2"></rect><rect width="6" height="6" x="9" y="9" rx="1"></rect><path d="M15 2v2"></path><path d="M15 20v2"></path><path d="M2 15h2"></path><path d="M2 9h2"></path><path d="M20 15h2"></path><path d="M20 9h2"></path><path d="M9 2v2"></path><path d="M9 20v2"></path></svg>
    ),
  },
  {
    id: "assets",
    label: "Assets",
    description: "View your portfolio",
    href: "/assets",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ color: 'var(--theme-primary)' }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list w-5 h-5"><path d="M3 12h.01"></path><path d="M3 18h.01"></path><path d="M3 6h.01"></path><path d="M8 12h13"></path><path d="M8 18h13"></path><path d="M8 6h13"></path></svg>
    ),
  },
  {
    id: "deposit",
    label: "Deposit",
    description: "Add funds to your account",
    href: "/deposit",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ color: 'var(--theme-primary)' }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign w-5 h-5"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
    ),
  },
  {
    id: "fast-trade",
    label: "Fast Trade",
    description: "Quick trading access",
    href: "/transactions",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ color: 'var(--theme-primary)' }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap w-5 h-5"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path></svg>
    ),
  },
  {
    id: "live-chat",
    label: "Live Chat",
    description: "Customer support",
    href: "/live-chat",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ color: 'var(--theme-primary)' }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-messages-square w-5 h-5"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"></path><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path></svg> 
    ),
  },
  {
    id: "loans",
    label: "Loans",
    description: "",
    href: "/loans",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ color: 'var(--theme-primary)' }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-landmark w-5 h-5"><line x1="3" x2="21" y1="22" y2="22"></line><line x1="6" x2="6" y1="18" y2="11"></line><line x1="10" x2="10" y1="18" y2="11"></line><line x1="14" x2="14" y1="18" y2="11"></line><line x1="18" x2="18" y1="18" y2="11"></line><polygon points="12 2 20 7 4 7"></polygon></svg> 
    ),
  },
  {
    id: "mining-pool",
    label: "Mining Pool",
    description: "Crypto mining services",
    href: "/mining-pool",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ color: 'var(--theme-primary)' }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layers w-5 h-5"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"></path><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"></path><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"></path></svg>  
    ),
  },
  {
    id: "options",
    label: "Options",
    description: "Options trading",
    href: "/transactions",
    icon: (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ color: 'var(--theme-primary)' }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-grid w-5 h-5"><rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect></svg>
    ),
  },
  {
    id: "withdraw",
    label: "Withdraw",
    description: "Withdraw your funds",
    href: "/withdraw",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ color: 'var(--theme-primary)' }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet-minimal w-5 h-5"><path d="M17 14h.01"></path><path d="M7 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14"></path></svg> 
    ),
  },
];

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Side Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Services</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full cursor-pointer flex items-center justify-center transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-2">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-4 px-4 py-3 hover:bg-[var(--theme-primary-bg-5)] transition-colors border-b border-gray-200"
              >
                <div className="rounded-xl bg-[var(--theme-primary-bg-5)] p-2">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-medium text-gray-900">
                    {item.label}
                  </div>
                  {item.description && (
                    <div className="text-sm text-gray-500 mt-0.5">
                      {item.description}
                    </div>
                  )}
                </div>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400 shrink-0"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Trade Premium &copy; 2026
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
