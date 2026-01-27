"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import Header from "@/app/components/Header";
import BottomNavigation from "@/app/components/BottomNavigation";
import { toast } from "sonner";

export default function SecurityPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"password" | "pin">("password");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // PIN state
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [isSettingPin, setIsSettingPin] = useState(false);

  const handleUpdatePassword = async () => {
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsUpdatingPassword(true);
    // TODO: Update password via API
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Failed to update password. Please try again.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSetPin = async () => {
    if (!newPin || newPin.length !== 6 || !/^\d+$/.test(newPin)) {
      toast.error("PIN must be exactly 6 digits");
      return;
    }
    if (newPin !== confirmPin) {
      toast.error("PINs do not match");
      return;
    }

    setIsSettingPin(true);
    // TODO: Set withdrawal PIN via API
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Withdrawal PIN set successfully");
      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
    } catch (error) {
      toast.error("Failed to set PIN. Please try again.");
    } finally {
      setIsSettingPin(false);
    }
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Security</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage your account security
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
            <button
              onClick={() => setActiveTab("password")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "password"
                  ? "bg-[var(--theme-primary-bg-16)] border border-[var(--theme-primary)] text-[var(--theme-primary-text)]"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              Login Password
            </button>
            <button
              onClick={() => setActiveTab("pin")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "pin"
                  ? "bg-[var(--theme-primary-bg-16)] border border-[var(--theme-primary)] text-[var(--theme-primary-text)]"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              Withdrawal PIN
            </button>
          </div>

          {/* Login Password Tab */}
          {activeTab === "password" && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-5 h-5 text-[var(--theme-primary)]" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Change Password
                </h2>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Update your login password to keep your account secure.
              </p>

              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Update Password Button */}
              <button
                onClick={handleUpdatePassword}
                disabled={isUpdatingPassword || !currentPassword || !newPassword || !confirmPassword}
                className="w-full bg-[var(--theme-primary)] text-[var(--theme-primary-text)] py-4 rounded-xl font-semibold hover:bg-[var(--theme-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-6"
              >
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          )}

          {/* Withdrawal PIN Tab */}
          {activeTab === "pin" && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-5 h-5 text-[var(--theme-primary)]" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Withdrawal PIN
                </h2>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Set a secure PIN for withdrawals and sensitive transactions.
              </p>

              <div className="space-y-4">
                {/* Current PIN (if set) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current PIN (if set)
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPin ? "text" : "password"}
                      value={currentPin}
                      onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="Enter current PIN"
                      maxLength={6}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPin(!showCurrentPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      {showCurrentPin ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New PIN */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New PIN
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPin ? "text" : "password"}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="Enter new 6-digit PIN"
                      maxLength={6}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPin(!showNewPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      {showNewPin ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm New PIN */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New PIN
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPin ? "text" : "password"}
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="Confirm new PIN"
                      maxLength={6}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPin(!showConfirmPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      {showConfirmPin ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Set Withdrawal PIN Button */}
              <button
                onClick={handleSetPin}
                disabled={isSettingPin || !newPin || !confirmPin}
                className="w-full bg-[var(--theme-primary)] text-[var(--theme-primary-text)] py-4 rounded-xl font-semibold hover:bg-[var(--theme-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-6"
              >
                {isSettingPin ? "Setting..." : "Set Withdrawal PIN"}
              </button>
            </div>
          )}
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
