import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
import {
  AdminProfile,
  OrganizationSettings,
  NotificationSettings,
  ThemeSettings,
  SecuritySettings,
} from "@/types/settings";

// ==========================
// Admin Profile
// ==========================

export async function getAdminProfile(id: string) {
  const { data, error } = await supabase
    .from("admin_profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data as AdminProfile;
}

export async function updateAdminProfile(
  id: string,
  values: Partial<AdminProfile>
) {
  const { data, error } = await supabase
    .from("admin_profiles")
    .update(values)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

// ==========================
// Organization
// ==========================

export async function getOrganizationSettings() {
  const { data, error } = await supabase
    .from("organization_settings")
    .select("*")
    .single();

  if (error) throw error;

  return data as OrganizationSettings;
}

export async function updateOrganizationSettings(
  values: Partial<OrganizationSettings>
) {
  const { data, error } = await supabase
    .from("organization_settings")
    .update(values)
    .eq("id", values.id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

// ==========================
// Notifications
// ==========================

export async function getNotificationSettings() {
  const { data, error } = await supabase
    .from("notification_settings")
    .select("*")
    .single();

  if (error) throw error;

  return data as NotificationSettings;
}

export async function updateNotificationSettings(
  values: Partial<NotificationSettings>
) {
  const { data, error } = await supabase
    .from("notification_settings")
    .update(values)
    .eq("id", values.id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

// ==========================
// Theme
// ==========================

export async function getThemeSettings() {
  const { data, error } = await supabase
    .from("theme_settings")
    .select("*")
    .single();

  if (error) throw error;

  return data as ThemeSettings;
}

export async function updateThemeSettings(
  values: Partial<ThemeSettings>
) {
  const { data, error } = await supabase
    .from("theme_settings")
    .update(values)
    .eq("id", values.id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

// ==========================
// Security
// ==========================

export async function getSecuritySettings() {
  const { data, error } = await supabase
    .from("security_settings")
    .select("*")
    .single();

  if (error) throw error;

  return data as SecuritySettings;
}

export async function updateSecuritySettings(
  values: Partial<SecuritySettings>
) {
  const { data, error } = await supabase
    .from("security_settings")
    .update(values)
    .eq("id", values.id)
    .select()
    .single();

  if (error) throw error;

  return data;
}