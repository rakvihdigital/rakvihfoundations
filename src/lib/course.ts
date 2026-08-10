import { createClient } from "@/lib/supabase/client";

export async function getCourse(id: string){
  // Debug: show all programs
  const supabase = await createClient();
  const { data: programs } = await supabase
    .from("programs")
    .select("*");

  console.log("All Programs:", programs);

  // Fetch selected program
  
const { data: program, error } = await supabase
  .from("programs")
  .select("*")
  .eq("id", Number(id))
  .maybeSingle();

console.log("Program:", program);

if (error || !program) {
  return null;
}

  // Course Details
  const { data: details } = await supabase
    .from("course_details")
    .select("*")
    .eq("program_id", program.id)
    .maybeSingle();

  console.log("Details:", details);

  // Learning
  const { data: learning } = await supabase
    .from("course_learning")
    .select("*")
    .eq("program_id", program.id);

  console.log("Learning:", learning);

  // Careers
  const { data: careers } = await supabase
    .from("course_careers")
    .select("*")
    .eq("program_id", program.id);

  console.log("Careers:", careers);

  // Syllabus
  const { data: syllabus } = await supabase
    .from("course_syllabus")
    .select("*")
    .eq("program_id", program.id)
    .order("id");

  if (syllabus) {
    for (const module of syllabus) {
      const { data: topics } = await supabase
        .from("course_topics")
        .select("*")
        .eq("syllabus_id", module.id);

      module.topics = topics || [];
    }
  }

  console.log("Syllabus:", syllabus);

  // Projects
  const { data: projects } = await supabase
    .from("course_projects")
    .select("*")
    .eq("program_id", program.id);

  console.log("Projects:", projects);

  // FAQs
  const { data: faqs } = await supabase
    .from("course_faqs")
    .select("*")
    .eq("program_id", program.id);

  console.log("FAQs:", faqs);

  // Reviews
  const { data: reviews } = await supabase
    .from("course_reviews")
    .select("*")
    .eq("program_id", program.id);

  console.log("Reviews:", reviews);

  return {
    program,
    details,
    learning,
    careers,
    syllabus,
    projects,
    faqs,
    reviews,
  };
}