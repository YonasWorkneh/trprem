"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import AuthLayout from "@/app/components/auth/AuthLayout";
import { resendConfirmationEmail } from "@/lib/services/authService";
import { ArrowLeftIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default function ConfirmEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const phoneParam = searchParams.get("phone");
    
    if (emailParam) {
      setTimeout(() => {
        setEmail(emailParam);
      }, 0);
    } else if (phoneParam) {
      setTimeout(() => {
        setPhone(phoneParam);
      }, 0);
    } else {
      // If no email or phone, redirect to register
      router.push("/register");
    }
  }, [searchParams, router]);

  const handleResendEmail = async () => {
    if (!email) return;

    setIsResending(true);
    const result = await resendConfirmationEmail(email);
    
    if (result.success) {
      toast.success("Confirmation email sent", {
        description: "Please check your inbox",
      });
    } else {
      toast.error("Failed to resend email", {
        description: result.error || "Please try again later",
      });
    }
    
    setIsResending(false);
  };

  if (!email && !phone) {
    return null;
  }

  return (
   <AuthLayout showFooter={false} showLogo={false}>
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-600"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Check your {email ? "email" : "phone"}
          </h1>
          <p className="text-sm text-gray-600">
            We&apos;ve sent a confirmation {email ? "email" : "message"} to
          </p>
          <p className="text-sm font-medium text-gray-900 mt-1">
            {email || phone}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                <span className="text-blue-600 text-xs font-bold">1</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Open your {email ? "email" : "messages"}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Look for a message from tradeprememium
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                <span className="text-blue-600 text-xs font-bold">2</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Click the confirmation link
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  This will verify your account and activate it
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                <span className="text-blue-600 text-xs font-bold">3</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Return here to sign in
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Once confirmed, you can log in to your account
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {email && (
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
            className="block w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
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

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-800">
            <strong>Didn&apos;t receive the {email ? "email" : "message"}?</strong>
            <br />
            Check your spam folder or try resending. Make sure you entered the
            correct {email ? "email address" : "phone number"}.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
