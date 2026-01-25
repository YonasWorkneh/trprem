export interface LoginCredentials {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterCredentials {
  fullName: string;
  email?: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  invitationCode?: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  data?: {
    user: {
      id: string;
      email?: string;
      phone?: string;
    };
  };
}

export interface Profile {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string | null;
  is_verified: boolean;
  created_at: string;
}
