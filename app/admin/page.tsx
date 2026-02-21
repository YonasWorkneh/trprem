"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Loader2,
  LogOut,
  Eye,
  User,
  Coins,
  ArrowUpFromLine,
  Settings,
  RefreshCw,
  Menu,
  MessageCircle,
  Send,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import AdminDepositsPanel from "@/app/components/admin/AdminDepositsPanel";
import AdminWithdrawalsPanel from "@/app/components/admin/AdminWithdrawalsPanel";
import AdminSendsPanel from "@/app/components/admin/AdminSendsPanel";
import AdminSettingsPanel from "@/app/components/admin/AdminSettingsPanel";
import AdminSupportPanel from "@/app/components/admin/AdminSupportPanel";
import { getUsersForAdmin } from "@/lib/services/adminUserService";
import AdminEmptyState from "@/app/components/admin/AdminEmptyState";
import AdminProtectedRoute from "@/app/components/admin/AdminProtectedRoute";

import { adminLogout } from "@/lib/services/adminAuthService";

interface UserData {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  phone: string | null;
  kyc_status: "not_started" | "pending" | "verified" | "rejected";
  role: "user" | "admin";
  trading_balance: number;
  preferences: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface KycSubmission {
  id: string;
  user_id: string;
  full_name: string;
  date_of_birth: string | null;
  nationality: string | null;
  address_line: string | null;
  city: string | null;
  zip_code: string | null;
  country: string | null;
  id_type: string | null;
  id_number: string | null;
  id_front_url: string;
  id_back_url: string | null;
  selfie_url: string;
  status: string;
  rejection_reason: string | null;
  reviewed_at: string | null;
  submitted_at: string;
}

interface UsdtWalletRow {
  id: string;
  balance: number;
  address?: string;
  network?: string;
}

interface UserDetailsRpc {
  profile?: { trading_balance?: number };
  balances?: UsdtWalletRow[] | null;
  stats?: unknown;
}

interface OtherCoinBalance {
  currency: string;
  amount: number;
  amount_usd: number;
}

function AdminDashboardContent() {
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userDetails, setUserDetails] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [totalUsdtBalance, setTotalUsdtBalance] = useState<number>(0);
  const [tradingBalance, setTradingBalance] = useState<number>(0);
  const [otherCoins, setOtherCoins] = useState<OtherCoinBalance[]>([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustType, setAdjustType] = useState<"credit" | "debit">("credit");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  const router = useRouter();

  const {
    data: users = [],
    isLoading,
    isRefetching: isRefreshing,
    refetch: refetchUsers,
  } = useQuery<UserData[]>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const result = await getUsersForAdmin();

      if (!result.success) {
        toast.error("Failed to fetch users: " + result.error);
        throw new Error(result.error);
      }

      return result.data || [];
    },
    enabled: true,
    staleTime: 1000 * 5,
    refetchInterval: 10000,
  });

  const handleRefreshUsers = () => {
    refetchUsers();
    toast.success("Refreshing users...");
  };

  const { data: kycDetails, refetch: refetchKycDetails } =
    useQuery<KycSubmission | null>({
      queryKey: ["kyc-details", selectedUser?.id],
      queryFn: async () => {
        if (!selectedUser?.id) return null;

        const { data, error } = await supabase
          .from("kyc_submissions")
          .select("*")
          .eq("user_id", selectedUser.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching KYC details:", error);
          throw error;
        }

        if (!data) return null;

        const signedData = { ...data };
        const imageFields = ["id_front_url", "id_back_url", "selfie_url"];

        for (const field of imageFields) {
          const urlOrPath = data[field];
          if (urlOrPath) {
            let path = urlOrPath;
            if (
              urlOrPath.includes("/storage/v1/object/public/kyc-documents/")
            ) {
              path = urlOrPath.split(
                "/storage/v1/object/public/kyc-documents/",
              )[1];
            }

            const { data: signedUrlData, error: signedError } =
              await supabase.storage
                .from("kyc-documents")
                .createSignedUrl(path, 3600);

            if (!signedError && signedUrlData) {
              signedData[field] = signedUrlData.signedUrl;
            }
          }
        }

        return signedData as KycSubmission;
      },
      enabled: !!selectedUser?.id && isDetailsOpen,
    });

  const fetchFullUserDetails = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc("get_user_full_details", {
        target_user_id: userId,
      });
      if (error) throw error;
      const rpcData = data as UserDetailsRpc | null;
      setUserDetails(data as Record<string, unknown>);

      // Total USDT from usdt_wallets
      const wallets = (rpcData?.balances ?? []) as UsdtWalletRow[];
      const totalUsdt = Array.isArray(wallets)
        ? wallets.reduce((sum, w) => sum + Number(w.balance ?? 0), 0)
        : 0;
      setTotalUsdtBalance(totalUsdt);

      // Trading balance from users.trading_balance (profile)
      const trading =
        rpcData?.profile?.trading_balance ?? selectedUser?.trading_balance ?? 0;
      setTradingBalance(Number(trading));

      // Other coins from crypto_deposits (credited/confirmed), summed by currency with amount_usd
      const { data: deposits, error: depositsError } = await supabase
        .from("crypto_deposits")
        .select("currency, admin_verified_amount, amount, amount_usd")
        .eq("user_id", userId)
        .in("status", ["credited", "confirmed"]);

      if (depositsError) {
        console.warn("Error fetching crypto_deposits for balance:", depositsError);
        setOtherCoins([]);
        return;
      }

      const byCurrency = new Map<
        string,
        { amount: number; amount_usd: number }
      >();
      for (const row of deposits ?? []) {
        const amount = Number(
          row.admin_verified_amount ?? row.amount ?? 0,
        ) as number;
        const amountUsd = Number(row.amount_usd ?? 0) as number;
        if (amount <= 0 && amountUsd <= 0) continue;
        const cur = (row.currency ?? "OTHER").toUpperCase();
        const existing = byCurrency.get(cur) ?? {
          amount: 0,
          amount_usd: 0,
        };
        byCurrency.set(cur, {
          amount: existing.amount + amount,
          amount_usd: existing.amount_usd + amountUsd,
        });
      }
      setOtherCoins(
        Array.from(byCurrency.entries())
          .map(([currency, { amount, amount_usd }]) => ({
            currency,
            amount,
            amount_usd,
          }))
          .filter((c) => c.currency !== "USDT")
          .sort((a, b) => a.currency.localeCompare(b.currency)),
      );
    } catch (error: unknown) {
      console.error("Error fetching full user details:", error);
      setTotalUsdtBalance(0);
      setTradingBalance(0);
      setOtherCoins([]);
    }
  };

  const handleAdjustBalance = async (userId: string) => {
    if (!adjustAmount || isNaN(Number(adjustAmount))) {
      toast.error("Please enter a valid amount");
      return;
    }

    const amountNum = Number(adjustAmount);
    if (amountNum <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    try {
      const { data: usdtWallets, error: fetchError } = await supabase
        .from("usdt_wallets")
        .select("id, balance")
        .eq("user_id", userId)
        .order("created_at", { ascending: true })
        .limit(1);

      if (fetchError) throw fetchError;

      let walletId: string;
      let currentBalance: number;

      if (usdtWallets && usdtWallets.length > 0) {
        walletId = usdtWallets[0].id;
        currentBalance = Number(usdtWallets[0].balance || 0);
      } else {
        const { data: newWallet, error: createError } = await supabase
          .from("usdt_wallets")
          .insert({
            user_id: userId,
            network: "USDT_TRC20",
            address: `admin_created_${userId}_${Date.now()}`,
            balance: 0,
          })
          .select("id, balance")
          .single();

        if (createError) throw createError;
        walletId = newWallet.id;
        currentBalance = 0;
      }

      const newBalance =
        adjustType === "credit"
          ? currentBalance + amountNum
          : currentBalance - amountNum;

      if (adjustType === "debit" && newBalance < 0) {
        toast.error(
          `Insufficient balance. Current balance: $${currentBalance.toFixed(2)}`,
        );
        return;
      }

      const { error: updateError } = await supabase
        .from("usdt_wallets")
        .update({
          balance: newBalance,
          updated_at: new Date().toISOString(),
        })
        .eq("id", walletId);

      if (updateError) throw updateError;

      await supabase.from("wallet_transactions").insert({
        user_id: userId,
        type: adjustType === "credit" ? "deposit" : "withdrawal",
        amount: adjustType === "credit" ? amountNum : -amountNum,
        asset: "USDT",
        status: "completed",
        timestamp: new Date().toISOString(),
      });

      toast.success(
        `Successfully ${
          adjustType === "credit" ? "credited" : "debited"
        } $${amountNum.toFixed(2)}. New balance: $${newBalance.toFixed(2)}`,
      );
      setAdjustAmount("");
      fetchFullUserDetails(userId);
      refetchUsers();
    } catch (error: unknown) {
      toast.error(
        "Failed to adjust balance: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    }
  };

  const handleViewDetails = async (user: UserData) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
    await fetchFullUserDetails(user.id);
  };

  const updateKycStatus = async (
    userId: string,
    status: "verified" | "rejected",
  ) => {
    try {
      const { error: userError } = await supabase
        .from("users")
        .update({ kyc_status: status })
        .eq("id", userId);

      if (userError) throw userError;

      if (kycDetails) {
        const { error: kycError } = await supabase
          .from("kyc_submissions")
          .update({ status: status })
          .eq("user_id", userId);

        if (kycError) throw kycError;
      }

      toast.success(
        `User KYC ${status === "verified" ? "approved" : "rejected"}`,
      );
      refetchUsers();
      refetchKycDetails();
      setIsDetailsOpen(false);
    } catch (error: unknown) {
      toast.error(
        "Failed to update status: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    }
  };

  const handleLogout = async () => {
    const result = await adminLogout();
    if (result.success) {
      router.push("/admin/login");
    } else {
      console.error("Logout failed:", result.error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage users and KYC verification
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="hidden md:block">
            <TabsList className="grid w-full max-w-2xl grid-cols-6 gap-2">
              <TabsTrigger
                value="users"
                className="flex items-center justify-center"
              >
                <User className="w-4 h-4 mr-2" />
                Users & KYC
              </TabsTrigger>
              <TabsTrigger
                value="deposits"
                className="flex items-center justify-center"
              >
                <Coins className="w-4 h-4 mr-2" />
                Deposits
              </TabsTrigger>
              <TabsTrigger
                value="withdrawals"
                className="flex items-center justify-center"
              >
                <ArrowUpFromLine className="w-4 h-4 mr-2" />
                Withdrawals
              </TabsTrigger>
              <TabsTrigger
                value="sends"
                className="flex items-center justify-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Sends
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex items-center justify-center"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
              <TabsTrigger
                value="support"
                className="flex items-center justify-center"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Support
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 w-full justify-start"
                >
                  <Menu className="h-5 w-5" />
                  <span className="font-semibold">Menu</span>
                  <Badge variant="secondary" className="ml-auto">
                    {activeTab}
                  </Badge>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px]">
                <div className="flex flex-col h-full">
                  <SheetHeader>
                    <SheetTitle>Admin Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-2">
                    {[
                      "users",
                      "deposits",
                      "withdrawals",
                      "sends",
                      "settings",
                      "support",
                    ].map((tab) => (
                      <Button
                        key={tab}
                        variant={activeTab === tab ? "default" : "ghost"}
                        className="w-full justify-start capitalize"
                        onClick={() => {
                          setActiveTab(tab);
                          setMobileMenuOpen(false);
                        }}
                      >
                        {tab}
                      </Button>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <TabsContent value="users" className="space-y-6">
            <Card className="border-border bg-card shadow-lg">
              <CardHeader className="border-b border-border/50 bg-muted/20">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Registered Users
                    <Badge variant="secondary" className="ml-2">
                      {users.length}
                    </Badge>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefreshUsers}
                    disabled={isRefreshing}
                  >
                    <RefreshCw
                      className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                    />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="hidden md:block">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="pl-6">User Profile</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Joined Date</TableHead>
                        <TableHead>KYC Status</TableHead>
                        <TableHead className="text-right pr-6">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user: UserData) => (
                        <TableRow
                          key={user.id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <TableCell className="pl-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                {user.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold">
                                  {user.name || "Unknown"}
                                </div>
                                <div className="text-xs text-muted-foreground capitalize">
                                  {user.role}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {user.kyc_status?.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDetails(user)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {users.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="p-0">
                            <AdminEmptyState
                              title="No users found"
                              description="When users register on the platform, they will appear here for management."
                              icon={User}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deposits">
            <AdminDepositsPanel />
          </TabsContent>
          <TabsContent value="withdrawals">
            <AdminWithdrawalsPanel />
          </TabsContent>
          <TabsContent value="sends">
            <AdminSendsPanel />
          </TabsContent>
          <TabsContent value="settings">
            <AdminSettingsPanel />
          </TabsContent>
          <TabsContent value="support">
            <AdminSupportPanel />
          </TabsContent>
        </Tabs>

        {/* User Details Dialog */}
        <Dialog
          open={isDetailsOpen}
          onOpenChange={(open) => {
            setIsDetailsOpen(open);
            if (!open) {
              setTotalUsdtBalance(0);
              setTradingBalance(0);
              setOtherCoins([]);
            }
          }}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>User Details: {selectedUser?.name}</DialogTitle>
              <DialogDescription>
                Manage user account, balance and KYC
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Account Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Account Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">User ID</span>
                    <span className="font-mono text-xs">
                      {selectedUser?.id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Email</span>
                    <span>{selectedUser?.email}</span>
                  </div>
                  <div className="border-t pt-4 mt-4 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        Total USDT balance
                      </span>
                      <span className="font-bold text-primary">
                        ${totalUsdtBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        Trading balance
                      </span>
                      <span className="font-semibold">
                        ${tradingBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    {otherCoins.length > 0 && (
                      <div className="pt-2">
                        <span className="text-muted-foreground text-sm block mb-2">
                          Other coins (from crypto deposits)
                        </span>
                        <ul className="space-y-1.5 text-sm">
                          {otherCoins.map(
                            ({ currency, amount, amount_usd }) => (
                              <li
                                key={currency}
                                className="flex justify-between items-center gap-4"
                              >
                                <span className="text-muted-foreground">
                                  {currency}
                                </span>
                                <span className="font-medium text-right">
                                  {amount.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 8,
                                  })}{" "}
                                  <span className="text-muted-foreground font-normal">
                                    (≈ $
                                    {amount_usd.toLocaleString("en-US", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}{" "}
                                    USDT)
                                  </span>
                                </span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Balance Adjust */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Adjust Balance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Select
                      value={adjustType}
                      onValueChange={(v: string) =>
                        setAdjustType(v as "credit" | "debit")
                      }
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit">Credit (+)</SelectItem>
                        <SelectItem value="debit">Debit (-)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Amount"
                      value={adjustAmount}
                      onChange={(e) => setAdjustAmount(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() =>
                      selectedUser && handleAdjustBalance(selectedUser.id)
                    }
                  >
                    Apply Adjustment
                  </Button>
                </CardContent>
              </Card>

              {/* KYC Review */}
              {selectedUser?.kyc_status !== "not_started" && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      KYC Verification
                    </CardTitle>
                    <CardDescription>
                      Submitted information and identity documents
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {kycDetails ? (
                      <div className="space-y-6">
                        {/* Submitted information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-foreground border-b pb-2">
                              Personal details
                            </h4>
                            <dl className="grid grid-cols-1 gap-2 text-sm">
                              <div className="flex justify-between gap-4">
                                <dt className="text-muted-foreground">
                                  Full name
                                </dt>
                                <dd className="font-medium text-right">
                                  {kycDetails.full_name || "—"}
                                </dd>
                              </div>
                              <div className="flex justify-between gap-4">
                                <dt className="text-muted-foreground">
                                  Date of birth
                                </dt>
                                <dd className="font-medium text-right">
                                  {kycDetails.date_of_birth
                                    ? new Date(
                                        kycDetails.date_of_birth,
                                      ).toLocaleDateString()
                                    : "—"}
                                </dd>
                              </div>
                              <div className="flex justify-between gap-4">
                                <dt className="text-muted-foreground">
                                  Nationality
                                </dt>
                                <dd className="font-medium text-right">
                                  {kycDetails.nationality || "—"}
                                </dd>
                              </div>
                              <div className="flex justify-between gap-4">
                                <dt className="text-muted-foreground">
                                  Address
                                </dt>
                                <dd className="font-medium text-right">
                                  {[
                                    kycDetails.address_line,
                                    kycDetails.city,
                                    kycDetails.zip_code,
                                    kycDetails.country,
                                  ]
                                    .filter(Boolean)
                                    .join(", ") || "—"}
                                </dd>
                              </div>
                            </dl>
                          </div>
                          <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-foreground border-b pb-2">
                              ID details
                            </h4>
                            <dl className="grid grid-cols-1 gap-2 text-sm">
                              <div className="flex justify-between gap-4">
                                <dt className="text-muted-foreground">
                                  ID type
                                </dt>
                                <dd className="font-medium text-right capitalize">
                                  {kycDetails.id_type?.replace("_", " ") || "—"}
                                </dd>
                              </div>
                              <div className="flex justify-between gap-4">
                                <dt className="text-muted-foreground">
                                  ID number
                                </dt>
                                <dd className="font-medium text-right font-mono">
                                  {kycDetails.id_number || "—"}
                                </dd>
                              </div>
                              <div className="flex justify-between gap-4">
                                <dt className="text-muted-foreground">
                                  Status
                                </dt>
                                <dd>
                                  <Badge
                                    variant="outline"
                                    className="capitalize"
                                  >
                                    {kycDetails.status?.replace("_", " ") ??
                                      "—"}
                                  </Badge>
                                </dd>
                              </div>
                              <div className="flex justify-between gap-4">
                                <dt className="text-muted-foreground">
                                  Submitted
                                </dt>
                                <dd className="font-medium text-right">
                                  {kycDetails.submitted_at
                                    ? new Date(
                                        kycDetails.submitted_at,
                                      ).toLocaleString()
                                    : "—"}
                                </dd>
                              </div>
                              {kycDetails.reviewed_at && (
                                <div className="flex justify-between gap-4">
                                  <dt className="text-muted-foreground">
                                    Reviewed at
                                  </dt>
                                  <dd className="font-medium text-right">
                                    {new Date(
                                      kycDetails.reviewed_at,
                                    ).toLocaleString()}
                                  </dd>
                                </div>
                              )}
                              {kycDetails.rejection_reason && (
                                <div className="col-span-full pt-2">
                                  <dt className="text-muted-foreground text-xs mb-1">
                                    Rejection reason
                                  </dt>
                                  <dd className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                                    {kycDetails.rejection_reason}
                                  </dd>
                                </div>
                              )}
                            </dl>
                          </div>
                        </div>

                        {/* Documents */}
                        <div>
                          <h4 className="text-sm font-semibold text-foreground border-b pb-2 mb-4">
                            Documents
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label className="text-muted-foreground">
                                ID Front
                              </Label>
                              <img
                                src={kycDetails.id_front_url}
                                alt="ID Front"
                                className="w-full h-40 object-cover rounded-lg border"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-muted-foreground">
                                ID Back
                              </Label>
                              {kycDetails.id_back_url ? (
                                <img
                                  src={kycDetails.id_back_url}
                                  alt="ID Back"
                                  className="w-full h-40 object-cover rounded-lg border"
                                />
                              ) : (
                                <div className="w-full h-40 rounded-lg border bg-muted flex items-center justify-center text-muted-foreground text-sm">
                                  Not provided
                                </div>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label className="text-muted-foreground">
                                Selfie
                              </Label>
                              <img
                                src={kycDetails.selfie_url}
                                alt="Selfie"
                                className="w-full h-40 object-cover rounded-lg border"
                              />
                            </div>
                          </div>
                        </div>

                        {kycDetails.status !== "verified" &&
                          kycDetails.status !== "approved" && (
                          <div className="flex gap-4 pt-2">
                            <Button
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                              onClick={() =>
                                selectedUser?.id &&
                                updateKycStatus(selectedUser.id, "verified")
                              }
                            >
                              Approve KYC
                            </Button>
                            <Button
                              variant="destructive"
                              className="flex-1 text-white"
                              onClick={() =>
                                selectedUser?.id &&
                                updateKycStatus(selectedUser.id, "rejected")
                              }
                            >
                              Reject KYC
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Loading KYC data...
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminProtectedRoute>
      <AdminDashboardContent />
    </AdminProtectedRoute>
  );
}
