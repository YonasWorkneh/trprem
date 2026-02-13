"use client";

import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Send,
  Paperclip,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useSupportMessages } from "@/lib/hooks/useSupportMessages";
import { addSupportMessage } from "@/lib/services/supportService";
import { SupportTicket } from "@/lib/services/supportService";
import { toast } from "sonner";

interface TicketChatProps {
  ticket: SupportTicket;
  onBack: () => void;
}

export default function TicketChat({ ticket, onBack }: TicketChatProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { messages, isLoading, error, refetch } = useSupportMessages({
    ticketId: ticket.id,
    enabled: !!ticket.id,
  });

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !user?.id) return;

    setIsSubmitting(true);
    try {
      const result = await addSupportMessage(user.id, {
        ticket_id: ticket.id,
        message: message.trim(),
      });

      if (result.success) {
        setMessage("");
        refetch(); // Refresh messages
        toast.success("Message sent successfully");
      } else {
        toast.error(result.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Send message error:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setIsSubmitting(true);
    try {
      const result = await addSupportMessage(user.id, {
        ticket_id: ticket.id,
        message: "Shared an image",
        image: file,
      });

      if (result.success) {
        refetch(); // Refresh messages
        toast.success("Image uploaded successfully");
      } else {
        toast.error(result.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload image error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsSubmitting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-700";
      case "in_progress":
        return "bg-yellow-100 text-yellow-700";
      case "resolved":
        return "bg-green-100 text-green-700";
      case "closed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "normal":
        return "bg-orange-100 text-orange-700";
      case "low":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900 truncate">
                {ticket.subject}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    ticket.status,
                  )}`}
                >
                  {ticket.status.replace("_", " ")}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                    ticket.priority,
                  )}`}
                >
                  {ticket.priority}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--theme-primary)]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-3 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Failed to load messages</span>
              </div>
              <p className="text-sm text-red-600 mt-2">{error}</p>
              <button
                onClick={() => refetch()}
                className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                Try again
              </button>
            </div>
          ) : messages && messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.is_admin_reply ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.is_admin_reply
                      ? "bg-gray-100 text-gray-900"
                      : "bg-[var(--theme-primary)] text-[var(--theme-primary-text)]"
                  }`}
                >
                  {msg.image_url ? (
                    <div className="space-y-2">
                      <img
                        src={msg.image_url}
                        alt="Shared image"
                        className="rounded-lg max-w-full h-auto max-h-[200px] object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/api/placeholder/300/200";
                        }}
                      />
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  )}
                  <p
                    className={`text-xs mt-1 ${
                      msg.is_admin_reply ? "text-gray-500" : "text-white/70"
                    }`}
                  >
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No messages yet
              </h3>
              <p className="text-sm text-gray-600">
                Start the conversation by sending a message below.
              </p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 rounded-b-2xl">
          <div className="flex items-end gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              disabled={isSubmitting}
              aria-label="Attach image"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows={1}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)]"
                disabled={isSubmitting}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isSubmitting}
              className="p-3 bg-[var(--theme-primary)] text-[var(--theme-primary-text)] rounded-xl hover:bg-[var(--theme-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Send message"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
