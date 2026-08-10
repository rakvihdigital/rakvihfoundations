"use client";

import { faqs } from "./FAQData";
import FAQItem from "./FAQItem";

export default function FAQSection() {
  return (
    <section
      className="
        bg-white
        dark:bg-black

        py-20

        transition-all
        duration-500
      "
    >

<div className="mx-auto max-w-7xl px-6">
        {/* Heading */}

        <div className="mb-12 text-center">

          <p
            className="
              text-[11px]
              font-bold
              uppercase
              tracking-[4px]

              text-[#FFC107]
            "
          >
            Frequently Asked
          </p>

          <h2
            className="
              mt-2

              text-3xl
              md:text-4xl

              font-black

              tracking-tight

              text-[#798321]
              dark:text-white
            "
          >
            Questions & Answers
          </h2>

          <p
            className="
              mx-auto
              mt-3
              max-w-2xl

              text-[13px]
              leading-6
              font-medium

              text-[#374151]
              dark:text-neutral-300
            "
          >
            Find answers to the most common questions about internships,
            certificates, placements and enrollment.
          </p>

        </div>

    {/* FAQ List */}

<div className="grid lg:grid-cols-2 gap-x-4 gap-y-5 items-start">
  {/* Left Column */}
<div className="space-y-5 w-full">    {faqs.slice(0, 4).map((faq) => (
      <FAQItem
        key={faq.id}
        question={faq.question}
        answer={faq.answer}
      />
    ))}
  </div>

  {/* Right Column */}
  <div className="space-y-5">
    {faqs.slice(4).map((faq) => (
      <FAQItem
        key={faq.id}
        question={faq.question}
        answer={faq.answer}
      />
    ))}
  </div>

</div>

      </div>

    </section>
  );
}