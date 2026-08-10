import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("certificates")
    .select(`
      *,
      enrollments(
        id,
        full_name,
        email
      ),
      programs(
        id,
        title
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const supabase = await createClient();

  const body = await req.json();

  const {
    enrollment_id,
    program_id,
    title,
    certificate_number,
    certificate_url,
    issue_date,
    status,
  } = body;

  const { data, error } = await supabase
    .from("certificates")
    .insert({
      enrollment_id,
      program_id,
      title,
      certificate_number,
      certificate_url,
      issue_date,
      status,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}