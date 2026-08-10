import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    





    const { searchParams } = new URL(req.url);

const moduleId = searchParams.get("moduleId");
const programId = searchParams.get("programId");

let query = supabase
  .from("course_videos")
  .select(`
    *,
    programs(title),
    course_syllabus(module_name),
    course_topics(topic)
  `)
  .not("syllabus_id", "is", null)   // Only module videos
  .is("topic_id", null);

if (moduleId) {
  query = query.eq("syllabus_id", moduleId);
}

if (programId) {
  query = query.eq("program_id", programId);
}

const { data, error } = await query.order("id", {
  ascending: true,
});
    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch module videos",
      },
      {
        status: 500,
      }
    );
  }
}