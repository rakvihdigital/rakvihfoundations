"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ================= VOLUNTEERS =================
export async function getVolunteers() {
  const { data: vols, error } = await supabaseAdmin
    .from("volunteers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching volunteers:", error.message);
    return [];
  }

  // Safely aggregate completed opportunities & hours from volunteer_logs
  try {
    const { data: logs } = await supabaseAdmin
      .from("volunteer_logs")
      .select("volunteer_id, hours");

    if (logs) {
      const logMap: Record<string, { count: number; hours: number }> = {};
      logs.forEach((l) => {
        if (!logMap[l.volunteer_id]) logMap[l.volunteer_id] = { count: 0, hours: 0 };
        logMap[l.volunteer_id].count += 1;
        logMap[l.volunteer_id].hours += Number(l.hours) || 0;
      });

      return (vols || []).map((v) => ({
        ...v,
        completed_opportunities: logMap[v.id]?.count || 0,
        total_hours: logMap[v.id]?.hours || 0,
      }));
    }
  } catch (logErr) {
    console.warn("Could not aggregate logs for volunteers:", logErr);
  }

  return vols || [];
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

// ================= EVENT REGISTRATIONS & SHIFT TIMER =================
export async function getEventRegistrations() {
  const { data, error } = await supabaseAdmin
    .from("event_registrations")
    .select(`
      *,
      volunteers ( id, name, email, phone, display_id ),
      volunteer_events ( title, event_date, event_time, location )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching event registrations:", error.message);
    throw new Error("Event Registrations DB Error: " + error.message); 
  }

  // Fetch all volunteer_logs to pair with registrations
  const { data: logs } = await supabaseAdmin
    .from("volunteer_logs")
    .select("*");

  const enriched = (data || []).map((reg: any) => {
    const matchingLog = (logs || []).find((l: any) =>
      l.volunteer_id === reg.volunteer_id &&
      reg.volunteer_events?.title &&
      l.title?.toLowerCase().trim() === reg.volunteer_events.title.toLowerCase().trim()
    );

    let shiftInfo = {
      state: "not_started" as "not_started" | "in_progress" | "ended" | "verified",
      startTime: null as string | null,
      endTime: null as string | null,
      duration: null as string | null,
      hours: 0,
    };

    if (matchingLog) {
      const raw = matchingLog.status || "";
      try {
        const parsed = JSON.parse(raw);
        if (parsed.type === "SHIFT_STARTED") {
          shiftInfo.state = "in_progress";
          shiftInfo.startTime = parsed.start;
        } else if (parsed.type === "SHIFT_ENDED" || parsed.type === "VERIFIED_COMPLETED") {
          shiftInfo.state = reg.status === "completed" ? "verified" : "ended";
          shiftInfo.startTime = parsed.start;
          shiftInfo.endTime = parsed.end;
          shiftInfo.duration = parsed.duration;
          shiftInfo.hours = parsed.hours || matchingLog.hours || 0;
        }
      } catch {
        if (raw === "Verified" || reg.status === "completed") {
          shiftInfo.state = "verified";
          shiftInfo.hours = matchingLog.hours || 0;
        }
      }
    }

    return {
      ...reg,
      shift: shiftInfo,
    };
  });

  return enriched;
}

export async function startVolunteerShift({
  volunteerId,
  eventTitle,
  eventDate,
}: {
  volunteerId: string;
  eventTitle: string;
  eventDate: string;
}) {
  const startTimeISO = new Date().toISOString();
  const statusStr = JSON.stringify({
    type: "SHIFT_STARTED",
    start: startTimeISO,
  });

  // Check if log already exists
  const { data: existingLog } = await supabaseAdmin
    .from("volunteer_logs")
    .select("id")
    .eq("volunteer_id", volunteerId)
    .eq("title", eventTitle)
    .maybeSingle();

  if (existingLog) {
    await supabaseAdmin
      .from("volunteer_logs")
      .update({
        date: eventDate,
        status: statusStr,
      })
      .eq("id", existingLog.id);
  } else {
    await supabaseAdmin.from("volunteer_logs").insert([{
      volunteer_id: volunteerId,
      title: eventTitle,
      date: eventDate,
      hours: 0,
      status: statusStr,
    }]);
  }

  revalidatePath("/adminfoundations/volunteers/approvals");
  return { success: true, startTime: startTimeISO };
}

export async function endVolunteerShift({
  volunteerId,
  eventTitle,
  eventDate,
}: {
  volunteerId: string;
  eventTitle: string;
  eventDate: string;
}) {
  const endTime = new Date();
  const endTimeISO = endTime.toISOString();

  // Find the existing log with start time
  const { data: existingLog } = await supabaseAdmin
    .from("volunteer_logs")
    .select("*")
    .eq("volunteer_id", volunteerId)
    .eq("title", eventTitle)
    .maybeSingle();

  let startTimeISO = new Date(Date.now() - 3600000).toISOString();
  if (existingLog?.status) {
    try {
      const parsed = JSON.parse(existingLog.status);
      if (parsed.start) startTimeISO = parsed.start;
    } catch {}
  }

  const startMs = new Date(startTimeISO).getTime();
  const endMs = endTime.getTime();
  const diffMs = Math.max(0, endMs - startMs);

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const formattedDuration = diffHours > 0 
    ? `${diffHours}h ${diffMinutes}m` 
    : `${Math.max(1, diffMinutes)}m`;

  const calculatedHours = Math.max(1, Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10);
  const statusStr = JSON.stringify({
    type: "SHIFT_ENDED",
    start: startTimeISO,
    end: endTimeISO,
    duration: formattedDuration,
    hours: calculatedHours,
  });

  if (existingLog) {
    await supabaseAdmin
      .from("volunteer_logs")
      .update({
        hours: calculatedHours,
        status: statusStr,
      })
      .eq("id", existingLog.id);
  } else {
    await supabaseAdmin.from("volunteer_logs").insert([{
      volunteer_id: volunteerId,
      title: eventTitle,
      date: eventDate,
      hours: calculatedHours,
      status: statusStr,
    }]);
  }

  revalidatePath("/adminfoundations/volunteers/approvals");
  return { 
    success: true, 
    startTime: startTimeISO, 
    endTime: endTimeISO, 
    duration: formattedDuration, 
    hours: calculatedHours 
  };
}

export async function getVolunteerShiftStatus(volunteerId: string, eventTitle: string) {
  const { data: log } = await supabaseAdmin
    .from("volunteer_logs")
    .select("*")
    .eq("volunteer_id", volunteerId)
    .eq("title", eventTitle)
    .maybeSingle();

  if (!log) return { state: "not_started", startTime: null, endTime: null, duration: null, hours: 0 };

  try {
    const parsed = JSON.parse(log.status || "");
    return {
      state: parsed.type === "SHIFT_STARTED" ? "in_progress" : parsed.type === "SHIFT_ENDED" || parsed.type === "VERIFIED_COMPLETED" ? "ended" : "not_started",
      startTime: parsed.start || null,
      endTime: parsed.end || null,
      duration: parsed.duration || null,
      hours: parsed.hours || log.hours || 0,
    };
  } catch {
    return { state: "not_started", startTime: null, endTime: null, duration: null, hours: 0 };
  }
}

export async function updateRegistrationStatus(id: string, status: "approved" | "rejected" | "completed" | "pending") {
  // 1. Update status and fetch registration details
  const { data: updatedReg, error } = await supabaseAdmin
    .from("event_registrations")
    .update({ status })
    .eq("id", id)
    .select(`
      *,
      volunteers ( id, name ),
      volunteer_events ( title, event_date )
    `)
    .single();

  if (error) {
    console.error("Error updating registration status:", error.message);
    throw new Error(error.message);
  }

  // 2. If marked as "completed", automatically verify log entry into volunteer_logs
  if (status === "completed" && updatedReg?.volunteer_id) {
    try {
      const eventTitle = updatedReg.volunteer_events?.title || "Community Drive";
      const eventDate = updatedReg.volunteer_events?.event_date || new Date().toISOString().split("T")[0];

      // Check if log already exists
      const { data: existingLog } = await supabaseAdmin
        .from("volunteer_logs")
        .select("*")
        .eq("volunteer_id", updatedReg.volunteer_id)
        .eq("title", eventTitle)
        .maybeSingle();

      let shiftMeta = {
        type: "VERIFIED_COMPLETED",
        start: null as string | null,
        end: null as string | null,
        duration: null as string | null,
        hours: 2
      };

      if (existingLog?.status) {
        try {
          const parsed = JSON.parse(existingLog.status);
          shiftMeta = { ...shiftMeta, ...parsed, type: "VERIFIED_COMPLETED" };
        } catch {}
      }

      if (existingLog) {
        await supabaseAdmin
          .from("volunteer_logs")
          .update({
            status: JSON.stringify(shiftMeta),
          })
          .eq("id", existingLog.id);
      } else {
        await supabaseAdmin.from("volunteer_logs").insert([{
          volunteer_id: updatedReg.volunteer_id,
          title: eventTitle,
          date: eventDate,
          hours: 2,
          status: JSON.stringify(shiftMeta),
        }]);
      }
    } catch (logErr) {
      console.warn("Could not auto-insert volunteer log for completed event:", logErr);
    }
  } else if (status !== "completed" && updatedReg?.volunteer_id) {
    // If reverted back to approved or rejected, remove the completed log
    try {
      const eventTitle = updatedReg.volunteer_events?.title;
      if (eventTitle) {
        await supabaseAdmin
          .from("volunteer_logs")
          .delete()
          .eq("volunteer_id", updatedReg.volunteer_id)
          .eq("title", eventTitle);
      }
    } catch (revertErr) {
      console.warn("Could not remove log on status revert:", revertErr);
    }
  }

  revalidatePath("/adminfoundations/volunteers");
  revalidatePath("/adminfoundations/volunteers/approvals");
}