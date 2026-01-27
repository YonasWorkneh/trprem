"use client";

import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DocumentUploadArea from "./DocumentUploadArea";
import { applyForLoan } from "@/lib/services/loansService";
import type { LoanApplication } from "@/lib/types/loans";

interface LoanApplicationFormProps {
  onSuccess?: () => void;
}

const durationOptions = [
  { value: "30", label: "30 Days (1% Interest)", interestRate: 1.0 },
  { value: "60", label: "60 Days (1.2% Interest)", interestRate: 1.2 },
  { value: "90", label: "90 Days (1.5% Interest)", interestRate: 1.5 },
];

const documentTypes = [
  "National ID",
  "Passport",
  "Driver's License",
  "Other",
];

export default function LoanApplicationForm({
  onSuccess,
}: LoanApplicationFormProps) {
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [duration, setDuration] = useState<string>("30");
  const [documentType, setDocumentType] = useState<string>("National ID");
  const [frontSideFile, setFrontSideFile] = useState<File | null>(null);
  const [backSideFile, setBackSideFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedDuration = durationOptions.find((opt) => opt.value === duration);
  const dailyInterestRate = selectedDuration?.interestRate || 1.0;
  const durationDays = Number(duration);
  const loanAmountNum = Number(loanAmount) || 0;
  const estimatedInterest = (loanAmountNum * dailyInterestRate * durationDays) / 100;
  const totalRepayment = loanAmountNum + estimatedInterest;

  const handleSubmit = async () => {
    if (!loanAmount || loanAmountNum <= 0) {
      toast.error("Please enter a valid loan amount");
      return;
    }

    if (!frontSideFile || !backSideFile) {
      toast.error("Please upload both front and back sides of your document");
      return;
    }

    setIsSubmitting(true);

    try {
      const application: LoanApplication = {
        collateralCurrency: "USDT",
        collateralAmount: loanAmountNum * 1.5, // Assuming 150% collateral
        loanAmount: loanAmountNum,
        duration: durationDays,
      };

      const result = await applyForLoan(application);

      if (result.success) {
        toast.success("Loan application submitted successfully");
        // Reset form
        setLoanAmount("");
        setDuration("30");
        setDocumentType("National ID");
        setFrontSideFile(null);
        setBackSideFile(null);
        onSuccess?.();
      } else {
        toast.error(result.error || "Failed to submit loan application");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Apply for a Loan
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Get instant crypto loans with flexible repayment terms.
      </p>

      {/* Loan Amount */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Loan Amount (USDT)
        </label>
        <input
          type="number"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
          placeholder="0"
          className="w-full text-2xl font-bold text-gray-900 py-3 px-4 border border-gray-300 rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F4D03F] focus:border-[#F4D03F]"
        />
      </div>

      {/* Duration */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Duration (Days)
        </label>
        <Select value={duration} onValueChange={setDuration}>
          <SelectTrigger className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-[#F4D03F] focus:border-[#F4D03F]">
            <SelectValue>
              {selectedDuration?.label || "Select duration"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white">
            {durationOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-gray-900 focus:text-gray-900 focus:bg-gray-100"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Document Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Document Type
        </label>
        <Select value={documentType} onValueChange={setDocumentType}>
          <SelectTrigger className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-[#F4D03F] focus:border-[#F4D03F]">
            <SelectValue>{documentType}</SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white">
            {documentTypes.map((type) => (
              <SelectItem
                key={type}
                value={type}
                className="text-gray-900 focus:text-gray-900 focus:bg-gray-100"
              >
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Document Upload */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <DocumentUploadArea
            label="Front Side"
            onFileSelect={setFrontSideFile}
            initialFile={frontSideFile}
          />
          <DocumentUploadArea
            label="Back Side"
            onFileSelect={setBackSideFile}
            initialFile={backSideFile}
          />
        </div>
      </div>

      {/* Loan Summary */}
      <div className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Loan Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Daily Interest Rate:</span>
            <span className="font-medium text-gray-900">{dailyInterestRate}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium text-gray-900">{durationDays} Days</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Estimated Interest:</span>
            <span className="font-medium text-[#10B981]">
              {estimatedInterest.toFixed(2)} USDT
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="font-bold text-gray-900">Total Repayment:</span>
            <span className="font-bold text-[#10B981]">
              {totalRepayment.toFixed(2)} USDT
            </span>
          </div>
        </div>
      </div>

      {/* Important Information */}
      <div className="mb-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-[#F4D03F] flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-3 h-3 text-yellow-900" />
          </div>
          <div className="flex-1 space-y-2 text-sm">
            <p>
              <span className="font-bold text-gray-900">Repayment:</span>{" "}
              <span className="text-gray-700">
                The total amount must be repaid on or before the due date.
              </span>
            </p>
            <p>
              <span className="font-bold text-gray-900">Overdue Penalty:</span>{" "}
              <span className="text-gray-700">
                If the loan is not repaid by the due date, compound interest will be
                applied daily on the{" "}
                <span className="font-bold">total outstanding amount</span> (Principal
                + Interest) at the same daily rate of {dailyInterestRate}%.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting || !loanAmount || !frontSideFile || !backSideFile}
        className="w-full bg-[#F4D03F] text-yellow-900 py-4 rounded-xl font-semibold hover:bg-[#F1C40F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting ? "Submitting..." : "Apply Now"}
      </button>
    </div>
  );
}
