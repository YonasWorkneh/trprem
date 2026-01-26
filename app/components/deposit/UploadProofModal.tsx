"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { X, Upload as UploadIcon } from "lucide-react";

interface UploadProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (file: File) => void;
}

export default function UploadProofModal({
  isOpen,
  onClose,
  onUploadComplete,
}: UploadProofModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
        toast.error("File must be JPG or PNG format");
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSelectProof = () => {
    if (selectedFile) {
      onUploadComplete(selectedFile);
      onClose();
      // Clean up preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Upload Payment Proof
            </h2>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-6">
              Upload a screenshot or photo of your transaction receipt
            </p>

            {/* File Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Image
              </label>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="proof-upload"
                />
                <label
                  htmlFor="proof-upload"
                  className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Choose File
                </label>
                <span className="text-sm text-gray-500">
                  {selectedFile ? selectedFile.name : "No file chosen"}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Maximum file size: 5MB. Formats: JPG, PNG
              </p>
            </div>

            {/* Preview */}
            {previewUrl && (
              <div className="mb-6">
                <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                  <div className="relative w-full aspect-square max-h-64 flex items-center justify-center overflow-hidden rounded-lg">
                    <img
                      src={previewUrl}
                      alt="Payment proof preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 bg-white border-2 border-gray-300 text-gray-900 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSelectProof}
                disabled={!selectedFile}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                <UploadIcon className="w-4 h-4" />
                <span>Select Proof</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
