import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: details } = await supabase
    .from("course_details")
    .select("*")
    .eq("program_id", id)
    .maybeSingle();

  const { data: learning } = await supabase
    .from("course_learning")
    .select("*")
    .eq("program_id", id);

  const { data: careers } = await supabase
    .from("course_careers")
    .select("*")
    .eq("program_id", id);

  const { data: projects } = await supabase
    .from("course_projects")
    .select("*")
    .eq("program_id", id);

  const { data: syllabus } = await supabase
    .from("course_syllabus")
    .select("*")
    .eq("program_id", id);

  const { data: topics } = await supabase
    .from("course_topics")
    .select("*");

  const { data: faqs } = await supabase
    .from("course_faqs")
    .select("*")
    .eq("program_id", id);

  const { data: reviews } = await supabase
    .from("course_reviews")
    .select("*")
    .eq("program_id", id);

  return NextResponse.json({
    details,
    learning,
    careers,
    projects,
    syllabus,
    topics,
    faqs,
    reviews,
  });
}