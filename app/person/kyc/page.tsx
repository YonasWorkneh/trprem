"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, Upload, Camera, ShieldCheck } from "lucide-react";
import Header from "@/app/components/Header";
import BottomNavigation from "@/app/components/BottomNavigation";
import DocumentUploadArea from "@/app/components/loans/DocumentUploadArea";
import DocumentUploadModal from "@/app/components/loans/DocumentUploadModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const documentTypes = [
  { value: "passport", label: "Passport" },
  { value: "national_id", label: "National ID" },
  { value: "driver_license", label: "Driver's License" },
];

export default function KYCPage() {
  const router = useRouter();
  const [documentType, setDocumentType] = useState<string>("");
  const [documentNumber, setDocumentNumber] = useState<string>("");
  const [frontDocument, setFrontDocument] = useState<File | null>(null);
  const [backDocument, setBackDocument] = useState<File | null>(null);
  const [selfieDocument, setSelfieDocument] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [frontModalOpen, setFrontModalOpen] = useState(false);
  const [backModalOpen, setBackModalOpen] = useState(false);
  const [selfieModalOpen, setSelfieModalOpen] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!documentType) {
      toast.error("Please select a document type");
      return;
    }
    if (!documentNumber.trim()) {
      toast.error("Please enter your document number");
      return;
    }
    if (!frontDocument) {
      toast.error("Please upload the front of your document");
      return;
    }
    if (!backDocument) {
      toast.error("Please upload the back of your document");
      return;
    }
    if (!selfieDocument) {
      toast.error("Please upload a selfie with your document");
      return;
    }

    setIsSubmitting(true);
    // TODO: Submit KYC documents to API
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("KYC documents submitted successfully");
      router.push("/personal");
    } catch (error) {
      toast.error("Failed to submit documents. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="trade prememium" />
      <main className="flex-1 pb-20">
        <div className="px-4 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center gap-3 py-6">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Identity Verification
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Verify your identity to unlock all features
              </p>
            </div>
          </div>

          {/* Submit Documents Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-(--color-theme-primary-text)" />
              <h2 className="text-lg font-semibold text-gray-900">
                Submit Documents
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Please provide a valid government-issued ID and a selfie.
            </p>

            {/* Document Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type
              </label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger className="w-full bg-white border border-gray-300 rounded-xl py-2.5 px-3 text-sm font-medium text-gray-900 cursor-pointer">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {documentTypes.map((type) => (
                    <SelectItem
                      key={type.value}
                      value={type.value}
                      className="text-gray-900 focus:text-gray-900 focus:bg-gray-100 cursor-pointer"
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Document Number */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Number
              </label>
              <input
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder="Enter document number"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)]"
              />
            </div>
          </div>

          {/* Upload Documents Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Upload Documents
            </h3>
            <div className="space-y-4">
              {/* Front of Document */}
              {frontDocument ? (
                <DocumentUploadArea
                  label="Front of Document"
                  onFileSelect={setFrontDocument}
                  initialFile={frontDocument}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setFrontModalOpen(true)}
                  className="w-full flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-700 mb-1">
                    Front of Document
                  </span>
                  <span className="text-xs text-gray-500">Click to upload</span>
                </button>
              )}

              {/* Back of Document */}
              {backDocument ? (
                <DocumentUploadArea
                  label="Back of Document"
                  onFileSelect={setBackDocument}
                  initialFile={backDocument}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setBackModalOpen(true)}
                  className="w-full flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-700 mb-1">
                    Back of Document
                  </span>
                  <span className="text-xs text-gray-500">Click to upload</span>
                </button>
              )}

              {/* Selfie with Document */}
              {selfieDocument ? (
                <DocumentUploadArea
                  label="Selfie with Document"
                  onFileSelect={setSelfieDocument}
                  initialFile={selfieDocument}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setSelfieModalOpen(true)}
                  className="w-full flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-700 mb-1">
                    Selfie with Document
                  </span>
                  <span className="text-xs text-gray-500">Click to upload</span>
                </button>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !documentType ||
              !documentNumber ||
              !frontDocument ||
              !backDocument ||
              !selfieDocument
            }
            className="w-full bg-[var(--theme-primary)] text-[var(--theme-primary-text)] py-4 rounded-xl font-semibold hover:bg-[var(--theme-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? "Submitting..." : "Submit for Verification"}
          </button>
        </div>
      </main>
      <BottomNavigation />
      
      {/* Upload Modals */}
      <DocumentUploadModal
        isOpen={frontModalOpen}
        onClose={() => setFrontModalOpen(false)}
        onUploadComplete={(file) => {
          setFrontDocument(file);
          setFrontModalOpen(false);
        }}
        label="Front of Document"
        initialFile={frontDocument}
      />
      <DocumentUploadModal
        isOpen={backModalOpen}
        onClose={() => setBackModalOpen(false)}
        onUploadComplete={(file) => {
          setBackDocument(file);
          setBackModalOpen(false);
        }}
        label="Back of Document"
        initialFile={backDocument}
      />
      <DocumentUploadModal
        isOpen={selfieModalOpen}
        onClose={() => setSelfieModalOpen(false)}
        onUploadComplete={(file) => {
          setSelfieDocument(file);
          setSelfieModalOpen(false);
        }}
        label="Selfie with Document"
        initialFile={selfieDocument}
      />
    </div>
  );
}
