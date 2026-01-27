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

interface ContractTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
}

const markets = ["Crypto", "Forex", "Stock", "Commodity"];
const cryptoAssets = ["BTC", "ETH", "USDT", "BNB", "SOL"];
const leverageOptions = [1, 5, 10, 25, 50, 75, 100];
const quickAmounts = [100, 500, 1000];

export default function ContractTradeModal({
  isOpen,
  onClose,
  availableBalance,
}: ContractTradeModalProps) {
  const [selectedMarket, setSelectedMarket] = useState("Crypto");
  const [selectedAsset, setSelectedAsset] = useState("BTC");
  const [amount, setAmount] = useState("");
  const [leverage, setLeverage] = useState(10);
  const [takeProfitStopLoss, setTakeProfitStopLoss] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange24h, setPriceChange24h] = useState(0);
  const [isRefreshingPrice, setIsRefreshingPrice] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // TODO: Fetch current price from API
      setCurrentPrice(0);
      setPriceChange24h(0);
    }
  }, [isOpen, selectedAsset]);

  const handleRefreshPrice = async () => {
    setIsRefreshingPrice(true);
    // TODO: Fetch price from API
    setTimeout(() => {
      setIsRefreshingPrice(false);
      toast.success("Price refreshed");
    }, 1000);
  };

  const handleQuickAmount = (value: number) => {
    if (value <= availableBalance) {
      setAmount(value.toString());
    } else {
      toast.error("Amount exceeds available balance");
    }
  };

  const handleLong = () => {
    if (!amount || Number(amount) < 10) {
      toast.error("Minimum amount is $10");
      return;
    }
    if (Number(amount) > availableBalance) {
      toast.error("Insufficient balance");
      return;
    }
    // TODO: Execute long trade
    toast.success("Long trade executed");
    onClose();
  };

  const handleShort = () => {
    if (!amount || Number(amount) < 10) {
      toast.error("Minimum amount is $10");
      return;
    }
    if (Number(amount) > availableBalance) {
      toast.error("Insufficient balance");
      return;
    }
    // TODO: Execute short trade
    toast.success("Short trade executed");
    onClose();
  };

  const estimatedLiquidationPrice = leverage > 0 ? (currentPrice / leverage).toFixed(2) : "0.00";

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
              <h2 className="text-xl font-bold text-gray-900">Contract Trade</h2>
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Current Price</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      ${currentPrice.toFixed(2)} USDT
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
                  <p className="text-xs text-gray-600 mb-1">24h Change</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      priceChange24h >= 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {priceChange24h >= 0 ? "+" : ""}
                    {priceChange24h.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Available Balance</p>
                <p className="text-sm font-semibold text-gray-900">
                  ${availableBalance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
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

            {/* Amount Input */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                AMOUNT (USDT)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Min $10"
                min={10}
                className="w-full text-lg font-bold text-gray-900 py-3 px-4 border border-gray-300 rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F4D03F] focus:border-[#F4D03F]"
              />
              <div className="flex gap-2 mt-2">
                {quickAmounts.map((value) => (
                  <button
                    key={value}
                    onClick={() => handleQuickAmount(value)}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    ${value}
                  </button>
                ))}
              </div>
            </div>

            {/* Leverage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-gray-700">
                  Leverage
                </label>
                <span className="px-3 py-1 bg-[#F4D03F] text-yellow-900 rounded-full text-sm font-semibold">
                  {leverage}x
                </span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={leverage}
                  onChange={(e) => setLeverage(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#F4D03F]"
                  style={{
                    background: `linear-gradient(to right, #F4D03F 0%, #F4D03F ${
                      ((leverage - 1) / 99) * 100
                    }%, #E5E7EB ${((leverage - 1) / 99) * 100}%, #E5E7EB 100%)`,
                  }}
                />
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>1X</span>
                  <span>25X</span>
                  <span>50X</span>
                  <span>75X</span>
                  <span>100X</span>
                </div>
              </div>
            </div>

            {/* Take Profit / Stop Loss Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700">
                Take Profit / Stop Loss
              </label>
              <button
                onClick={() => setTakeProfitStopLoss(!takeProfitStopLoss)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  takeProfitStopLoss ? "bg-[#F4D03F]" : "bg-gray-300"
                }`}
                aria-label="Toggle take profit stop loss"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    takeProfitStopLoss ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleLong}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <TrendingUp className="w-5 h-5" />
                <span>Long</span>
              </button>
              <p className="text-xs text-gray-600 text-center">
                Est. Liq. Price (Long): ${estimatedLiquidationPrice}
              </p>
              <button
                onClick={handleShort}
                className="w-full bg-red-600 text-white py-4 rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <TrendingDown className="w-5 h-5" />
                <span>Short</span>
              </button>
              <p className="text-xs text-gray-600 text-center">
                Est. Liq. Price (Short): ${estimatedLiquidationPrice}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
