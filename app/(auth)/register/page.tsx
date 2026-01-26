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
import { resendConfirmationEmail } from "@/lib/services/authService";
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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isResending, setIsResending] = useState(false);
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
      setShowConfirmation(true);
    }
  };

  const handleResendEmail = async () => {
    if (!email) return;

    setIsResending(true);
    const resendResult = await resendConfirmationEmail(email);

    if (resendResult.success) {
      toast.success("Confirmation email sent", {
        description: "Please check your inbox",
      });
    } else {
      toast.error("Failed to resend email", {
        description: resendResult.error || "Please try again later",
      });
    }

    setIsResending(false);
  };

  if (showConfirmation) {
    return (
      <AuthLayout showFooter={false} showLogo={false}>
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[rgba(244,208,63,0.1)] rounded-full mb-4">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#F4D03F]"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Check your {registerMethod === "email" ? "email" : "phone"}
            </h1>
            <p className="text-sm text-gray-600">
              We&apos;ve sent a confirmation{" "}
              {registerMethod === "email" ? "email" : "message"} to
            </p>
            <p className="text-sm font-medium text-gray-900 mt-1">
              {registerMethod === "email" ? email : phone}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: `Open your ${registerMethod === "email" ? "email" : "messages"}`,
                  description: "Look for a message from tradeprememium",
                },
                {
                  step: 2,
                  title: "Click the confirmation link",
                  description: "This will verify your account and activate it",
                },
                {
                  step: 3,
                  title: "Return here to sign in",
                  description: "Once confirmed, you can log in to your account",
                },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-[#F4D03F] text-xs font-bold">
                      {item.step}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {registerMethod === "email" && (
              <button
                onClick={handleResendEmail}
                disabled={isResending}
                className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? "Sending..." : "Resend confirmation email"}
              </button>
            )}

            <Link
              href="/login"
              className="block w-full bg-[#F4D03F] text-yellow-900 py-3 rounded-lg font-medium hover:bg-[#F1C40F] transition-colors text-center"
            >
              Go to Sign In
            </Link>

            <Link
              href="/"
              className="w-full text-center text-sm text-gray-600 hover:text-gray-900 py-2 flex items-center justify-center gap-2 underline underline-offset-4"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Back to home</span>
            </Link>
          </div>

          <div className="mt-6 p-4 bg-[rgba(244,208,63,0.1)] rounded-lg border border-[rgba(244,208,63,0.2)]">
            <p className="text-xs text-[#F1C40F]">
              <strong>
                Didn&apos;t receive the{" "}
                {registerMethod === "email" ? "email" : "message"}?
              </strong>
              <br />
              Check your spam folder or try resending. Make sure you entered
              the correct{" "}
              {registerMethod === "email" ? "email address" : "phone number"}.
            </p>
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
                className="mt-1 w-4 h-4 text-[#F4D03F] border-gray-300 rounded focus:ring-[#F4D03F] focus:ring-2"
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
            className="w-full bg-[#F4D03F] text-yellow-900 py-3 rounded-lg font-normal hover:bg-[#F1C40F] mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-[#F4D03F] hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
