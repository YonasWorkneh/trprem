"use client";

import { Package } from "lucide-react";

interface EmptyHostingStateProps {
  status: "running" | "ended";
}

export default function EmptyHostingState({
  status,
}: EmptyHostingStateProps) {
  const isRunning = status === "running";

  return (
    <div className="bg-white rounded-3xl p-12 border border-gray-200 text-center">
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
          <Package className="w-10 h-10 text-gray-400" />
        </div>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        {isRunning ? "No running hostings" : "No ended hostings"}
      </h3>
      <p className="text-sm text-gray-600">
        {isRunning
          ? "Start hosting to see your active orders here"
          : "Completed hostings will appear here"}
      </p>
    </div>
  );
}
