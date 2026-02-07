import Image from "next/image";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  isLogin?: boolean;
  showFooter?: boolean;
  showLogo?: boolean;
}

export default function AuthLayout({ children, isLogin = false, showFooter = true, showLogo = true }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col items-center">
        {showLogo && (
          <Link href="/" className="block mb-6">
            <Image
              src="/favicon.png"
              alt="Logo"
              width={64}
              height={64}
              className="object-contain"
            />
          </Link>
        )}
        {children}
        {showFooter && <p className="text-sm text-gray-500 mt-8 text-center">
          By {isLogin ? "signing in" : "creating an account"}, you agree to our{" "}
          <Link href="/terms" className="text-(--color-theme-primary-text) hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}<Link href="/privacy" className="text-(--color-theme-primary-text) hover:underline">
            Privacy Policy
          </Link>
        </p>}
      </div>
    </div>
  );
}
