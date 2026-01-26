export interface KycSubmission {
  id: string;
  user_id: string;
  full_name: string;
  date_of_birth: string | null;
  nationality: string | null;
  address_line: string | null;
  city: string | null;
  zip_code: string | null;
  country: string | null;
  id_type: "passport" | "national_id" | "driver_license" | null;
  id_number: string | null;
  id_front_url: string;
  id_back_url: string | null;
  selfie_url: string;
  status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  reviewed_by: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  updated_at: string;
}

export interface KycResult {
  success: boolean;
  data?: KycSubmission | null;
  error?: string;
}
