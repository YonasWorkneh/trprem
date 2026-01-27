"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Phone, Save } from "lucide-react";
import Header from "@/app/components/Header";
import BottomNavigation from "@/app/components/BottomNavigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { getProfileData } from "@/lib/services/profileService";
import { toast } from "sonner";

export default function PersonalInformationPage() {
  const router = useRouter();
  const { isAuthenticated, user, profile, loading: authLoading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfileData = useCallback(async () => {
    if (!user?.id) return;

    try {
      const result = await getProfileData(user.id);
      if (result.success && result.data) {
        const profileData = result.data.profile;
        setFullName(profileData?.name || "");
        setEmail(profileData?.email || user?.email || "");
        setPhone(profileData?.phone || user?.phone || "");
      }
    } catch (error) {
      console.error("Failed to load profile data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadProfileData();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, loadProfileData]);

  const handleSave = async () => {
    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    setIsSaving(true);
    // TODO: Update profile via API
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Personal information updated successfully");
    } catch (error) {
      toast.error("Failed to update information. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header title="trade prememium" />
        <main className="flex-1 pb-20 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[var(--theme-primary)] border-t-transparent rounded-full animate-spin"></div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header title="trade prememium" />
        <main className="flex-1 pb-20 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Please log in to view your personal information</p>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  const displayName = profile?.name || user?.email?.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();
  const displayEmail = profile?.email || user?.email || "";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="trade prememium" />
      <main className="flex-1 pb-20">
        <div className="px-4 max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center gap-3 py-6">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Personal Info</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage your personal details
              </p>
            </div>
          </div>

          {/* User Profile Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-[var(--theme-primary)] rounded-full flex items-center justify-center mb-3">
              <span className="text-3xl font-bold text-[var(--theme-primary-text)]">
                {initial}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{displayName}</h2>
            <p className="text-sm text-gray-600">{displayEmail}</p>
          </div>

          {/* Information Input Fields */}
          <div className="space-y-6 mb-8">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)] focus:bg-white"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-900 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Email address cannot be changed
              </p>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Phone className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  disabled
                  placeholder="Enter phone number"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-900 placeholder:text-gray-400 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Contact support to update phone number
              </p>
            </div>
          </div>

          {/* Save Changes Button */}
          <button
            onClick={handleSave}
            disabled={isSaving || !fullName.trim()}
            className="w-full bg-[var(--theme-primary)] text-[var(--theme-primary-text)] py-4 rounded-xl font-semibold hover:bg-[var(--theme-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
