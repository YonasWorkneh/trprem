"use client";

import { CalendarDays, DollarSign } from "lucide-react";
import Image from "next/image";
import type { ArbitrageProduct } from "@/lib/types/arbitrage";
import btcLogo from "@/app/assets/images/btc-logo.png";
import ethLogo from "@/app/assets/images/eth-logo.png";
import usdtLogo from "@/app/assets/images/usdt-logo.png";

interface ArbitrageProductCardProps {
  product: ArbitrageProduct;
  onStartHosting: (productId: string) => void;
}

const coinLogos: Record<string, typeof btcLogo> = {
  BTC: btcLogo,
  ETH: ethLogo,
  USDT: usdtLogo,
};

const coinNames: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  USDT: "Tether",
};

export default function ArbitrageProductCard({
  product,
  onStartHosting,
}: ArbitrageProductCardProps) {
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("en-US");
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 mb-4">
      {/* Product Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-full bg-[#F4D03F] flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-yellow-900">
              {product.icon || product.code}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-yellow-900 mb-0.5">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600">AI Arbitrage Product</p>
          </div>
        </div>
        <div className="bg-green-100 rounded-lg px-2 py-1 shrink-0">
          <span className="text-xs font-semibold text-green-700">
            {product.dailyReturn.toFixed(2)}% daily
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-100 rounded-xl p-3">
          <div className="flex flex-col items-center gap-2">
            <CalendarDays className="w-5 h-5 text-gray-600" />
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Duration</p>
              <p className="text-sm font-bold text-yellow-900">
                {product.duration} {product.duration === 1 ? "Day" : "Days"}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 rounded-xl p-3">
          <div className="flex flex-col items-center gap-2">
            <DollarSign className="w-5 h-5 text-gray-600" />
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">$ Limit</p>
              <p className="text-sm font-bold text-yellow-900">
                {formatCurrency(product.minLimit)}-{formatCurrency(product.maxLimit)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Supported Currencies */}
      <div className="mb-4">
        <p className="text-xs text-gray-600 mb-2">Supported currencies</p>
        <div className="flex items-center gap-2">
          {product.supportedCurrencies.map((currency) => {
            const logo = coinLogos[currency];
            if (!logo) return null;
            return (
              <div
                key={currency}
                className="w-8 h-8 rounded-full overflow-hidden bg-white border border-gray-200 flex items-center justify-center"
              >
                <Image
                  src={logo}
                  alt={coinNames[currency] || currency}
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onStartHosting(product.id)}
        className="w-full bg-[var(--theme-primary)] text-[var(--theme-primary-text)] py-3 rounded-xl font-semibold hover:bg-[var(--theme-primary-hover)] transition-colors cursor-pointer"
      >
        Start Hosting
      </button>
    </div>
  );
}
