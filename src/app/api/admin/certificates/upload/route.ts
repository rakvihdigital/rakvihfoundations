import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file selected." },
        { status: 400 }
      );
    }

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("certificates")
      .upload(fileName, file, {
        upsert: true,
      });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const { data } = supabase.storage
      .from("certificates")
      .getPublicUrl(fileName);

    return NextResponse.json({
      url: data.publicUrl,
      fileName,
    });
  } catch {
    return NextResponse.json(
      { error: "Upload failed." },
      { status: 500 }
    );
  }
}