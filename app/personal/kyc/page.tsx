"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import Header from "@/app/components/Header";
import BottomNavigation from "@/app/components/BottomNavigation";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  submitKycSubmission,
  getKycSubmission,
} from "@/lib/services/kycService";
import type { KycSubmission } from "@/lib/types/kyc";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  Camera,
  FileText,
  User,
  MapPin,
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

interface KYCData {
  personal: {
    fullName: string;
    dateOfBirth: string;
    nationality: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
  };
  documents: {
    idType: string;
    idNumber: string;
    frontDocument: File | null;
    backDocument: File | null;
  };
  selfie: {
    selfieImage: File | null;
  };
}

const steps = [
  { id: "personal", title: "Personal", icon: User },
  { id: "address", title: "Address", icon: MapPin },
  { id: "documents", title: "Documents", icon: FileText },
  { id: "selfie", title: "Selfie", icon: Camera },
];

export default function KYCPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const [kycDetails, setKycDetails] = useState<KycSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);
  const [kycData, setKycData] = useState<KYCData>({
    personal: {
      fullName: "",
      dateOfBirth: "",
      nationality: "",
    },
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipcode: "",
    },
    documents: {
      idType: "",
      idNumber: "",
      frontDocument: null,
      backDocument: null,
    },
    selfie: {
      selfieImage: null,
    },
  });

  useEffect(() => {
    const checkKycStatus = async () => {
      if (!user || hasChecked) return;

      setIsLoading(true);
      setHasChecked(true);

      const result = await getKycSubmission(user.id);

      if (result.success && result.data) {
        setKycStatus(result.data.status);
        setKycDetails(result.data);
      } else if (profile?.kyc_status) {
        setKycStatus(profile.kyc_status);
      }
      setIsLoading(false);
    };

    checkKycStatus();
  }, [user, profile, hasChecked]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header title="KYC Verification" />
        <main className="flex-1 pb-20 px-4 pt-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F4D03F]"></div>
            </div>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  if (kycStatus === "verified") {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header title="KYC Verification" />
        <main className="flex-1 pb-20 px-4 pt-6 h-full flex items-center justify-center">
          <div className="max-w-2xl mx-auto">
            <Card className="mb-6 bg-transparent shadow-none">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-700 mb-2">
                  KYC Verified
                </h2>
                <p className="text-gray-600 mb-6">
                  Your identity has been successfully verified. You now have
                  full access to all platform features.
                </p>
                <Button
                  onClick={() => router.push("/personal")}
                  className="bg-[#F4D03F] hover:bg-[#E4C02F] cursor-pointer"
                >
                  Back to Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  if (kycStatus === "pending") {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header title="KYC Verification" />
        <main className="flex-1 pb-20 px-4 pt-6 h-full flex items-center justify-center">
          <div className="max-w-2xl mx-auto">
            <Card className="mb-6 bg-transparent shadow-none">
              <CardContent className="p-8 text-center">
                <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-yellow-700 mb-2">
                  KYC Under Review
                </h2>
                <p className="text-gray-600 mb-6">
                  Your KYC application is currently being reviewed by our team.
                  This typically takes 1-3 business days.
                </p>
                {kycDetails && (
                  <div className="text-left bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold mb-2">Submitted Details:</h3>
                    <p>
                      <strong>Name:</strong> {kycDetails.full_name}
                    </p>
                    <p>
                      <strong>ID Type:</strong>{" "}
                      {kycDetails.id_type?.replace("_", " ")}
                    </p>
                    <p>
                      <strong>Submitted:</strong>{" "}
                      {new Date(kycDetails.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <Button
                  onClick={() => router.push("/personal")}
                  className="bg-[#F4D03F] hover:bg-[#E4C02F] cursor-pointer"
                >
                  Back to Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  if (kycStatus === "rejected") {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header title="KYC Verification" />
        <main className="flex-1 pb-20 px-4 pt-6">
          <div className="max-w-2xl mx-auto">
            <Card className="mb-6">
              <CardContent className="p-8 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-red-700 mb-2">
                  KYC Rejected
                </h2>
                <p className="text-gray-600 mb-6">
                  Your KYC application was not approved.{" "}
                  {kycDetails?.rejection_reason &&
                    `Reason: ${kycDetails.rejection_reason}`}
                </p>
                <Button
                  onClick={() => router.push("/personal")}
                  className="bg-[#F4D03F] hover:bg-[#E4C02F]"
                >
                  Back to Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0: // Personal
        return (
          kycData.personal.fullName.trim() !== "" &&
          kycData.personal.dateOfBirth !== "" &&
          kycData.personal.nationality.trim() !== ""
        );
      case 1: // Address
        return (
          kycData.address.street.trim() !== "" &&
          kycData.address.city.trim() !== "" &&
          kycData.address.state.trim() !== "" &&
          kycData.address.country.trim() !== ""
        );
      case 2: // Documents
        return (
          kycData.documents.idType !== "" &&
          kycData.documents.idNumber.trim() !== "" &&
          kycData.documents.frontDocument !== null
        );
      case 3: // Selfie
        return kycData.selfie.selfieImage !== null;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("You must be logged in to submit KYC");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitKycSubmission(user.id, kycData);

      if (result.success) {
        toast.success("KYC verification submitted successfully");
        router.push("/personal");
      } else {
        toast.error(result.error || "Failed to submit KYC verification");
      }
    } catch (error) {
      console.error("KYC submission error:", error);
      toast.error("Failed to submit KYC verification");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (field: string, file: File) => {
    setKycData((prev) => ({
      ...prev,
      [field.split(".")[0]]: {
        ...prev[field.split(".")[0] as keyof KYCData],
        [field.split(".")[1]]: file,
      },
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Personal
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={kycData.personal.fullName}
                onChange={(e) =>
                  setKycData((prev) => ({
                    ...prev,
                    personal: { ...prev.personal, fullName: e.target.value },
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={kycData.personal.dateOfBirth}
                onChange={(e) =>
                  setKycData((prev) => ({
                    ...prev,
                    personal: { ...prev.personal, dateOfBirth: e.target.value },
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality *</Label>
              <Input
                id="nationality"
                type="text"
                placeholder="Enter your nationality"
                value={kycData.personal.nationality}
                onChange={(e) =>
                  setKycData((prev) => ({
                    ...prev,
                    personal: { ...prev.personal, nationality: e.target.value },
                  }))
                }
                required
              />
            </div>
          </div>
        );
      case 1: // Address
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                type="text"
                placeholder="Enter your street address"
                value={kycData.address.street}
                onChange={(e) =>
                  setKycData((prev) => ({
                    ...prev,
                    address: { ...prev.address, street: e.target.value },
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                type="text"
                placeholder="Enter your city"
                value={kycData.address.city}
                onChange={(e) =>
                  setKycData((prev) => ({
                    ...prev,
                    address: { ...prev.address, city: e.target.value },
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province *</Label>
              <Input
                id="state"
                type="text"
                placeholder="Enter your state or province"
                value={kycData.address.state}
                onChange={(e) =>
                  setKycData((prev) => ({
                    ...prev,
                    address: { ...prev.address, state: e.target.value },
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                type="text"
                placeholder="Enter your country"
                value={kycData.address.country}
                onChange={(e) =>
                  setKycData((prev) => ({
                    ...prev,
                    address: { ...prev.address, country: e.target.value },
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipcode">Zip Code (Optional)</Label>
              <Input
                id="zipcode"
                type="text"
                placeholder="Enter your zip code"
                value={kycData.address.zipcode}
                onChange={(e) =>
                  setKycData((prev) => ({
                    ...prev,
                    address: { ...prev.address, zipcode: e.target.value },
                  }))
                }
              />
            </div>
          </div>
        );
      case 2: // Documents
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="idType">ID Type *</Label>
              <select
                id="idType"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={kycData.documents.idType}
                onChange={(e) =>
                  setKycData((prev) => ({
                    ...prev,
                    documents: { ...prev.documents, idType: e.target.value },
                  }))
                }
                required
              >
                <option value="">Select ID type</option>
                <option value="passport">Passport</option>
                <option value="driver_license">Driver&apos;s License</option>
                <option value="national_id">National ID</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="idNumber">ID Number *</Label>
              <Input
                id="idNumber"
                type="text"
                placeholder="Enter your ID number"
                value={kycData.documents.idNumber}
                onChange={(e) =>
                  setKycData((prev) => ({
                    ...prev,
                    documents: { ...prev.documents, idNumber: e.target.value },
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frontDocument">Front of Document *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload front of your ID document
                </p>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload("documents.frontDocument", file);
                  }}
                  className="hidden"
                  id="front-upload"
                />
                <label
                  htmlFor="front-upload"
                  className="cursor-pointer text-[#F4D03F] hover:underline"
                >
                  Choose File
                </label>
                {kycData.documents.frontDocument && (
                  <p className="text-sm text-green-600 mt-2">
                    {kycData.documents.frontDocument.name}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="backDocument">Back of Document</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload back of your ID document (if applicable)
                </p>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload("documents.backDocument", file);
                  }}
                  className="hidden"
                  id="back-upload"
                />
                <label
                  htmlFor="back-upload"
                  className="cursor-pointer text-[#F4D03F] hover:underline"
                >
                  Choose File
                </label>
                {kycData.documents.backDocument && (
                  <p className="text-sm text-green-600 mt-2">
                    {kycData.documents.backDocument.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      case 3: // Selfie
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="selfie">Selfie Photo *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-4">
                  Take a clear selfie with your face visible
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload("selfie.selfieImage", file);
                  }}
                  className="hidden"
                  id="selfie-upload"
                />
                <label
                  htmlFor="selfie-upload"
                  className="cursor-pointer text-[#F4D03F] hover:underline"
                >
                  Take/Upload Selfie
                </label>
                {kycData.selfie.selfieImage && (
                  <p className="text-sm text-green-600 mt-4">
                    {kycData.selfie.selfieImage.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header title="KYC Verification" />
      <main className="flex-1 pb-20 px-4 pt-6">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 bg-gray-100 cursor-pointer hover:bg-gray-200/50 px-4 py-2 rounded-md hover:text-gray-900 mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="">Back</span>
          </button>
          {/* Step Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;

                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center relative">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center relative ${
                          isActive
                            ? "bg-[#F4D03F] text-white"
                            : isCompleted
                              ? "bg-[#F4D03F] text-white"
                              : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <span
                        className={`text-xs mt-1 ${
                          isActive
                            ? "text-[#F4D03F] font-semibold"
                            : "text-gray-600"
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                    {/* Progress Line */}
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-4 ${
                          isCompleted ? "bg-[#F4D03F]" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">
                {steps[currentStep].title} Information
              </CardTitle>
              <CardDescription>
                {currentStep === 0 && "Enter your personal details"}
                {currentStep === 1 && "Enter your residential address"}
                {currentStep === 2 && "Upload your identification documents"}
                {currentStep === 3 && "Take a selfie for verification"}
              </CardDescription>
            </CardHeader>
            <CardContent>{renderStepContent()}</CardContent>
          </Card>

          {/* Why we need this info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">
                    Why do we need this?
                  </h4>
                  <p className="text-sm text-blue-800">
                    KYC verification is required by law to prevent fraud and
                    ensure the security of our platform. Your information is
                    encrypted and stored securely.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>
            <Button
              onClick={handleNext}
              disabled={!validateCurrentStep() || isSubmitting}
              className="bg-[#F4D03F] hover:bg-[#E4C02F] text-white flex items-center space-x-2"
            >
              {isSubmitting ? (
                <span>Submitting...</span>
              ) : (
                <span>
                  {currentStep === steps.length - 1 ? "Submit" : "Next"}
                </span>
              )}
              {currentStep < steps.length - 1 && (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
