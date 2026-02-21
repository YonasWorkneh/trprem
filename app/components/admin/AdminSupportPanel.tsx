import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  getAllTickets,
  sendSupportMessage,
  updateTicketStatus,
  subscribeToAllTickets,
  type SupportTicketWithMessages,
} from "@/lib/supportService";
import {
  MessageCircle,
  Send,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Upload,
  X,
} from "lucide-react";
import AdminEmptyState from "./AdminEmptyState";
import { useAuthStore } from "@/lib/store/authStore";
import { uploadSupportImage } from "@/lib/supportService";
import { supabase } from "@/lib/supabase";

const AdminSupportPanel = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state: any) => state.user);

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [filter, setFilter] = useState<
    "all" | "open" | "in_progress" | "resolved" | "closed"
  >("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch tickets with React Query
  const {
    data: tickets = [],
    isLoading: loading,
    refetch: refetchTickets,
  } = useQuery<SupportTicketWithMessages[]>({
    queryKey: ["admin-support-tickets"],
    queryFn: async () => {
      const allTickets = await getAllTickets();
      return allTickets;
    },
    staleTime: 1000 * 5, // 5 seconds stale time
    refetchInterval: 10000, // Auto-refetch every 10 seconds
    retry: 2,
  });

  // Get selected ticket from tickets array (automatically updates when tickets refetch)
  const selectedTicket = selectedTicketId
    ? tickets.find((t) => t.id === selectedTicketId) || null
    : null;

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages change or ticket changes
  useEffect(() => {
    if (selectedTicket && selectedTicket.messages.length > 0) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTicket?.messages.length, selectedTicketId]);

  useEffect(() => {
    // Subscribe to ticket updates
    const unsubscribe = subscribeToAllTickets(() => {
      refetchTickets();
    });

    return unsubscribe;
  }, [refetchTickets]);

  const handleSendReply = async () => {
    const userId =
      user?.id ??
      (await supabase.auth.getSession()).data.session?.user?.id;
    if (!userId) {
      toast.error("Session expired", { description: "Please sign in again to send replies." });
      return;
    }
    if (!selectedTicket) {
      toast.error("No ticket selected", { description: "Select a ticket to reply to." });
      return;
    }
    if (!replyMessage.trim() && !imageFile) {
      toast.error("Message required", { description: "Enter a message or attach an image." });
      return;
    }

    setSending(true);

    try {
      let imageUrl: string | undefined;

      if (imageFile) {
        const uploadResult = await uploadSupportImage(userId, imageFile);
        if (!uploadResult.success) {
          toast.error("Image upload failed", {
            description: uploadResult.error ?? "Please try again.",
          });
          return;
        }
        imageUrl = uploadResult.url;
      }

      const result = await sendSupportMessage(
        selectedTicket.id,
        userId,
        replyMessage.trim() || "", // Allow empty message if image is present
        true, // is_admin_reply
        imageUrl,
      );

      if (result.success) {
        setReplyMessage("");
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        toast.success("Reply Sent", {
          description: "Your response has been sent to the user",
        });
        // Immediately refetch tickets to show the new message
        await refetchTickets();
        // Scroll to bottom after refetch completes
        setTimeout(() => {
          scrollToBottom();
        }, 200);
      } else {
        throw new Error(result.error || "Failed to send reply");
      }
    } catch (error: any) {
      toast.error("Error", {
        description: error.message,
      });
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (
    ticketId: string,
    status: "open" | "in_progress" | "resolved" | "closed",
  ) => {
    const result = await updateTicketStatus(ticketId, status);

    if (result.success) {
      toast.success("Status Updated", {
        description: `Ticket marked as ${status.replace("_", " ")}`,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-support-tickets"] });
      await refetchTickets();
    } else {
      toast.error("Error", {
        description: result.error || "Failed to update status",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500";
      case "in_progress":
        return "bg-yellow-500";
      case "resolved":
        return "bg-green-500";
      case "closed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <MessageCircle className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      case "closed":
        return <XCircle className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filter === "all") return true;
    return ticket.status === filter;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Customer Support
        </CardTitle>
        <CardDescription>
          Manage and respond to user support tickets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={filter}
          onValueChange={(v) =>
            setFilter(
              v as "open" | "in_progress" | "resolved" | "closed" | "all",
            )
          }
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="all">All ({tickets.length})</TabsTrigger>
            <TabsTrigger value="open">
              Open ({tickets.filter((t) => t.status === "open").length})
            </TabsTrigger>
            <TabsTrigger value="in_progress">
              In Progress (
              {tickets.filter((t) => t.status === "in_progress").length})
            </TabsTrigger>
            <TabsTrigger value="resolved">
              Resolved ({tickets.filter((t) => t.status === "resolved").length})
            </TabsTrigger>
            <TabsTrigger value="closed">
              Closed ({tickets.filter((t) => t.status === "closed").length})
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
            {/* Tickets List */}
            <div className="lg:col-span-1 border rounded-lg overflow-hidden flex flex-col">
              <ScrollArea className="flex-1 overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredTickets.length === 0 ? (
                  <AdminEmptyState
                    title={`No ${filter !== "all" ? filter : ""} tickets found`}
                    description="When users submit support requests, they will appear here for your response."
                    icon={MessageCircle}
                  />
                ) : (
                  <div className="p-2 space-y-2">
                    {filteredTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedTicket?.id === ticket.id
                            ? "bg-primary/10 border-primary"
                            : "hover:bg-secondary/50"
                        }`}
                        onClick={() => setSelectedTicketId(ticket.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-sm line-clamp-1">
                            {ticket.subject}
                          </h4>
                          <Badge
                            className={`${getStatusColor(
                              ticket.status,
                            )} ml-2 shrink-0`}
                          >
                            {getStatusIcon(ticket.status)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          User: {ticket.user_email}
                        </p>
                        {ticket.page_context && (
                          <p className="text-xs text-muted-foreground mb-1">
                            Page: {ticket.page_context}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(ticket.created_at).toLocaleString()}
                        </p>
                        {ticket.messages.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {ticket.messages.length} message(s)
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Ticket Details & Chat */}
            <div className="lg:col-span-2 border rounded-lg flex flex-col h-full overflow-hidden">
              {selectedTicket ? (
                <>
                  {/* Header */}
                  <div className="p-4 border-b shrink-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">
                          {selectedTicket.subject}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          User: {selectedTicket.user_email}
                        </p>
                        {selectedTicket.page_context && (
                          <p className="text-sm text-muted-foreground">
                            Page: {selectedTicket.page_context}
                          </p>
                        )}
                      </div>
                      <Badge className={getStatusColor(selectedTicket.status)}>
                        {selectedTicket.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleUpdateStatus(selectedTicket.id, "in_progress")
                        }
                        disabled={selectedTicket.status === "in_progress"}
                      >
                        Mark In Progress
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleUpdateStatus(selectedTicket.id, "resolved")
                        }
                        disabled={selectedTicket.status === "resolved"}
                      >
                        Mark Resolved
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleUpdateStatus(selectedTicket.id, "closed")
                        }
                        disabled={selectedTicket.status === "closed"}
                      >
                        Close
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4 overflow-hidden">
                    <div className="space-y-4">
                      {selectedTicket.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.is_admin_reply ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              msg.is_admin_reply
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">
                              {msg.message}
                            </p>
                            {msg.image_url && (
                              <div className="mt-2">
                                <img
                                  src={msg.image_url}
                                  alt="Attachment"
                                  className="rounded-lg max-w-full max-h-64 object-contain cursor-pointer border border-border/50 hover:opacity-90 transition-opacity"
                                  onClick={() =>
                                    window.open(msg.image_url, "_blank")
                                  }
                                />
                              </div>
                            )}
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(msg.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      {/* Invisible element at the end to scroll to */}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Reply Form */}
                  <div className="p-4 border-t space-y-2 shrink-0">
                    {imageFile && (
                      <div className="relative inline-block">
                        <img
                          src={URL.createObjectURL(imageFile)}
                          alt="Preview"
                          className="rounded-lg max-w-xs max-h-32 object-contain border border-border"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full"
                          onClick={() => setImageFile(null)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1 truncate max-w-xs">
                          {imageFile.name}
                        </p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          setImageFile(file ?? null);
                        }}
                        className="hidden"
                        id="admin-reply-image"
                        aria-label="Attach image"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        title="Attach image"
                        className="cursor-pointer"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      <Textarea
                        placeholder="Type your reply..."
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        rows={3}
                        className="resize-none flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.ctrlKey) {
                            e.preventDefault();
                            handleSendReply();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleSendReply()}
                        disabled={
                          sending || (!replyMessage.trim() && !imageFile)
                        }
                        title={
                          !replyMessage.trim() && !imageFile
                            ? "Enter a message or attach an image"
                            : "Send reply"
                        }
                        className="inline-flex cursor-pointer h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-input bg-background ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4"
                      >
                        {sending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a ticket to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminSupportPanel;
