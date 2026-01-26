"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLayout from "@/app/components/auth/AuthLayout";
import LoginMethodSelector from "@/app/components/auth/LoginMethodSelector";
import TextInput from "@/app/components/auth/TextInput";
import PhoneInput from "@/app/components/auth/PhoneInput";
import PasswordInput from "@/app/components/auth/PasswordInput";
import { useLogin } from "@/lib/hooks/useLogin";

type LoginMethod = "email" | "mobile";

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [password, setPassword] = useState("");
  const { login, loading, error: loginError } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullPhone = loginMethod === "mobile" ? `${countryCode}${phone}` : undefined;

    await login(
      {
        email: loginMethod === "email" ? email : undefined,
        phone: loginMethod === "mobile" ? fullPhone : undefined,
        password,
      },
      loginMethod
    );
  };

  return (
    <AuthLayout isLogin={true}>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
      <p className="text-sm text-gray-600 mb-8">
        Sign in to your tradeprememium account
      </p>

      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Sign in</h2>

        <LoginMethodSelector
          selectedMethod={loginMethod}
          onMethodChange={setLoginMethod}
        />

        <form onSubmit={handleSubmit}>
          {loginMethod === "email" ? (
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
            placeholder="Enter your password"
            value={password}
            onChange={setPassword}
            error={loginError || undefined}
          />

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{loginError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F4D03F] text-yellow-900 py-3 rounded-lg font-normal hover:bg-[#F1C40F] mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="flex justify-between text-sm">
            <Link href="/register" className="text-[#F4D03F] hover:underline">
              Create account
            </Link>
            <Link href="/forgot-password" className="text-[#F4D03F] hover:underline">
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
