"use client";

import Link from "next/link";

interface PromoCardProps {
  id: string;
  label: string;
  headline: string;
  buttonText: string;
  buttonHref: string;
  gradientFrom: string;
  gradientTo: string;
  icon: React.ReactNode;
  iconBgColor: string;
  currentIndex: number;
  totalCards: number;
  onDotClick: (index: number) => void;
}

export default function PromoCard({
  label,
  headline,
  buttonText,
  buttonHref,
  gradientFrom,
  gradientTo,
  icon,
  iconBgColor,
  currentIndex,
  totalCards,
  onDotClick,
}: PromoCardProps) {
  return (
    <div
      className="relative rounded-2xl p-6 w-full shadow-lg flex flex-col"
      style={{
        background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
      }}
    >
      <div className="flex items-start justify-between mb-4 flex-1">
        <div className="flex-1">
          <p className="text-xs font-semibold text-white/80 uppercase tracking-wide mb-2">
            {label}
          </p>
          <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
            {headline}
          </h3>
          <Link
            href={buttonHref}
            className="inline-block bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-md"
          >
            {buttonText}
          </Link>
        </div>
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ml-4`}
          style={{ backgroundColor: iconBgColor }}
        >
          {icon}
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: totalCards }).map((_, index) => (
          <button
            key={index}
            onClick={() => onDotClick(index)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              currentIndex === index
                ? "w-8 h-2 bg-white"
                : "w-2 h-2 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to card ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
