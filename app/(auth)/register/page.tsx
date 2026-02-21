"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import AuthLayout from "@/app/components/auth/AuthLayout";
import LoginMethodSelector from "@/app/components/auth/LoginMethodSelector";
import TextInput from "@/app/components/auth/TextInput";
import PhoneInput from "@/app/components/auth/PhoneInput";
import PasswordInput from "@/app/components/auth/PasswordInput";
import { useRegister } from "@/lib/hooks/useRegister";
import { ArrowLeftIcon } from "lucide-react";

type RegisterMethod = "email" | "mobile";

export default function RegisterPage() {
  const [registerMethod, setRegisterMethod] = useState<RegisterMethod>("email");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const { register, loading, error: registerError } = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      return;
    }

    const fullPhone = registerMethod === "mobile" ? `${countryCode}${phone}` : undefined;

    const result = await register(
      {
        fullName,
        email: registerMethod === "email" ? email : undefined,
        phone: registerMethod === "mobile" ? fullPhone : undefined,
        password,
        confirmPassword,
      },
      registerMethod
    );

    if (result) {
      setShowWelcome(true);
    }
  };

  if (showWelcome) {
    return (
      <AuthLayout showFooter={false} showLogo={false}>
        <div className="w-full max-w-md mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--theme-primary)] rounded-full mb-6">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[var(--theme-primary-text)]"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome!</h1>
          <p className="text-gray-600 mb-8">
            Your account has been created. You can sign in now to get started.
          </p>

          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full bg-[var(--theme-primary)] text-[var(--theme-primary-text)] py-3 rounded-lg font-medium hover:bg-[var(--theme-primary-hover)] transition-colors text-center cursor-pointer"
            >
              Sign in
            </Link>
            <Link
              href="/"
              className="w-full text-center text-sm text-gray-600 hover:text-gray-900 py-2 flex items-center justify-center gap-2 underline underline-offset-4"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Back to home</span>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
      <p className="text-sm text-gray-600 mb-8">
        Start trading with tradeprememium today
      </p>

      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Sign up</h2>

        <LoginMethodSelector
          selectedMethod={registerMethod}
          onMethodChange={setRegisterMethod}
        />

        <form onSubmit={handleSubmit}>
          <TextInput
            id="fullName"
            label="Full name"
            placeholder="John Doe"
            value={fullName}
            onChange={setFullName}
            required
          />

          {registerMethod === "email" ? (
            <TextInput
              id="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
              required
            />
          ) : (
            <PhoneInput
              id="phone"
              label="Mobile number"
              placeholder="Enter mobile number"
              value={phone}
              countryCode={countryCode}
              onValueChange={setPhone}
              onCountryCodeChange={setCountryCode}
              required
            />
          )}

          <PasswordInput
            id="password"
            label="Password"
            placeholder="Create a strong password"
            value={password}
            onChange={setPassword}
          />

          <PasswordInput
            id="confirmPassword"
            label="Confirm password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            error={
              confirmPassword && password !== confirmPassword
                ? "Passwords do not match"
                : undefined
            }
          />

          {registerError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{registerError}</p>
            </div>
          )}

          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-[#F4D03F] border-gray-300 rounded focus:ring-[#F4D03F] focus:ring-2 accent-[#F4D03F]"
              />
              <span className="text-sm text-gray-700">
                I have read and agree to the{" "}
                <Link href="/user-agreement" className="text-[#F4D03F] hover:underline">
                  User Agreement
                </Link>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !agreedToTerms}
            className="w-full bg-[var(--theme-primary)] text-[var(--theme-primary-text)] py-3 rounded-lg font-normal hover:bg-[var(--theme-primary-hover)] mb-4 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-(--color-theme-primary-text) hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
