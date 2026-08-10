import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

console.log("ADMIN PROGRAM API WORKING");

// =======================
// GET ALL PROGRAMS
// =======================


export async function GET() {
  try {
    const { data: programs, error } = await supabase
      .from("programs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    for (const program of programs || []) {
      const { count, error: countError } = await supabase
        .from("enrollments")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("program_id", program.id);

      if (countError) {
        console.error(countError);
      }

      (program as any).enrollmentCount = count || 0;
    }

    return NextResponse.json(programs);
  } catch (error) {
    console.error(error);

    return NextResponse.json([], {
      status: 500,
    });
  }
}

// =======================
// ADD PROGRAM
// =======================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { courseDetails } = body;

    const slug = body.title
  .toLowerCase()
  .trim()
  .replace(/\s+/g, "-")
  .replace(/[^\w-]+/g, "");

const { data: program, error } = await supabase
  .from("programs")
.insert({
  title: body.title,
  slug: body.title.toLowerCase().replace(/\s+/g, "-"),
  category: body.category,
  description: body.description,
  duration: body.duration,
  price: Number(body.price),
  students: body.students,
  image: body.image,
  status: body.status, // ✅ Add this
})
  .select()
  .single();

    if (error) {
      throw error;
    }

    await supabase.from("course_details").insert({
  program_id: program.id,
  overview: courseDetails.overview,
  level: courseDetails.level,
  language: courseDetails.language,
  certificate: courseDetails.certificate,
  mentor: courseDetails.mentor,
  rating: Number(courseDetails.rating),
  reviews: Number(courseDetails.reviews),
});

return NextResponse.json({
  success: true,
  program,
});
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to add program",
      },
      {
        status: 500,
      }
    );
  }
}