"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = "admin@tradepremium.com";
const ADMIN_PASSWORD = "admin123";
const ADMIN_SESSION_KEY = "admin_session";
const ADMIN_SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

interface AdminSession {
    userId: string;
    email: string;
    expiresAt: number;
}

function AdminLoginContent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingSession, setIsCheckingSession] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Check for existing admin session on mount
    useEffect(() => {
        const checkExistingSession = async () => {
            setIsCheckingSession(true);

            try {
                const storedSession = localStorage.getItem(ADMIN_SESSION_KEY);
                if (storedSession) {
                    try {
                        const session: AdminSession = JSON.parse(storedSession);

                        // Check if session is still valid
                        if (session.expiresAt > Date.now()) {
                            // Verify the user is still authenticated and is admin
                            const {
                                data: { user: authUser },
                            } = await supabase.auth.getUser();

                            if (authUser && authUser.id === session.userId) {
                                // Verify admin role in database
                                const { data: profile } = await supabase
                                    .from("users")
                                    .select("role")
                                    .eq("id", authUser.id)
                                    .maybeSingle();

                                if (profile?.role?.toLowerCase() === "admin") {
                                    // Valid admin session exists, redirect to dashboard
                                    const from = searchParams.get("from") || "/admin";
                                    router.replace(from);
                                    return;
                                }
                            }
                        } else {
                            // Session expired, remove it
                            localStorage.removeItem(ADMIN_SESSION_KEY);
                        }
                    } catch (e) {
                        // Invalid session data, remove it
                        localStorage.removeItem(ADMIN_SESSION_KEY);
                    }
                }
            } catch (error) {
                console.error("Error checking admin session:", error);
            } finally {
                setIsCheckingSession(false);
            }
        };

        checkExistingSession();
    }, [router, searchParams]);

    const storeAdminSession = (userId: string, userEmail: string) => {
        const adminSession: AdminSession = {
            userId,
            email: userEmail,
            expiresAt: Date.now() + ADMIN_SESSION_DURATION,
        };
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminSession));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);

        try {
            // Attempt login with Supabase
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                // If login fails, check if it's the specific hardcoded admin email trying to login for the first time
                if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                    // Try to create the account if it doesn't exist
                    const { data: signUpData, error: signUpError } =
                        await supabase.auth.signUp({
                            email,
                            password,
                            options: {
                                data: { name: "Admin" },
                            },
                        });

                    if (!signUpError && signUpData.user) {
                        // Account created, try logging in again
                        const { data: loginData, error: loginError } =
                            await supabase.auth.signInWithPassword({
                                email,
                                password,
                            });

                        if (!loginError && loginData.user) {
                            // Set role to admin for this new user
                            await supabase
                                .from("users")
                                .update({ role: "admin" })
                                .eq("id", loginData.user.id);

                            toast.success("Admin account created successfully");
                            storeAdminSession(
                                loginData.user.id,
                                loginData.user.email || email
                            );
                            setIsLoading(false);
                            router.push("/admin");
                            return;
                        } else {
                            throw (
                                loginError ||
                                new Error("Failed to login after account creation")
                            );
                        }
                    } else {
                        throw signUpError || new Error("Failed to create admin account");
                    }
                }
                throw error;
            }

            // For non-admin users, check if they have admin role in database
            if (data.user) {
                const { data: profile, error: profileError } = await supabase
                    .from("users")
                    .select("role")
                    .eq("id", data.user.id)
                    .maybeSingle();

                if (profileError) throw profileError;

                if (profile?.role?.toLowerCase() === "admin") {
                    toast.success("Admin access granted");
                    storeAdminSession(data.user.id, data.user.email || email);
                    setIsLoading(false);
                    router.push("/admin");
                    return;
                } else {
                    await supabase.auth.signOut();
                    toast.error("Access denied. Admin privileges required.");
                }
            } else {
                throw new Error("No user data returned");
            }
        } catch (error: any) {
            console.error("Login error:", error);
            toast.error(error.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    if (isCheckingSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <p className="text-sm text-muted-foreground">
                        Checking admin session...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md border-border bg-card">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
                    <CardDescription>Enter admin credentials to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@tradepremium.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-secondary/50 border-input"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-secondary/50 border-input"
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Verifying..." : "Access Dashboard"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminLoginContent />
        </Suspense>
    );
}
