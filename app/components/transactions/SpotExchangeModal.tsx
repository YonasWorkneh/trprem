"use client";

import { useState, useEffect } from "react";
import { X, ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Image from "next/image";
import btcLogo from "@/app/assets/images/btc-logo.png";
import ethLogo from "@/app/assets/images/eth-logo.png";
import usdtLogo from "@/app/assets/images/usdt-logo.png";

interface SpotExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
}

const currencies = [
  { value: "USDT", label: "USDT", logo: usdtLogo },
  { value: "BTC", label: "BTC", logo: btcLogo },
  { value: "ETH", label: "ETH", logo: ethLogo },
];

export default function SpotExchangeModal({
  isOpen,
  onClose,
  availableBalance,
}: SpotExchangeModalProps) {
  const [payCurrency, setPayCurrency] = useState("USDT");
  const [receiveCurrency, setReceiveCurrency] = useState("BTC");
  const [payAmount, setPayAmount] = useState("0.00");
  const [receiveAmount, setReceiveAmount] = useState("0");
  const [exchangeRate, setExchangeRate] = useState(0);
  const [priceChange24h, setPriceChange24h] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // TODO: Fetch exchange rate from API
      setExchangeRate(0);
      setPriceChange24h(0);
      setPayAmount("0.00");
      setReceiveAmount("0");
    }
  }, [isOpen, payCurrency, receiveCurrency]);

  const handleSwap = () => {
    const tempCurrency = payCurrency;
    const tempAmount = payAmount;
    setPayCurrency(receiveCurrency);
    setReceiveCurrency(tempCurrency);
    setPayAmount(receiveAmount);
    setReceiveAmount(tempAmount);
  };

  const handlePayAmountChange = (value: string) => {
    setPayAmount(value);
    // TODO: Calculate receive amount based on exchange rate
    if (exchangeRate > 0 && value) {
      const calculated = (Number(value) / exchangeRate).toFixed(8);
      setReceiveAmount(calculated);
    } else {
      setReceiveAmount("0");
    }
  };

  const handleReceiveAmountChange = (value: string) => {
    setReceiveAmount(value);
    // TODO: Calculate pay amount based on exchange rate
    if (exchangeRate > 0 && value) {
      const calculated = (Number(value) * exchangeRate).toFixed(2);
      setPayAmount(calculated);
    } else {
      setPayAmount("0.00");
    }
  };

  const handleConfirmExchange = () => {
    if (!payAmount || Number(payAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (Number(payAmount) > availableBalance) {
      toast.error("Insufficient balance");
      return;
    }
    // TODO: Execute exchange
    toast.success("Exchange confirmed");
    onClose();
  };

  const payCurrencyData = currencies.find((c) => c.value === payCurrency);
  const receiveCurrencyData = currencies.find((c) => c.value === receiveCurrency);

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
          className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Spot Exchange</h2>
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
            {/* Exchange Details */}
            <div className="space-y-3 pb-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Exchange Rate</span>
                <span className="text-sm font-semibold text-gray-900">
                  1 {payCurrency} = {exchangeRate > 0 ? exchangeRate.toFixed(8) : "Infinity"} {receiveCurrency}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{receiveCurrency} 24h Change</span>
                <span
                  className={`text-sm font-semibold ${
                    priceChange24h >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {priceChange24h >= 0 ? "+" : ""}
                  {priceChange24h.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Available Balance</span>
                <span className="text-sm font-semibold text-gray-900">
                  {availableBalance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  {payCurrency}
                </span>
              </div>
            </div>

            {/* YOU PAY */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                YOU PAY
              </label>
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex-1">
                  <input
                    type="number"
                    value={payAmount}
                    onChange={(e) => handlePayAmountChange(e.target.value)}
                    placeholder="0.00"
                    className="w-full text-2xl font-bold text-gray-900 bg-transparent border-0 focus:outline-none focus:ring-0 placeholder:text-gray-400"
                  />
                </div>
                <Select value={payCurrency} onValueChange={setPayCurrency}>
                  <SelectTrigger className="w-[140px] bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm font-medium text-gray-900">
                    <SelectValue>
                      {payCurrencyData && (
                        <div className="flex items-center gap-2">
                          <Image
                            src={payCurrencyData.logo}
                            alt={payCurrencyData.label}
                            width={20}
                            height={20}
                            className="w-5 h-5"
                          />
                          <span>{payCurrencyData.label}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {currencies.map((currency) => (
                      <SelectItem
                        key={currency.value}
                        value={currency.value}
                        className="text-gray-900 focus:text-gray-900 focus:bg-gray-100"
                      >
                        <div className="flex items-center gap-2">
                          <Image
                            src={currency.logo}
                            alt={currency.label}
                            width={20}
                            height={20}
                            className="w-5 h-5"
                          />
                          <span>{currency.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center -my-2">
              <button
                onClick={handleSwap}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                aria-label="Swap currencies"
              >
                <ArrowUpDown className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* YOU RECEIVE */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                YOU RECEIVE
              </label>
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex-1">
                  <input
                    type="number"
                    value={receiveAmount}
                    onChange={(e) => handleReceiveAmountChange(e.target.value)}
                    placeholder="0"
                    className="w-full text-2xl font-bold text-gray-900 bg-transparent border-0 focus:outline-none focus:ring-0 placeholder:text-gray-400"
                  />
                </div>
                <Select value={receiveCurrency} onValueChange={setReceiveCurrency}>
                  <SelectTrigger className="w-[140px] bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm font-medium text-gray-900">
                    <SelectValue>
                      {receiveCurrencyData && (
                        <div className="flex items-center gap-2">
                          <Image
                            src={receiveCurrencyData.logo}
                            alt={receiveCurrencyData.label}
                            width={20}
                            height={20}
                            className="w-5 h-5"
                          />
                          <span>{receiveCurrencyData.label}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {currencies.map((currency) => (
                      <SelectItem
                        key={currency.value}
                        value={currency.value}
                        className="text-gray-900 focus:text-gray-900 focus:bg-gray-100"
                      >
                        <div className="flex items-center gap-2">
                          <Image
                            src={currency.logo}
                            alt={currency.label}
                            width={20}
                            height={20}
                            className="w-5 h-5"
                          />
                          <span>{currency.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirmExchange}
              className="w-full bg-[#F4D03F] text-yellow-900 py-4 rounded-xl font-semibold hover:bg-[#F1C40F] transition-colors cursor-pointer"
            >
              Confirm Exchange
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
