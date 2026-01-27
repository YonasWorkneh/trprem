"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const categories = [
  "Account Issues",
  "Deposit/Withdrawal",
  "Trading",
  "Technical Support",
  "General Inquiry",
  "Other",
];

const priorities = [
  { value: "low", label: "Low - Question" },
  { value: "medium", label: "Medium - Issue" },
  { value: "high", label: "High - Urgent" },
];

export default function CreateTicketModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateTicketModalProps) {
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("medium");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!category) {
      toast.error("Please select a category");
      return;
    }
    if (!subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSubmitting(true);
    // TODO: Submit ticket via API
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Support ticket created successfully");
      // Reset form
      setCategory("");
      setPriority("medium");
      setSubject("");
      setMessage("");
      onClose();
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to create ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setCategory("");
    setPriority("medium");
    setSubject("");
    setMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
            <h2 className="text-xl font-bold text-gray-900">
              Create Support Ticket
            </h2>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <p className="text-sm text-gray-600">
              Describe your issue and we&apos;ll get back to you as soon as possible.
            </p>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full bg-white border border-gray-300 rounded-xl py-2.5 px-3 text-sm font-medium text-gray-900 cursor-pointer">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {categories.map((cat) => (
                    <SelectItem
                      key={cat}
                      value={cat}
                      className="text-gray-900 focus:text-gray-900 focus:bg-gray-100 cursor-pointer"
                    >
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="w-full bg-white border border-gray-300 rounded-xl py-2.5 px-3 text-sm font-medium text-gray-900 cursor-pointer">
                  <SelectValue>
                    {priorities.find((p) => p.value === priority)?.label}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {priorities.map((p) => (
                    <SelectItem
                      key={p.value}
                      value={p.value}
                      className="text-gray-900 focus:text-gray-900 focus:bg-gray-100 cursor-pointer"
                    >
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of the issue"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)]"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe your issue in detail..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)] resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCancel}
                className="flex-1 bg-white border border-gray-300 text-gray-900 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !category || !subject || !message}
                className="flex-1 bg-[var(--theme-primary)] text-[var(--theme-primary-text)] py-3 rounded-xl font-semibold hover:bg-[var(--theme-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? "Submitting..." : "Submit Ticket"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
