"use client";

import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import BottomNavigation from "@/app/components/BottomNavigation";
import { ArrowLeft, Mail, MessageCircle, HelpCircle } from "lucide-react";

export default function SupportPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="trade prememium" />
      <main className="flex-1 pb-20 px-4 pt-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors cursor-pointer hover:bg-gray-100 rounded-full p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Help Center
            </h1>
            <p className="text-sm text-gray-600">
              How can we help you today?
            </p>
          </div>

          {/* Support Options Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Email Support Card */}
            <div className="bg-[#FFFBEB] rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-yellow-600" strokeWidth={1.5} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Email Support
                </h2>
                <p className="text-sm text-gray-600">
                  For non-urgent inquiries. We typically respond within 24 hours.
                </p>
              </div>
              <button className="w-full bg-[#FBBF24] text-white py-3 rounded-xl font-medium hover:bg-[#F59E0B] transition-colors">
                Send Email
              </button>
            </div>

            {/* Live Chat & Tickets Card */}
            <div className="bg-[#EFF6FF] rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-blue-600" strokeWidth={1.5} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Live Chat & Tickets
                </h2>
                <p className="text-sm text-gray-600">
                  Start a conversation with our support team or manage your tickets.
                </p>
              </div>
              <button className="w-full bg-[#2563EB] text-white py-3 rounded-xl font-medium hover:bg-[#1D4ED8] transition-colors">
                Start Chat
              </button>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="text-center bg-gray-100/50 rounded-xl p-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-dashed border-gray-300 mb-4">
              <HelpCircle className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Need something else?
            </h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Check our FAQ section for quick answers to common questions about
              trading, deposits, and withdrawals.
            </p>
          </div>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
