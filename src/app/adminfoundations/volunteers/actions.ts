"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ================= VOLUNTEERS =================
export async function getVolunteers() {
  const { data, error } = await supabaseAdmin
    .from("volunteers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching volunteers:", error.message);
    return [];
  }
  return data;
}

export async function deleteVolunteer(id: string) {
  const { error } = await supabaseAdmin
    .from("volunteers")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting volunteer:", error.message);
    throw new Error(error.message);
  }
  revalidatePath("/adminfoundations/volunteers");
}

export async function updateVolunteerStatus(id: string, status: "approved" | "rejected" | "pending") {
  const { data, error } = await supabaseAdmin
    .from("volunteers")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating volunteer status:", error.message);
    throw new Error(error.message);
  }
  
  revalidatePath("/adminfoundations/volunteers");
  return data;
}

// ================= EVENTS =================
export async function getEvents() {
  const { data, error } = await supabaseAdmin
    .from("volunteer_events")
    .select("*")
    .order("event_date", { ascending: true });

  if (error) {
    console.error("Error fetching events:", error.message);
    return [];
  }
  return data;
}

export async function createEvent(formData: FormData) {
  const { error } = await supabaseAdmin.from("volunteer_events").insert([{
    title: formData.get("title"), 
    category: formData.get("category"), 
    event_date: formData.get("event_date"), 
    event_time: formData.get("event_time"), 
    location: formData.get("location")
  }]);

  if (error) {
    console.error("Error creating event:", error.message);
    throw new Error(error.message);
  }
  revalidatePath("/adminfoundations/volunteers");
}

export async function updateEvent(id: string, formData: FormData) {
  const { error } = await supabaseAdmin
    .from("volunteer_events")
    .update({
      title: formData.get("title"),
      category: formData.get("category"),
      event_date: formData.get("event_date"),
      event_time: formData.get("event_time"),
      location: formData.get("location"),
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating event:", error.message);
    throw new Error(error.message);
  }
  revalidatePath("/adminfoundations/volunteers");
}

export async function deleteEvent(id: string) {
  const { error } = await supabaseAdmin
    .from("volunteer_events")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting event:", error.message);
    throw new Error(error.message);
  }
  revalidatePath("/adminfoundations/volunteers");
}

// ================= ANNOUNCEMENTS =================
export async function getAnnouncements() {
  const { data, error } = await supabaseAdmin
    .from("volunteer_announcements")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching announcements:", error.message);
    return [];
  }
  return data;
}

export async function createAnnouncement(formData: FormData) {
  const { error } = await supabaseAdmin.from("volunteer_announcements").insert([{
    type: formData.get("type"), 
    title: formData.get("title"), 
    message: formData.get("message")
  }]);

  if (error) {
    console.error("Error creating announcement:", error.message);
    throw new Error(error.message);
  }
  revalidatePath("/adminfoundations/volunteers");
}

export async function deleteAnnouncement(id: string) {
  const { error } = await supabaseAdmin
    .from("volunteer_announcements")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting announcement:", error.message);
    throw new Error(error.message);
  }
  revalidatePath("/adminfoundations/volunteers");
}

// ================= HOURS LOGGING =================
export async function logVolunteerHours(formData: FormData) {
  const { error } = await supabaseAdmin.from("volunteer_logs").insert([{
    volunteer_id: formData.get("volunteer_id"), 
    title: formData.get("title"), 
    date: formData.get("date"), 
    hours: parseInt(formData.get("hours") as string, 10), 
    status: "Verified"
  }]);

  if (error) {
    console.error("Error logging hours:", error.message);
    throw new Error(error.message);
  }
  revalidatePath("/adminfoundations/volunteers");
}

export async function updateVolunteerLog(id: string, formData: FormData) {
  const { error } = await supabaseAdmin
    .from("volunteer_logs")
    .update({
      volunteer_id: formData.get("volunteer_id"),
      title: formData.get("title"),
      date: formData.get("date"),
      hours: parseInt(formData.get("hours") as string, 10),
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating log:", error.message);
    throw new Error(error.message);
  }
  revalidatePath("/adminfoundations/volunteers");
}

export async function getRecentLogs() {
  const { data, error } = await supabaseAdmin
    .from("volunteer_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    console.error("Error fetching logs:", error.message);
    return [];
  }
  return data;
}

export async function deleteVolunteerLog(id: string) {
  const { error } = await supabaseAdmin
    .from("volunteer_logs")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting log:", error.message);
    throw new Error(error.message);
  }
  revalidatePath("/adminfoundations/volunteers");
}

// ================= EVENT REGISTRATIONS =================
export async function getEventRegistrations() {
  const { data, error } = await supabaseAdmin
    .from("event_registrations")
    .select(`
      *,
      volunteers ( id, name, email, phone, display_id ),
      volunteer_events ( title, event_date )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching event registrations:", error.message);
    throw new Error("Event Registrations DB Error: " + error.message); 
  }
  return data;
}

export async function updateRegistrationStatus(id: string, status: "approved" | "rejected") {
  const { error } = await supabaseAdmin
    .from("event_registrations")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Error updating registration status:", error.message);
    throw new Error(error.message);
  }
  revalidatePath("/adminfoundations/volunteers");
}