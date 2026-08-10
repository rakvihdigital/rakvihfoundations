"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      className="
        relative
        overflow-hidden
        bg-white
        dark:bg-black
        pt-16
        pb-8
        transition-all
        duration-500
      "
    >
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_70%_20%,rgba(121,131,33,0.03)_0%,transparent_60%)] dark:bg-[radial-gradient(circle_at_70%_20%,rgba(255,193,7,0.08)_0%,transparent_60%)]" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.05] bg-[linear-gradient(to_right,#798321_1px,transparent_1px),linear-gradient(to_bottom,#798321_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Top Divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#798321]/20 to-transparent dark:via-[#FFC107]/20" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* ================= Company ================= */}

          <div>
            <Link href="/" className="group inline-flex items-center">
              {/* Logo */}
              <div className="relative h-[96px] w-[96px] shrink-0">
                {/* Light Logo */}
                <Image
                  src="/images/logo.png"
                  alt="RAKVIH Logo"
                  fill
                  priority
                  className="
                    block
                    dark:hidden
                    object-contain
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  "
                />

                {/* Dark Logo */}
                <Image
                  src="/images/logo-dark.png"
                  alt="RAKVIH Logo"
                  fill
                  priority
                  className="
                    hidden
                    dark:block
                    object-contain
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  "
                />
              </div>

              {/* Company Text */}
              <div className="-ml-4 flex flex-col justify-center">
                <h2
                  className="
                    text-[18px]
                    font-black
                    tracking-[0.20em]
                    leading-none
                    text-[#798321]
                    dark:text-[#A8B63A]
                  "
                >
                  RAKVIH
                </h2>

                <p
                  className="
                    mt-[3px]
                    text-[6px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    leading-none
                    text-[#798321]/70
                    dark:text-white/80
                  "
                >
                  SOLUTIONS PRIVATE LIMITED
                </p>
              </div>
            </Link>

            {/* Description */}

            <p
              className="
                mt-5
                text-sm
                leading-7
                text-neutral-600
                dark:text-neutral-300
              "
            >
              Empowering students through industry-focused internship programs,
              expert mentorship, certifications and career opportunities.
            </p>

            {/* Social Icons */}

            <div className="mt-6 flex gap-3">
              {[FaFacebookF, FaInstagram, FaLinkedinIn].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full

                    border
                    border-[#798321]/20
                    dark:border-neutral-800

                    bg-[#EEF4DC]
                    dark:bg-[#111111]

                    text-[#798321]
                    dark:text-[#FFC107]

                    transition-all
                    duration-300

                    hover:bg-[#798321]
                    hover:text-white

                    dark:hover:bg-[#FFC107]
                    dark:hover:text-black
                  "
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
          
          {/* ================= Quick Links ================= */}

          <div>
            <h3
              className="
                text-lg
                font-bold
                text-[#798321]
                dark:text-white
              "
            >
              Quick Links
            </h3>

            <div className="mt-2 mb-5 h-[3px] w-12 rounded-full bg-[#FFC107]" />

            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Programs", href: "/programs" },
                { name: "Success Stories", href: "/success-stories" },
                { name: "FAQ", href: "/faq" },
                { name: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="
                      text-sm
                      text-neutral-600
                      dark:text-neutral-300

                      transition-all
                      duration-300

                      hover:translate-x-1
                      hover:text-[#798321]

                      dark:hover:text-[#FFC107]
                    "
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ================= Programs ================= */}

          <div>
            <h3
              className="
                text-lg
                font-bold
                text-[#798321]
                dark:text-white
              "
            >
              Popular Programs
            </h3>

            <div className="mt-2 mb-5 h-[3px] w-12 rounded-full bg-[#FFC107]" />

            <ul className="space-y-3">
              {[
                "Web Development",
                "Full Stack Development",
                "AI & Machine Learning",
                "Data Science",
                "Cloud Computing",
                "Cyber Security",
              ].map((program) => (
                <li key={program}>
                  <Link
                    href="/programs"
                    className="
                      text-sm
                      text-neutral-600
                      dark:text-neutral-300

                      transition-all
                      duration-300

                      hover:translate-x-1
                      hover:text-[#798321]

                      dark:hover:text-[#FFC107]
                    "
                  >
                    {program}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* ================= Contact ================= */}

          <div>
            <h3
              className="
                text-lg
                font-bold
                text-[#798321]
                dark:text-white
              "
            >
              Contact Us
            </h3>

            <div className="mt-2 mb-5 h-[3px] w-12 rounded-full bg-[#FFC107]" />

            <div className="space-y-5">
              {/* Phone */}
              <div className="flex items-start gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-[#EEF4DC]
                    dark:bg-[#111111]
                    text-[#798321]
                    dark:text-[#FFC107]
                  "
                >
                  <Phone size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                    +91 82963 92047
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Mon - Sat (9:00 AM - 6:00 PM)
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-[#EEF4DC]
                    dark:bg-[#111111]
                    text-[#798321]
                    dark:text-[#FFC107]
                  "
                >
                  <Mail size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                    info@rakvihfoundation.com
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Email Support
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-[#EEF4DC]
                    dark:bg-[#111111]
                    text-[#798321]
                    dark:text-[#FFC107]
                  "
                >
                  <MapPin size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                    238, 2nd Main, 2nd Cross,
                    <br />
                    Attur Layout, Yelahanka,
                    <br />
                    Bengaluru, Karnataka 560064
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= Bottom ================= */}

        <div
          className="
            mt-14
            border-t
            border-[#798321]/15
            dark:border-neutral-800
            pt-6
          "
        >
          <div
            className="
              flex
              flex-col
              items-center
              justify-between
              gap-4

              lg:flex-row
            "
          >
            {/* Left */}
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              © 2026{" "}
              <span className="font-semibold">
                RAKVIH Solutions Private Limited
              </span>
              . All Rights Reserved.
            </p>

            {/* Center */}
            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/terms"
                className="
                  text-neutral-600
                  dark:text-neutral-400
                  hover:text-[#798321]
                  dark:hover:text-[#FFC107]
                  transition
                "
              >
                Terms & Conditions
              </Link>

              <span className="text-neutral-300 dark:text-neutral-700">|</span>

              <Link
                href="/privacy-policy"
                className="
                  text-neutral-600
                  dark:text-neutral-400
                  hover:text-[#798321]
                  dark:hover:text-[#FFC107]
                  transition
                "
              >
                Privacy Policy
              </Link>
            </div>

            {/* Right */}
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Designed & Developed by{" "}
              <a
                href="https://rakvih.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  font-semibold
                  text-[#798321]
                  dark:text-[#FFC107]
                  hover:text-[#FFC107]
                  hover:underline
                  transition-all
                  duration-300
                  cursor-pointer
                "
              >
                RAKVIH
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}