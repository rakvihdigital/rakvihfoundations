"use client";

import { motion } from "framer-motion";
import {
  UserRound,
  FileText,
  BadgeCheck,
  CreditCard,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Personal Details",
    description:
      "Enter your basic details like name, email, phone and college.",
    icon: UserRound,
    color: "bg-[#798321]",
  },
  {
    id: "02",
    title: "Upload Documents",
    description:
      "Upload your photo, resume and required academic documents.",
    icon: FileText,
    color: "bg-[#FFC107]",
  },
  {
    id: "03",
    title: "Verification",
    description:
      "Our team verifies your application and confirms eligibility.",
    icon: BadgeCheck,
    color: "bg-[#798321]",
  },
  {
    id: "04",
    title: "Complete Payment",
    description:
      "Secure your internship seat by completing the enrollment fee.",
    icon: CreditCard,
    color: "bg-[#FFC107]",
  },
];

export default function ProcessCards() {
  return (
    <section className="relative z-10 py-16">

      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
          className="text-center"
        >
          <p className="text-xs font-bold uppercase tracking-[5px] text-[#FFC107]">
            Enrollment Process
          </p>

          <h2 className="mt-3 text-4xl font-black text-[#798321] dark:text-white">
            Just 4 Easy Steps
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            Complete your internship enrollment in just a few minutes.
            Follow these simple steps and begin your career journey.
          </p>
        </motion.div>

        {/* Cards */}

        <div className="mt-14 grid gap-8 lg:grid-cols-4">

          {steps.map((step, index) => {

            const Icon = step.icon;

            return (

              <div
                key={step.id}
                className="relative"
              >

                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * .15,
                    duration: .6,
                  }}
                  whileHover={{
                    y: -10,
                    scale: 1.03,
                  }}
                  className="
                    rounded-[32px]
                    bg-white
                    p-8
                    shadow-[0_25px_60px_rgba(121,131,33,.10)]
                    transition-all
                    dark:bg-[#111827]
                  "
                >

                  {/* Number */}

                  <div className="flex items-center justify-between">

                    <span className="text-5xl font-black text-[#798321]/15">
                      {step.id}
                    </span>

                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${step.color}`}
                    >
                      <Icon
                        size={26}
                        className="text-white"
                      />
                    </div>

                  </div>

                  {/* Title */}

                  <h3 className="mt-8 text-xl font-bold text-[#798321] dark:text-white">
                    {step.title}
                  </h3>

                  {/* Description */}

                  <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-300">
                    {step.description}
                  </p>

                </motion.div>

                {/* Arrow */}

                {index !== steps.length - 1 && (

                  <div className="absolute -right-6 top-1/2 hidden -translate-y-1/2 lg:flex">

                    <ArrowRight
                      size={34}
                      className="text-[#FFC107]"
                    />

                  </div>

                )}

              </div>

            );

          })}

        </div>

      </div>

    </section>
  );
}