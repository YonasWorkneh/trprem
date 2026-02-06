"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import Header from "@/app/components/Header";
import BottomNavigation from "@/app/components/BottomNavigation";
import { ArrowLeft, Copy, Upload, CircleCheck } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { getProfileData } from "@/lib/services/profileService";
import UploadProofModal from "@/app/components/deposit/UploadProofModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ethLogo from "@/app/assets/images/eth-logo.png";
import btcLogo from "@/app/assets/images/btc-logo.png";
import usdtLogo from "@/app/assets/images/usdt-logo.png";
import btcDepositQr from "@/app/assets/images/btc-deposit-qr.png";
import ethDepositQr from "@/app/assets/images/eth-deposit-qr.png";
import usdtDepositQr from "@/app/assets/images/usdt-deposit-qr.png";

function formatCryptoAddress(address: string): string {
  if (!address || address.length <= 10) return address;
  const start = address.slice(0, 6);
  const end = address.slice(-4);
  return `${start}...${end}`;
}

// Simple QR code generator using canvas
function generateQRCode(canvas: HTMLCanvasElement, text: string, size: number = 200) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Set canvas size
  canvas.width = size;
  canvas.height = size;

  // White background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);

  // Black foreground
  ctx.fillStyle = "#000000";
  const moduleSize = size / 25;

  // Generate deterministic pattern based on text
  const hash = text.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Draw corner markers (standard QR code pattern)
  const drawCornerMarker = (x: number, y: number) => {
    // Outer square (7x7 modules)
    ctx.fillStyle = "#000000";
    ctx.fillRect(x, y, moduleSize * 7, moduleSize * 7);
    // Inner white square (5x5 modules)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + moduleSize, y + moduleSize, moduleSize * 5, moduleSize * 5);
    // Center black square (3x3 modules)
    ctx.fillStyle = "#000000";
    ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, moduleSize * 3, moduleSize * 3);
  };

  // Draw three corner markers
  drawCornerMarker(0, 0);
  drawCornerMarker((size - moduleSize * 7), 0);
  drawCornerMarker(0, (size - moduleSize * 7));

  // Draw alignment pattern (small square in bottom-right area)
  const alignX = size - moduleSize * 7;
  const alignY = size - moduleSize * 7;
  ctx.fillStyle = "#000000";
  ctx.fillRect(alignX + moduleSize * 2, alignY + moduleSize * 2, moduleSize * 3, moduleSize * 3);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(alignX + moduleSize * 3, alignY + moduleSize * 3, moduleSize, moduleSize);

  // Draw data pattern based on text hash
  ctx.fillStyle = "#000000";
  for (let i = 0; i < 25; i++) {
    for (let j = 0; j < 25; j++) {
      // Skip corner marker areas and alignment pattern
      if (
        (i < 9 && j < 9) ||
        (i < 9 && j >= 16) ||
        (i >= 16 && j < 9) ||
        (i >= 18 && j >= 18 && i < 22 && j < 22)
      ) {
        continue;
      }

      // Generate pattern based on hash and position
      const seed = (hash + i * 25 + j + text.charCodeAt(i % text.length || 0)) % 5;
      if (seed < 2) {
        ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
      }
    }
  }
}

export default function DepositPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState("10.00");
  const [selectedCurrency, setSelectedCurrency] = useState("ETH");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [estimatedUSDT, setEstimatedUSDT] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedProof, setUploadedProof] = useState<File | null>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  // Mock wallet addresses - in production, fetch from API
  const mockAddresses: Record<string, string> = {
    ETH: "0x3F28539B5Be8356858fA65E9927734e04C72876C",
    BTC: "bc1q8x2j7xc5smv42svk5jm2n3zcp243u8lvu8fn7l",
    USDT: "0x3F28539B5Be8356858fA65E9927734e04C72876C",
  };

  useEffect(() => {
    const loadBalance = async () => {
      if (user) {
        setLoading(true);
        const result = await getProfileData(user.id);
        if (result.success && result.data) {
          setBalance(result.data.balance.totalBalance);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      void loadBalance();
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 0);
    }
  }, [isAuthenticated, user]);

  // Update wallet address when currency changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (selectedCurrency && mockAddresses[selectedCurrency]) {
        setWalletAddress(mockAddresses[selectedCurrency]);
      }
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [selectedCurrency]);

  // Generate QR code when wallet address changes
  useEffect(() => {
    if (walletAddress && qrCanvasRef.current) {
      generateQRCode(qrCanvasRef.current, walletAddress, 200);
    }
  }, [walletAddress]);

  // Calculate estimated USDT (mock conversion rate)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const conversionRates: Record<string, number> = {
        ETH: 3000,
        BTC: 45000,
        USDT: 1,
      };
      const rate = conversionRates[selectedCurrency] || 1;
      setEstimatedUSDT(parseFloat(depositAmount) * rate);
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [depositAmount, selectedCurrency]);

  const handleCopyAddress = async () => {
    if (!walletAddress) return;
    
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      toast.success("Address copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = walletAddress;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      toast.success("Address copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUploadProof = () => {
    setIsUploadModalOpen(true);
  };

  const handleProofUploadComplete = (file: File) => {
    setUploadedProof(file);
    toast.success("Payment proof uploaded successfully");
  };

  const handleSubmitDeposit = () => {
    // TODO: Implement deposit submission
    toast.info("Deposit request submission coming soon");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header title="trade prememium" />
        <main className="flex-1 pb-20 px-4 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Please log in to deposit funds</p>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  const minDeposit: Record<string, number> = {
    ETH: 0.01,
    BTC: 0.001,
    USDT: 10,
  };

  const coinLogos: Record<string, typeof ethLogo> = {
    ETH: ethLogo,
    BTC: btcLogo,
    USDT: usdtLogo,
  };

  const coinNames: Record<string, string> = {
    ETH: "Ethereum (ETH)",
    BTC: "Bitcoin (BTC)",
    USDT: "Tether (USDT)",
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="trade prememium" />
      <main className="flex-1 pb-20">
        <div className="px-4 pt-6">
          <div className="max-w-xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Deposit</h1>
            </div>

            <div className="space-y-6">
              {/* Enter Amount Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-gray-700">
                    Enter Amount
                  </label>
                  <span className="text-xs text-gray-500">
                    Min: {minDeposit[selectedCurrency] || 0.01} {selectedCurrency}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 items-center bg-gray-100/50 rounded-xl p-4">
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="text-2xl font-bold text-gray-900 py-3 px-4 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus-visible:ring-0 bg-transparent"
                    placeholder="0.00"
                    min={minDeposit[selectedCurrency] || 0.01}
                    step="0.01"
                  />
                  <Select
                    value={selectedCurrency}
                    onValueChange={(value) => setSelectedCurrency(value)}
                  >
                    <SelectTrigger className="bg-transparent border-0 shadow-none focus:ring-0 focus-visible:ring-0 h-auto py-3 px-4 text-sm font-medium text-gray-900 data-[placeholder]:text-gray-900 [&_svg]:text-gray-900">
                      <SelectValue className="text-gray-900 font-medium">
                        <div className="flex items-center gap-2">
                          <Image
                            src={coinLogos[selectedCurrency]}
                            alt={selectedCurrency}
                            width={20}
                            height={20}
                            className="w-5 h-5"
                          />
                          <span>{coinNames[selectedCurrency]}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="ETH" className="text-gray-900 focus:text-gray-900 focus:bg-gray-100">
                        <div className="flex items-center gap-2">
                          <Image
                            src={ethLogo}
                            alt="Ethereum"
                            width={20}
                            height={20}
                            className="w-5 h-5"
                          />
                          <span>Ethereum (ETH)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="BTC" className="text-gray-900 focus:text-gray-900 focus:bg-gray-100">
                        <div className="flex items-center gap-2">
                          <Image
                            src={btcLogo}
                            alt="Bitcoin"
                            width={20}
                            height={20}
                            className="w-5 h-5"
                          />
                          <span>Bitcoin (BTC)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="USDT" className="text-gray-900 focus:text-gray-900 focus:bg-gray-100">
                        <div className="flex items-center gap-2">
                          <Image
                            src={usdtLogo}
                            alt="Tether"
                            width={20}
                            height={20}
                            className="w-5 h-5"
                          />
                          <span>Tether (USDT)</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Estimated USDT Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated USDT
                </label>
                <div className="text-3xl font-bold text-gray-900">
                  {estimatedUSDT.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  USDT
                </div>
              </div>

              {/* Deposit Address Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Deposit Address
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Scan QR code or copy the address below
                </p>

                {/* QR Code */}
                <div className="bg-gray-50 rounded-xl p-8 mb-4 flex items-center justify-center min-h-[200px]">
                  {walletAddress ? (
                    selectedCurrency === "ETH" ? (
                      <Image
                        src={ethDepositQr}
                        alt="Ethereum deposit QR code"
                        width={200}
                        height={200}
                        className="w-full max-w-[200px] h-auto"
                      />
                    ) : selectedCurrency === "BTC" ? (
                      <Image
                        src={btcDepositQr}
                        alt="Bitcoin deposit QR code"
                        width={200}
                        height={200}
                        className="w-full max-w-[200px] h-auto"
                      />
                    ) : selectedCurrency === "USDT" ? (
                      <Image
                        src={usdtDepositQr}
                        alt="USDT deposit QR code"
                        width={200}
                        height={200}
                        className="w-full max-w-[200px] h-auto"
                      />
                    ) : (
                      <canvas
                        ref={qrCanvasRef}
                        className="w-full max-w-[200px] h-auto"
                        aria-label="Deposit QR Code"
                      />
                    )
                  ) : (
                    <div className="text-gray-400">Loading QR code...</div>
                  )}
                </div>

                {/* Wallet Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wallet Address
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={walletAddress ? formatCryptoAddress(walletAddress) : ""}
                      readOnly
                      className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-900 bg-gray-50 font-mono text-sm focus:outline-none"
                    />
                    <button
                      onClick={handleCopyAddress}
                      className={`p-3 rounded-xl transition-colors cursor-pointer flex items-center justify-center ${
                        copied
                          ? "bg-green-600 text-white"
                          : "bg-[var(--theme-primary)] text-[var(--theme-primary-text)] hover:bg-[var(--theme-primary-hover)]"
                      }`}
                      aria-label="Copy address"
                    >
                      {copied ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment Proof Section */}
              {uploadedProof ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                   
                      <CircleCheck className="w-5 h-5 text-green-700" />
                  
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Proof uploaded
                      </p>
                      <p className="text-xs text-gray-600">
                        {uploadedProof.name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsUploadModalOpen(true);
                    }}
                    className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors cursor-pointer"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleUploadProof}
                  className="w-full bg-white border border-gray-300 text-gray-900 py-4 rounded-xl font-medium hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload Payment Proof</span>
                </button>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">

                <button
                  onClick={handleSubmitDeposit}
                  disabled={!uploadedProof}
                  className="w-full bg-[var(--theme-primary)] text-[var(--theme-primary-text)] py-4 rounded-xl font-medium hover:bg-[var(--theme-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Submit Deposit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <BottomNavigation />
      <UploadProofModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleProofUploadComplete}
        initialFile={uploadedProof}
      />
    </div>
  );
}
