"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import Header from "@/app/components/Header";
import BottomNavigation from "@/app/components/BottomNavigation";
import ProfileHeader from "@/app/components/profile/ProfileHeader";
import UserInfoCard from "@/app/components/profile/UserInfoCard";
import BalanceCard from "@/app/components/profile/BalanceCard";
import ProfileSection from "@/app/components/profile/ProfileSection";
import ProfileItem from "@/app/components/profile/ProfileItem";
import { useAuth } from "@/lib/hooks/useAuth";
import { getProfileData } from "@/lib/services/profileService";
import { logout } from "@/lib/services/authService";
import type { WalletBalance } from "@/lib/types/profile";

function PersonIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function HeadphonesIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

export default function PersonalPage() {
  const router = useRouter();
  const { user, profile, isAuthenticated, loading: authLoading } = useAuth();
  const [balance, setBalance] = useState<WalletBalance>({
    totalBalance: 0,
    assetsValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const loadData = async () => {
        setLoading(true);
        const result = await getProfileData(user.id);
        if (result.success && result.data) {
          setBalance(result.data.balance);
        }
        setLoading(false);
      };
      loadData();
    }
  }, [isAuthenticated, user]);

  const handleRefresh = async () => {
    if (user && !isRefreshing) {
      setIsRefreshing(true);
      const result = await getProfileData(user.id);
      if (result.success && result.data) {
        setBalance(result.data.balance);
        toast.success("Profile refreshed successfully", {
          description: "Your profile data has been updated",
        });
      } else {
        toast.error("Failed to refresh", {
          description: result.error || "Unable to update profile data",
        });
      }
      setIsRefreshing(false);
    }
  };

  const handleLogout = async () => {
    console.log("logging out");
    const result = await logout();
    if (result.success) {
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    } else {
      toast.error("Logout failed", {
        description: result.error || "Unable to log out",
      });
    }
  };

  const handleClearCache = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header title="trade prememium" />
        <main className="flex-1 pb-20 px-4 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header title="trade prememium" />
        <main className="flex-1 pb-20 px-4 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Please log in to view your profile</p>
            <Link
              href="/login"
              className="text-[#F4D03F] hover:underline"
            >
              Go to Login
            </Link>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="trade prememium" />
      <main className="flex-1 pb-20 px-4 pt-6">
        <div className="max-w-2xl mx-auto">
          <ProfileHeader
            onRefresh={handleRefresh}
            onLogout={handleLogout}
            isRefreshing={isRefreshing}
          />
          <UserInfoCard profile={profile} userId={user.id} />
          <BalanceCard
            totalBalance={balance.totalBalance}
            assetsValue={balance.assetsValue}
          />

          <ProfileSection title="Account & Security">
            <ProfileItem
              icon={<PersonIcon />}
              title="Personal Information"
              description="Manage your personal details"
              href="/personal/information"
            />
            <ProfileItem
              icon={<ShieldIcon />}
              title="Security Settings"
              description="Password, 2FA, and login history"
              href="/personal/security"
            />
            <ProfileItem
              icon={<FileTextIcon />}
              title="KYC Verification"
              description="Identity verification status"
              href="/person/kyc"
              badge={
                profile?.kyc_status === "verified"
                  ? "Verified"
                  : profile?.kyc_status === "pending"
                    ? "Pending"
                    : profile?.kyc_status === "rejected"
                      ? "Rejected"
                      : "Not Started"
              }
            />
          </ProfileSection>

          <ProfileSection title="History & Records">
            <ProfileItem
              icon={<ClockIcon />}
              title="Transaction History"
              description="View your deposits and withdrawals"
              href="/transactions/history"
            />
          </ProfileSection>

          <ProfileSection title="Settings & Support">
            <ProfileItem
              icon={<HeadphonesIcon />}
              title="Customer Support"
              description="Get help with your account"
              href="/support"
            />
            <ProfileItem
              icon={<TrashIcon />}
              title="Clear Cache"
              description="Clear local app data"
              onClick={handleClearCache}
            />
          </ProfileSection>

          <div className="text-center text-xs text-gray-400 mt-8 mb-4">
            Version 1.0.0 • Build 2024.05
          </div>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
