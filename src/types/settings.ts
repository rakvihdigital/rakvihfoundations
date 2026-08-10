export interface AdminProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  avatar: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface OrganizationSettings {
  id: string;
  organization_name: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  logo: string | null;
}

export interface NotificationSettings {
  id: string;
  email_notifications: boolean;
  payment_notifications: boolean;
  student_notifications: boolean;
  marketing_notifications: boolean;
}

export interface ThemeSettings {
  id: string;
  theme: "light" | "dark" | "system";
  primary_color: string;
}

export interface SecuritySettings {
  id: string;
  two_factor: boolean;
  login_alerts: boolean;
}

export interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}