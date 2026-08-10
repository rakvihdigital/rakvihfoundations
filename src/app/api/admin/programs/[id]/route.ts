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
  try {
    const { id } = await params;

    const { data: program, error } = await supabase
      .from("programs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

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

    const syllabusIds = syllabus?.map((s) => s.id) || [];

    const { data: topics } = await supabase
      .from("course_topics")
      .select("*")
      .in("syllabus_id", syllabusIds);

    const { data: faqs } = await supabase
      .from("course_faqs")
      .select("*")
      .eq("program_id", id);

    const { data: reviews } = await supabase
      .from("course_reviews")
      .select("*")
      .eq("program_id", id);

    return NextResponse.json({
      ...program,
      courseDetails: details,
      learning,
      careers,
      projects,
      syllabus,
      topics,
      faqs,
      reviews,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
} 

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;

    const { error } = await supabase
      .from("programs")
      .update({
  title: body.title,
  category: body.category,
  description: body.description,
  duration: body.duration,
  price: Number(body.price),
  students: body.students,
  image: body.image,
  status: body.status,
})
      .eq("id", id);



      // =======================
// UPDATE COURSE DETAILS
// =======================

await supabase
  .from("course_details")
  .update({
    overview: body.courseDetails.overview,
    level: body.courseDetails.level,
    language: body.courseDetails.language,
    mentor: body.courseDetails.mentor,
    certificate: body.courseDetails.certificate,
    rating: Number(body.courseDetails.rating),
    reviews: Number(body.courseDetails.reviews),
  })
  .eq("program_id", id);

// =======================
// LEARNING
// =======================

await supabase
  .from("course_learning")
  .delete()
  .eq("program_id", id);

if (body.learning?.length) {
  await supabase.from("course_learning").insert(
    body.learning.map((item: any) => ({
      program_id: Number(id),
      title: item.title,
    }))
  );
}

// =======================
// CAREERS
// =======================

await supabase
  .from("course_careers")
  .delete()
  .eq("program_id", id);

if (body.careers?.length) {
  await supabase.from("course_careers").insert(
    body.careers.map((item: any) => ({
      program_id: Number(id),
      title: item.title,
    }))
  );
}

// =======================
// PROJECTS
// =======================

await supabase
  .from("course_projects")
  .delete()
  .eq("program_id", id);

if (body.projects?.length) {
  await supabase.from("course_projects").insert(
    body.projects.map((item: any) => ({
      program_id: Number(id),
      project_name: item.project_name,
    }))
  );
}

// =======================
// FAQS
// =======================

await supabase
  .from("course_faqs")
  .delete()
  .eq("program_id", id);

if (body.faqs?.length) {
  await supabase.from("course_faqs").insert(
    body.faqs.map((item: any) => ({
      program_id: Number(id),
      question: item.question,
      answer: item.answer,
    }))
  );
}

// =======================
// REVIEWS
// =======================

await supabase
  .from("course_reviews")
  .delete()
  .eq("program_id", id);

if (body.reviews?.length) {
  await supabase.from("course_reviews").insert(
    body.reviews.map((item: any) => ({
      program_id: Number(id),
      student_name: item.student_name,
      rating: Number(item.rating),
      review: item.review,
    }))
  );
}

// =======================
// SYLLABUS + TOPICS
// =======================

await supabase
  .from("course_topics")
  .delete()
  .in(
    "syllabus_id",
    (
      await supabase
        .from("course_syllabus")
        .select("id")
        .eq("program_id", id)
    ).data?.map((x) => x.id) || []
  );

await supabase
  .from("course_syllabus")
  .delete()
  .eq("program_id", id);

if (body.syllabus?.length) {
  for (let i = 0; i < body.syllabus.length; i++) {
    const module = body.syllabus[i];

    const { data: newModule } = await supabase
      .from("course_syllabus")
      .insert({
        program_id: Number(id),
        module_name: module.module_name,
        content: module.content,
      })
      .select()
      .single();

    const moduleTopics = body.topics.filter(
      (t: any) => t.moduleIndex === i
    );

    if (moduleTopics.length) {
      await supabase.from("course_topics").insert(
        moduleTopics.map((topic: any) => ({
          syllabus_id: newModule.id,
          topic: topic.topic,
        }))
      );
    }
  }
}

    if (error) throw error;

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from("programs")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}