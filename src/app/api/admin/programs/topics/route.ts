import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ======================
// GET TOPICS
// ======================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const syllabusId = searchParams.get("syllabus_id");

    if (!syllabusId) {
      return NextResponse.json(
        {
          error: "Syllabus ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const { data, error } = await supabase
      .from("course_topics")
      .select("*")
      .eq("syllabus_id", syllabusId);

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

// ======================
// ADD TOPIC
// ======================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { data, error } = await supabase
      .from("course_topics")
      .insert(body)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      topic: data,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}