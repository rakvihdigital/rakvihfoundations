import { createClient } from "@/lib/supabase/client";

interface UploadCertificateProps {
  pdfBytes: Uint8Array;
  fileName: string;
}

export async function uploadCertificate({
  pdfBytes,
  fileName,
}: UploadCertificateProps) {
  const supabase = createClient();

  const { error } = await supabase.storage
    .from("certificates")
    .upload(fileName, pdfBytes, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from("certificates")
    .getPublicUrl(fileName);

  return data.publicUrl;
}