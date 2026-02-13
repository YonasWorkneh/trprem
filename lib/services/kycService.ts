"use client";

import { supabase } from "../supabase";
import type { KycSubmission, KycResult } from "../types/kyc";

export async function getKycSubmission(userId: string): Promise<KycResult> {
  try {
    const { data, error } = await supabase
      .from("kyc_submissions")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data as KycSubmission | null,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function submitKycSubmission(
  userId: string,
  kycData: {
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
      backDocument?: File | null;
    };
    selfie: {
      selfieImage: File | null;
    };
  },
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate required files
    if (!kycData.documents.frontDocument || !kycData.selfie.selfieImage) {
      return {
        success: false,
        error: "Required documents are missing",
      };
    }

    // Upload files to kyc bucket
    const frontUrl = await uploadFileToBucket(
      kycData.documents.frontDocument,
      "kyc",
    );
    const selfieUrl = await uploadFileToBucket(
      kycData.selfie.selfieImage,
      "kyc",
    );

    let backUrl: string | null = null;
    if (kycData.documents.backDocument) {
      backUrl = await uploadFileToBucket(kycData.documents.backDocument, "kyc");
    }

    // Map idType from form to database enum
    const idTypeMap: Record<
      string,
      "passport" | "national_id" | "driver_license"
    > = {
      passport: "passport",
      driver_license: "driver_license",
      national_id: "national_id",
    };

    // Insert KYC submission
    const { error } = await supabase.from("kyc_submissions").insert({
      user_id: userId,
      full_name: kycData.personal.fullName,
      date_of_birth: kycData.personal.dateOfBirth,
      nationality: kycData.personal.nationality,
      address_line: kycData.address.street,
      city: kycData.address.city,
      zip_code: kycData.address.zipcode || null,
      country: kycData.address.country,
      id_type: idTypeMap[kycData.documents.idType] || "passport",
      id_number: kycData.documents.idNumber,
      id_front_url: frontUrl,
      id_back_url: backUrl,
      selfie_url: selfieUrl,
      status: "pending",
    });

    if (error) {
      console.error("KYC submission error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    // Update user's KYC status
    const { error: userUpdateError } = await supabase
      .from("users")
      .update({ kyc_status: "pending" })
      .eq("id", userId);

    if (userUpdateError) {
      console.error("User KYC status update error:", userUpdateError);
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("KYC submission error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

async function uploadFileToBucket(file: File, bucket: string): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(`Failed to upload file: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return publicUrl;
}
