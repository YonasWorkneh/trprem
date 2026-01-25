"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLayout from "@/app/components/auth/AuthLayout";
import LoginMethodSelector from "@/app/components/auth/LoginMethodSelector";
import TextInput from "@/app/components/auth/TextInput";
import PhoneInput from "@/app/components/auth/PhoneInput";
import PasswordInput from "@/app/components/auth/PasswordInput";
import { useRegister } from "@/lib/hooks/useRegister";

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
  const { register, loading, error: registerError } = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      return;
    }

    const fullPhone = registerMethod === "mobile" ? `${countryCode}${phone}` : undefined;

    await register(
      {
        fullName,
        email: registerMethod === "email" ? email : undefined,
        phone: registerMethod === "mobile" ? fullPhone : undefined,
        password,
        confirmPassword,
      },
      registerMethod
    );
  };

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
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-gray-700">
                I have read and agree to the{" "}
                <Link href="/user-agreement" className="text-blue-600 hover:underline">
                  User Agreement
                </Link>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !agreedToTerms}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-normal hover:bg-blue-700 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
