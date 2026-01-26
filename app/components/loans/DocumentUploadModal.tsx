"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { X, Upload as UploadIcon } from "lucide-react";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (file: File) => void;
  label: string;
  initialFile?: File | null;
}

export default function DocumentUploadModal({
  isOpen,
  onClose,
  onUploadComplete,
  label,
  initialFile = null,
}: DocumentUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with initialFile when modal opens
  useEffect(() => {
    if (isOpen && initialFile) {
      setSelectedFile(initialFile);
      const url = URL.createObjectURL(initialFile);
      setPreviewUrl(url);
    } else if (!isOpen) {
      // Clean up when modal closes
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialFile]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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

      // Clean up previous preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSelectDocument = () => {
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
              Upload {label}
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
              Upload a clear photo of the {label.toLowerCase()} of your document
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
                  id="document-upload"
                />
                <label
                  htmlFor="document-upload"
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
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="relative w-full aspect-square max-h-64 flex items-center justify-center overflow-hidden rounded-lg">
                    <img
                      src={previewUrl}
                      alt={`${label} preview`}
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
                className="flex-1 bg-white border border-gray-300 text-gray-900 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSelectDocument}
                disabled={!selectedFile}
                className="flex-1 bg-[#F4D03F] text-yellow-900 py-3 rounded-xl font-medium hover:bg-[#F1C40F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                <UploadIcon className="w-4 h-4" />
                <span>Select Document</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
