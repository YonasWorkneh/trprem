import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAdminSession } from "@/lib/services/adminAuthService";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAdminAccess = () => {
      // Check for valid admin session
      const adminSession = getAdminSession();
      if (adminSession) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setIsCheckingAdmin(false);
    };

    // Small delay to simulate checking
    const timeoutId = setTimeout(checkAdminAccess, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!isCheckingAdmin && !isAdmin) {
      router.replace(`/admin/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [isCheckingAdmin, isAdmin, router, pathname]);

  if (isCheckingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">
            Verifying admin access...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
