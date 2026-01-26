"use client";

import { useState } from "react";
import { Upload, CircleCheck } from "lucide-react";
import DocumentUploadModal from "./DocumentUploadModal";

interface DocumentUploadAreaProps {
  label: string;
  onFileSelect: (file: File | null) => void;
  initialFile?: File | null;
}

export default function DocumentUploadArea({
  label,
  onFileSelect,
  initialFile = null,
}: DocumentUploadAreaProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(initialFile || null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUploadClick = () => {
    setIsModalOpen(true);
  };

  const handleUploadComplete = (file: File) => {
    setUploadedFile(file);
    onFileSelect(file);
  };

  const handleChange = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        {uploadedFile ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CircleCheck className="w-5 h-5 text-green-700" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Document uploaded
                  </p>
                  <p className="text-xs text-gray-600">
                    {uploadedFile.name}
                  </p>
                </div>
              </div>
              <button
                onClick={handleChange}
                className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors cursor-pointer"
              >
                Change
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleUploadClick}
            className="w-full flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">
              Upload {label}
            </span>
          </button>
        )}
      </div>
      <DocumentUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadComplete={handleUploadComplete}
        label={label}
        initialFile={uploadedFile}
      />
    </>
  );
}
