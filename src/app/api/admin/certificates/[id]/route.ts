import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  req: NextRequest,
  { params }: Params
) {
  const { id } = await params;

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
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}

export async function PUT(
  req: NextRequest,
  { params }: Params
) {
  const { id } = await params;

  const body = await req.json();

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("certificates")
    .update(body)
    .eq("id", id)
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

export async function DELETE(
  req: NextRequest,
  { params }: Params
) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: certificate } = await supabase
    .from("certificates")
    .select("certificate_url")
    .eq("id", id)
    .single();

  if (certificate?.certificate_url) {
    const fileName = certificate.certificate_url
      .split("/")
      .pop();

    if (fileName) {
      await supabase.storage
        .from("certificates")
        .remove([fileName]);
    }
  }

  const { error } = await supabase
    .from("certificates")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}