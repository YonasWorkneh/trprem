"use client";

import { useEffect, useState } from "react";
import PromoCard from "./PromoCard";
import { Users, Gift, TrendingUp } from "lucide-react";

interface PromoData {
  id: string;
  label: string;
  headline: string;
  buttonText: string;
  buttonHref: string;
  gradientFrom: string;
  gradientTo: string;
  icon: React.ReactNode;
  iconBgColor: string;
}

const promoData: PromoData[] = [
  {
    id: "invite-friends",
    label: "INVITE FRIENDS",
    headline: "Get $100 in Bitcoin when they trade",
    buttonText: "Invite Now",
    buttonHref: "/invite",
    gradientFrom: "#3B82F6", // Blue
    gradientTo: "#8B5CF6", // Purple
    icon: <Users className="w-6 h-6 text-white" />,
    iconBgColor: "rgba(255, 255, 255, 0.2)",
  },
  {
    id: "staking-rewards",
    label: "EARN REWARDS",
    headline: "Staking rewards up to 12% APY",
    buttonText: "Start Earning",
    buttonHref: "/staking",
    gradientFrom: "#FF7F3F", // Orange
    gradientTo: "#EE3E9F", // Pink/Magenta
    icon: <Gift className="w-6 h-6 text-white" />,
    iconBgColor: "rgba(255, 255, 255, 0.3)",
  },
  {
    id: "new-markets",
    label: "NEW MARKETS",
    headline: "Trade the latest crypto assets today",
    buttonText: "Explore",
    buttonHref: "/markets",
    gradientFrom: "#10B981", // Green
    gradientTo: "#14B8A6", // Teal
    icon: <TrendingUp className="w-6 h-6 text-white" />,
    iconBgColor: "rgba(255, 255, 255, 0.2)",
  },
];

export default function PromoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promoData.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {promoData.map((promo, index) => (
              <div key={promo.id} className="w-full flex-shrink-0">
                <PromoCard
                  id={promo.id}
                  label={promo.label}
                  headline={promo.headline}
                  buttonText={promo.buttonText}
                  buttonHref={promo.buttonHref}
                  gradientFrom={promo.gradientFrom}
                  gradientTo={promo.gradientTo}
                  icon={promo.icon}
                  iconBgColor={promo.iconBgColor}
                  currentIndex={currentIndex}
                  totalCards={promoData.length}
                  onDotClick={handleDotClick}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
