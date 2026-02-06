"use client";

import { useState, useEffect } from "react";
import { X, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface OptionTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
}

const markets = ["Crypto", "Forex", "Stock", "Commodity"];
const cryptoAssets = ["BTC", "ETH", "USDT", "BNB", "SOL"];
const durationOptions = [
  { value: "30s", label: "30s - 15% $100 - $5000", profit: 15 },
  { value: "1m", label: "1m - 20% $100 - $5000", profit: 20 },
  { value: "5m", label: "5m - 25% $100 - $5000", profit: 25 },
  { value: "15m", label: "15m - 30% $100 - $5000", profit: 30 },
];

const MIN_INVESTMENT = 100;
const MAX_INVESTMENT = 5000;

export default function OptionTradeModal({
  isOpen,
  onClose,
  availableBalance,
}: OptionTradeModalProps) {
  const [selectedMarket, setSelectedMarket] = useState("Crypto");
  const [selectedAsset, setSelectedAsset] = useState("BTC");
  const [optionType, setOptionType] = useState<"call" | "put">("call");
  const [duration, setDuration] = useState("30s");
  const [investmentAmount, setInvestmentAmount] = useState("100");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [isRefreshingPrice, setIsRefreshingPrice] = useState(false);

  const selectedDuration = durationOptions.find((opt) => opt.value === duration);
  const profitPercentage = selectedDuration?.profit || 15;
  const investmentValue = Number(investmentAmount) || 0;
  const potentialProfit = (investmentValue * profitPercentage) / 100;
  const totalReturn = investmentValue + potentialProfit;

  useEffect(() => {
    if (!isOpen) return;
    // Defer state reset to avoid synchronous setState in effect (TODO: replace with API fetch)
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) {
        setCurrentPrice(0);
        setInvestmentAmount("100");
        setDuration("30s");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen, selectedAsset]);

  const handleRefreshPrice = async () => {
    setIsRefreshingPrice(true);
    // TODO: Fetch price from API
    setTimeout(() => {
      setIsRefreshingPrice(false);
      toast.success("Price refreshed");
    }, 1000);
  };

  const handleMaxAmount = () => {
    const maxAmount = Math.min(MAX_INVESTMENT, availableBalance);
    setInvestmentAmount(maxAmount.toString());
  };

  const handleConfirm = () => {
    if (!investmentAmount || Number(investmentAmount) < MIN_INVESTMENT) {
      toast.error(`Minimum investment is $${MIN_INVESTMENT}`);
      return;
    }
    if (Number(investmentAmount) > MAX_INVESTMENT) {
      toast.error(`Maximum investment is $${MAX_INVESTMENT}`);
      return;
    }
    if (Number(investmentAmount) > availableBalance) {
      toast.error("Insufficient balance");
      return;
    }
    // TODO: Execute binary option trade
    toast.success(`${optionType === "call" ? "Call" : "Put"} option confirmed`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">Binary Option</h2>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                {selectedAsset}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Price and Balance Section */}
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600 mb-1">Current Price</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    {currentPrice.toFixed(2)} USDT
                  </span>
                  <button
                    onClick={handleRefreshPrice}
                    disabled={isRefreshingPrice}
                    className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 cursor-pointer"
                    aria-label="Refresh price"
                  >
                    <RefreshCw
                      className={`w-4 h-4 text-gray-600 ${
                        isRefreshingPrice ? "animate-spin" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Available Balance</p>
                <p className="text-sm font-semibold text-gray-900">
                  {availableBalance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  USDT
                </p>
              </div>
            </div>

            {/* Market and Asset Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  MARKET
                </label>
                <Select value={selectedMarket} onValueChange={setSelectedMarket}>
                  <SelectTrigger className="w-full bg-white border border-gray-300 rounded-xl py-2.5 px-3 text-sm font-medium text-gray-900">
                    <SelectValue>{selectedMarket}</SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {markets.map((market) => (
                      <SelectItem
                        key={market}
                        value={market}
                        className="text-gray-900 focus:text-gray-900 focus:bg-gray-100"
                      >
                        {market}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  ASSET
                </label>
                <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                  <SelectTrigger className="w-full bg-white border border-gray-300 rounded-xl py-2.5 px-3 text-sm font-medium text-gray-900">
                    <SelectValue>{selectedAsset}</SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {cryptoAssets.map((asset) => (
                      <SelectItem
                        key={asset}
                        value={asset}
                        className="text-gray-900 focus:text-gray-900 focus:bg-gray-100"
                      >
                        {asset}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Option Type Selection */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                OPTION TYPE
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setOptionType("call")}
                  className={`relative py-4 px-4 rounded-xl font-semibold transition-colors cursor-pointer border ${
                    optionType === "call"
                      ? "bg-green-50 text-green-700 border-green-500"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {optionType === "call" && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                  <div className="flex flex-col items-center gap-2">
                    <div className={`${optionType === "call" ? "text-green-600" : "text-gray-600"}`}>
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <span>Call (Up)</span>
                    <span className="text-xs font-normal text-gray-500">Profit if price rises</span>
                  </div>
                </button>
                <button
                  onClick={() => setOptionType("put")}
                  className={`relative py-4 px-4 rounded-xl font-semibold transition-colors cursor-pointer border ${
                    optionType === "put"
                      ? "bg-red-50 text-red-700 border-red-500"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {optionType === "put" && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                  <div className="flex flex-col items-center gap-2">
                    <div className={`${optionType === "put" ? "text-red-600" : "text-gray-600"}`}>
                      <TrendingDown className="w-6 h-6" />
                    </div>
                    <span>Put (Down)</span>
                    <span className="text-xs font-normal text-gray-500">Profit if price falls</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Investment Amount */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-gray-700">
                  INVESTMENT AMOUNT
                </label>
                <span className="text-xs text-gray-500">
                  Min: {MIN_INVESTMENT} / Max: {MAX_INVESTMENT}
                </span>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-900">
                  $
                </div>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder="100"
                  min={MIN_INVESTMENT}
                  max={MAX_INVESTMENT}
                  className="w-full text-lg font-bold text-gray-900 py-3 pl-8 pr-20 border border-gray-300 rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F4D03F] focus:border-[#F4D03F]"
                />
                <button
                  onClick={handleMaxAmount}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Max
                </button>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                DURATION
              </label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="w-full bg-white border border-gray-300 rounded-xl py-2.5 px-3 text-sm font-medium text-gray-900 cursor-pointer">
                  <SelectValue>
                    {selectedDuration?.label || "Select duration"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {durationOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-gray-900 focus:text-gray-900 focus:bg-gray-100 cursor-pointer"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Profit Calculation Display */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Potential Profit ({profitPercentage}%)</span>
                <span className="text-lg font-bold text-green-600">
                  +${potentialProfit.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Return</span>
                <span className="text-lg font-bold text-gray-900">
                  ${totalReturn.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleConfirm}
              disabled={!investmentAmount || Number(investmentAmount) < MIN_INVESTMENT || Number(investmentAmount) > MAX_INVESTMENT}
              className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Confirm {optionType === "call" ? "Call" : "Put"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
