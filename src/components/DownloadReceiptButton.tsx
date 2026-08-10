"use client";

import { pdf } from "@react-pdf/renderer";
import ReceiptPDF from "./ReceiptPDF";
import { Receipt } from "lucide-react";
import { useState } from "react";

export default function DownloadReceiptButton({
  enrollment,
  payment,
  program,
}: any) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);

    const blob = await pdf(
      <ReceiptPDF
        enrollment={enrollment}
        payment={payment}
        program={program}
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Receipt-${payment.transaction_id}.pdf`;
    link.click();

    URL.revokeObjectURL(url);

    setLoading(false);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#7a8b22] to-[#ffc107] py-3 px-6 text-white font-bold"
    >
      <Receipt size={18} />
      {loading ? "Generating PDF..." : "Download Receipt"}
    </button>
  );
}