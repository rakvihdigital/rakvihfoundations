"use client";

import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function FAQCTA() {
  return (
    <section
      className="
        bg-white
        dark:bg-black

        py-16

        transition-colors
        duration-500
      "
    >

      <div className="mx-auto max-w-5xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="
            relative
            overflow-hidden

            rounded-3xl

            border
            border-[#798321]/15
            dark:border-neutral-800

            bg-[linear-gradient(135deg,#FFFFFF_0%,#EEF4DC_50%,#F8FAF1_100%)]
            dark:bg-none
            dark:bg-[#0a0a0a]

            px-8
            py-12

            text-center

            shadow-[0_12px_40px_rgba(95,110,29,0.06)]
          "
        >

          {/* Background Glow */}

          <div aria-hidden="true" className="absolute inset-0 pointer-events-none">

            <div
              className="
                absolute
                -top-12
                -left-12

                h-64
                w-64

                rounded-full

                bg-[#FFC107]/20
                dark:bg-[#FFC107]/10

                blur-3xl
              "
            />

            <div
              className="
                absolute
                -bottom-12
                -right-12

                h-64
                w-64

                rounded-full

                bg-[#798321]/10
                dark:bg-[#798321]/15

                blur-3xl
              "
            />

          </div>

          {/* Icon */}

          <div
            className="
              relative
              z-10

              mx-auto

              flex
              h-14
              w-14

              items-center
              justify-center

              rounded-full

              bg-[#FFC107]

              shadow-md
            "
          >

            <MessageCircle
              size={28}
              className="
                text-[#798321]
                dark:text-black
              "
            />

          </div>

          {/* Heading */}

          <h2
            className="
              relative
              z-10

              mt-6

              text-3xl
              md:text-4xl

              font-black

              tracking-tight

              text-[#798321]
              dark:text-white
            "
          >
            Still Have Questions?
          </h2>

          {/* Description */}

          <p
            className="
              relative
              z-10

              mx-auto
              mt-4
              max-w-2xl

              text-[13px]
              leading-7
              font-medium

              text-[#374151]
              dark:text-neutral-300
            "
          >
            Our support team is ready to help you with internship
            details, registration, payments, certifications and
            career guidance.
          </p>

          {/* Buttons */}

          <div
            className="
              relative
              z-10

              mt-8

              flex
              flex-col
              items-center
              justify-center
              gap-4

              sm:flex-row
            "
          >

            <Link
              href="/contact"
              className="
                flex
                items-center
                gap-2

                rounded-xl

                bg-[#798321]
                dark:bg-[#FFC107]

                px-6
                py-3

                text-[13px]
                font-bold

                text-[#FFC107]
                dark:text-black

                shadow-sm

                transition-all
                duration-300

                hover:scale-105

                hover:bg-[#5F6E1D]
                hover:text-white

                dark:hover:bg-[#ffca28]
                dark:hover:text-black
              "
            >
              Contact Us
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/programs"
              className="
                rounded-xl

                border
                border-[#798321]/30
                dark:border-neutral-800

                bg-white/50
                dark:bg-[#171717]

                px-6
                py-3

                text-[13px]
                font-bold

                text-[#5F6E1D]
                dark:text-[#FFC107]

                transition-all
                duration-300

                hover:border-[#798321]
                hover:bg-[#798321]/5

                dark:hover:bg-[#262626]
              "
            >
              Explore Programs
            </Link>

          </div>

        </motion.div>

      </div>

    </section>
  );
}