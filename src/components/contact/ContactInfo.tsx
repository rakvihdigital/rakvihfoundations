"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";

import {
  FaInstagram,
  FaLinkedinIn,
  FaFacebookF,
} from "react-icons/fa";

export default function ContactInfo() {
  return (
    <div>

      {/* Heading */}

      <p className="text-[11px] font-bold uppercase tracking-[4px] text-[#FFC107]">
        Contact Information
      </p>

      <h2 className="mt-2 text-4xl font-black tracking-tight text-[#798321] dark:text-white">
        Reach Us
      </h2>

      <p className="mt-3 text-sm font-medium leading-7 text-[#374151] dark:text-neutral-300">
        Contact our team for internships, training programs,
        certifications and placement assistance.
      </p>

      <div className="mt-8 space-y-5">

        {/* Phone */}

        <div className="flex items-start gap-4 rounded-2xl border border-[#798321]/15 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] p-5 shadow-[0_4px_20px_rgba(95,110,29,0.02)] transition-all duration-300 hover:border-[#798321]/40 dark:hover:border-[#FFC107] hover:shadow-md">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8FAF1] dark:bg-[#171717]">
            <Phone className="text-[#798321] dark:text-[#FFC107]" size={22} />
          </div>

          <div>

            <h3 className="text-base font-bold text-[#5F6E1D] dark:text-white">
              Phone
            </h3>

            <a
              href="tel:+918296392047"
              className="mt-1 block text-sm font-semibold text-[#6B7280] dark:text-neutral-300 transition-colors duration-300 hover:text-[#798321] dark:hover:text-[#FFC107]"
            >
              +91 82963 92047
            </a>

          </div>

        </div>

        {/* Email */}

        <div className="flex items-start gap-4 rounded-2xl border border-[#798321]/15 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] p-5 shadow-[0_4px_20px_rgba(95,110,29,0.02)] transition-all duration-300 hover:border-[#798321]/40 dark:hover:border-[#FFC107] hover:shadow-md">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8FAF1] dark:bg-[#171717]">
            <Mail className="text-[#798321] dark:text-[#FFC107]" size={22} />
          </div>

          <div>

            <h3 className="text-base font-bold text-[#5F6E1D] dark:text-white">
              Email
            </h3>

            <a
              href="mailto:office@rakvih.in"
              className="mt-1 block text-sm font-semibold text-[#6B7280] dark:text-neutral-300 transition-colors duration-300 hover:text-[#798321] dark:hover:text-[#FFC107]"
            >
              office@rakvih.in
            </a>

          </div>

        </div>

        {/* Address */}

        <div className="flex items-start gap-4 rounded-2xl border border-[#798321]/15 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] p-5 shadow-[0_4px_20px_rgba(95,110,29,0.02)] transition-all duration-300 hover:border-[#798321]/40 dark:hover:border-[#FFC107] hover:shadow-md">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8FAF1] dark:bg-[#171717]">
            <MapPin className="text-[#798321] dark:text-[#FFC107]" size={22} />
          </div>

          <div>

            <h3 className="text-base font-bold text-[#5F6E1D] dark:text-white">
              Address
            </h3>

            <p className="mt-1 text-sm font-medium leading-7 text-[#6B7280] dark:text-neutral-300">
             238, 2nd Main, 2nd Cross,
Attur Layout, Yelahanka,
Bengaluru, Karnataka 560064
            </p>

          </div>

        </div>

        {/* Working Hours */}

        <div className="flex items-start gap-4 rounded-2xl border border-[#798321]/15 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] p-5 shadow-[0_4px_20px_rgba(95,110,29,0.02)] transition-all duration-300 hover:border-[#798321]/40 dark:hover:border-[#FFC107] hover:shadow-md">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8FAF1] dark:bg-[#171717]">
            <Clock className="text-[#798321] dark:text-[#FFC107]" size={22} />
          </div>

          <div>

            <h3 className="text-base font-bold text-[#5F6E1D] dark:text-white">
              Working Hours
            </h3>

            <p className="mt-1 text-sm font-medium text-[#6B7280] dark:text-neutral-300">
              Monday - Saturday
            </p>

            <p className="text-sm font-semibold text-[#798321] dark:text-[#FFC107]">
              9:00 AM - 6:00 PM
            </p>

          </div>

        </div>

      </div>

      {/* Social Media */}

      <div className="mt-8">

        <h3 className="mb-4 text-base font-bold text-[#5F6E1D] dark:text-white">
          Follow Us
        </h3>

        <div className="flex gap-3">

          <Link
            href="https://www.instagram.com/rakvih_solutions_pvt_ltd/"
            target="_blank"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#798321] dark:bg-[#FFC107] text-[#FFC107] dark:text-black shadow-sm transition-all duration-300 hover:scale-110 hover:bg-[#5F6E1D] hover:text-white dark:hover:bg-[#ffca28]"
          >
            <FaInstagram size={18} />
          </Link>

          <Link
            href="https://www.linkedin.com/company/rakvih-solutions-pvt-ltd/"
            target="_blank"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#798321] dark:bg-[#FFC107] text-[#FFC107] dark:text-black shadow-sm transition-all duration-300 hover:scale-110 hover:bg-[#5F6E1D] hover:text-white dark:hover:bg-[#ffca28]"
          >
            <FaLinkedinIn size={18} />
          </Link>

          <Link
            href="https://www.facebook.com/p/Rakvih-solutions-Private-limited-61575970032881/"
            target="_blank"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#798321] dark:bg-[#FFC107] text-[#FFC107] dark:text-black shadow-sm transition-all duration-300 hover:scale-110 hover:bg-[#5F6E1D] hover:text-white dark:hover:bg-[#ffca28]"
          >
            <FaFacebookF size={16} />
          </Link>

        </div>

      </div>

    </div>
  );
}