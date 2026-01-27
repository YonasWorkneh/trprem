"use client";

type LoginMethod = "email" | "mobile";

interface LoginMethodSelectorProps {
  selectedMethod: LoginMethod;
  onMethodChange: (method: LoginMethod) => void;
}

export default function LoginMethodSelector({
  selectedMethod,
  onMethodChange,
}: LoginMethodSelectorProps) {
  return (
    <div className="flex px-2 pt-1 justify-between bg-gray-100 rounded-xl gap-0 mb-6 border-b border-gray-200 ">
      <button
        type="button"
        onClick={() => onMethodChange("email")}
        className={`px-4 py-2 w-full text-center text-sm font-normal border-b-2 transition-colors cursor-pointer ${
          selectedMethod === "email"
            ? "bg-[var(--theme-primary-bg-16)] border-[var(--theme-primary)] text-[var(--theme-primary-text)]"
            : "text-gray-600 border-transparent hover:text-gray-900"
        }`}
      >
        Email
      </button>
      <button
        type="button"
        onClick={() => onMethodChange("mobile")}
        className={`px-4 py-2 w-full text-center text-sm font-normal border-b-2 transition-colors cursor-pointer ${
          selectedMethod === "mobile"
            ? "bg-[var(--theme-primary-bg-16)] border-[var(--theme-primary)] text-[var(--theme-primary-text)]"
            : "text-gray-600 border-transparent hover:text-gray-900"
        }`}
      >
        Mobile
      </button>
    </div>
  );
}
