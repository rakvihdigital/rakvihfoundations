import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const videoId = searchParams.get("videoId");

    if (!videoId) {
      return NextResponse.json(
        { message: "Video id is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("course_videos")
      .select("*")
      .eq("id", videoId)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Unable to fetch video" },
      { status: 500 }
    );
  }
}