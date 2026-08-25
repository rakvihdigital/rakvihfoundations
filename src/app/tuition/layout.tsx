// src/app/tuition/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Tuition & Online Tutors in Bangalore | Verified Teachers RAKVIH",
  description: "Find a verified home tutor or online teacher in Bangalore in 24 hours. Transparent fees, flexible scheduling, and 100% screened educators. Apply for tuition or become a RAKVIH teacher today.",
};

export default function TuitionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}