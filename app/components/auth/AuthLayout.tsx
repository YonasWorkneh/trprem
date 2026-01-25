import Image from "next/image";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  isLogin?: boolean;
}

export default function AuthLayout({ children, isLogin = false }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col items-center">
        <Image
          src="/favicon.png"
          alt="Logo"
          width={64}
          height={64}
          className="object-contain mb-6"
        />
        {children}
        <p className="text-sm text-gray-500 mt-8 text-center">
          By {isLogin ? "signing in" : "creating an account"}, you agree to our{" "}
          <Link href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}<Link href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
