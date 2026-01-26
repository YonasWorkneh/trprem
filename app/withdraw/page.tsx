"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/app/components/Header";
import BottomNavigation from "@/app/components/BottomNavigation";
import { ArrowLeft, RefreshCw, Wallet, Info, Lock, AlertTriangle } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useKyc } from "@/lib/hooks/useKyc";
import { getProfileData } from "@/lib/services/profileService";

export default function WithdrawPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { data: kycSubmission, loading: kycLoading } = useKyc(user?.id);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("10.00");
  const [walletAddress, setWalletAddress] = useState("");
  const [withdrawalPassword, setWithdrawalPassword] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("USDT-TRC20");

  const networkFee = 1.0;
  const minWithdrawal = 10;
  const calculatedReceive = parseFloat(withdrawalAmount) - networkFee;

  useEffect(() => {
    const loadBalance = async () => {
      if (user) {
        setLoading(true);
        const result = await getProfileData(user.id);
        if (result.success && result.data) {
          setBalance(result.data.balance.totalBalance);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      void loadBalance();
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 0);
    }
  }, [isAuthenticated, user]);

  const handleRefresh = async () => {
    if (user && !isRefreshing) {
      setIsRefreshing(true);
      const result = await getProfileData(user.id);
      if (result.success && result.data) {
        setBalance(result.data.balance.totalBalance);
      }
      setIsRefreshing(false);
    }
  };

  const handleWithdraw = () => {
    // TODO: Implement withdrawal logic
    console.log("Withdraw:", {
      amount: withdrawalAmount,
      address: walletAddress,
      network: selectedNetwork,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header title="trade prememium" />
        <main className="flex-1 pb-20 px-4 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Please log in to withdraw funds</p>
            <Link
              href="/login"
              className="text-blue-600 hover:underline"
            >
              Go to Login
            </Link>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  const hasKycRecord = kycSubmission !== null && !kycLoading;
  const showKycWarning = !hasKycRecord;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="trade prememium" />
      <main className="flex-1 pb-20">
        <div className="px-4 pt-6">
          <div className="max-w-xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Withdraw Funds</h1>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                aria-label="Refresh"
              >
                <RefreshCw
                  className={`w-5 h-5 text-gray-700 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </button>
            </div>

            {/* Available Balance Banner */}
            <div className="bg-blue-600 rounded-2xl p-6 mb-6 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet className="w-5 h-5 text-white" />
                      <span className="text-white/90 text-sm">Available Balance</span>
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">
                      ${balance.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <div className="flex items-center gap-1 text-white/70 bg-white/10 rounded-full px-2 py-1 w-fit text-[10px]">
                      <Info className="w-3 h-3 mr-1" />
                      <span>Daily withdrawal limit applies</span>
                    </div>
                  </div>
                  <div className="absolute right-0 top-0 opacity-10">
                    <Wallet className="w-32 h-32 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Withdrawal Form */}
            <div className="space-y-6">
              {/* Withdrawal Amount */}
              <div className="rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Withdrawal Amount
                  </label>
                  <span className="text-xs text-gray-500 border border-gray-300 rounded-full px-2 py-1 w-fit text-[10px]">Min: {minWithdrawal} USDT</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      className="w-full text-2xl font-bold text-gray-900 py-3 px-4 rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-gray-300"
                      placeholder="0.00"
                      min={minWithdrawal}
                      step="0.01"
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={selectedNetwork}
                      onChange={(e) => setSelectedNetwork(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 focus:border-gray-300 cursor-pointer"
                    >
                      <option value="USDT-TRC20">USDT-TRC20</option>
                      <option value="USDT-ERC20">USDT-ERC20</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wallet Address */}
              <div className="rounded-2xl border border-gray-200 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallet Address
                </label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="w-full py-3 px-4 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-gray-300"
                  placeholder="Enter your USDT address"
                />
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                  <Info className="w-4 h-4" />
                  <span>Ensure the network matches TRC20</span>
                </div>
              </div>

              {/* Network Fee */}
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Network Fee</span>
                <span className="text-sm font-medium text-gray-900">
                  {networkFee.toFixed(2)} USDT
                </span>
              </div>

              {/* You Receive */}
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">You Receive</span>
                <span className="text-lg font-bold text-green-600">
                  {calculatedReceive >= 0 ? calculatedReceive.toFixed(2) : "0.00"} USDT
                </span>
              </div>

              {/* Security */}
              <div className="rounded-2xl border border-gray-200 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Security
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={withdrawalPassword}
                    onChange={(e) => setWithdrawalPassword(e.target.value)}
                    className="w-full py-3 pl-12 pr-24 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-gray-300"
                    placeholder="Enter withdrawal password"
                  />
                  <Link
                    href="/personal/security"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-blue-600 hover:underline"
                  >
                    Set Password
                  </Link>
                </div>
              </div>

              {/* KYC Verification Warning */}
              {showKycWarning && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Verification Required
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Please complete your KYC verification to enable withdrawals.
                      </p>
                      <Link
                        href="/personal/kyc"
                        className="inline-block border rounded-full border-[rgb(252,211,77)] text-black px-4 py-2 text-xs hover:bg-[rgba(252,211,77,0.3)] transition-colors"
                      >
                        Complete KYC
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Withdraw Button */}
              <button
                onClick={handleWithdraw}
                disabled={showKycWarning || calculatedReceive < 0 || !walletAddress || !withdrawalPassword}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Withdraw Funds</span>
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
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
