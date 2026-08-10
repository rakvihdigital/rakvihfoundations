"use client";

import { MapPin } from "lucide-react";

export default function ContactMap() {
  return (
    <section
      className="
        bg-white
        dark:bg-black

        pb-16

        transition-all
        duration-500
      "
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Map Container */}

        <div
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

            shadow-[0_12px_40px_rgba(95,110,29,0.04)]
          "
        >

          {/* Background Glow */}

          <div aria-hidden="true" className="absolute inset-0 pointer-events-none">

            <div
              className="
                absolute
                -top-12
                left-1/3

                h-72
                w-72

                rounded-full

                bg-[#FFC107]/15
                dark:bg-[#FFC107]/10

                blur-3xl
              "
            />

            <div
              className="
                absolute
                -bottom-12
                right-1/4

                h-64
                w-64

                rounded-full

                bg-[#798321]/10
                dark:bg-[#798321]/15

                blur-3xl
              "
            />

          </div>

          {/* Content */}

          <div
            className="
              relative
              z-10

              flex
              h-80
              flex-col
              items-center
              justify-center

              px-4

              text-center
            "
          >

            {/* Icon */}

            <div
              className="
                mb-4

                flex
                h-14
                w-14

                items-center
                justify-center

                rounded-2xl

                border
                border-[#798321]/10
                dark:border-neutral-800

                bg-white
                dark:bg-[#171717]

                shadow-md

                animate-bounce
              "
            >

              <MapPin
                size={32}
                className="
                  text-[#798321]
                  dark:text-[#FFC107]
                "
              />

            </div>

            {/* Title */}

            <h2
              className="
                text-2xl
                font-black
                tracking-tight

                text-[#798321]
                dark:text-white
              "
            >
              RAKVIH Solutions Private Limited
            </h2>

            {/* Address */}

            <p
              className="
                mt-2
                max-w-lg

                text-sm
                leading-7
                font-medium

                text-[#374151]
                dark:text-neutral-300
              "
            >
              238, 2nd Main Road,
              2nd Cross, Attur Layout,
              <br />
              Yelahanka,
              Bengaluru,
              Karnataka - 560064
            </p>

            {/* Button */}

            <a
              href="https://maps.google.com/?q=238+2nd+Main+Road+2nd+Cross+Attur+Layout+Yelahanka+Bengaluru+560064"
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-6

                rounded-xl

                bg-[#798321]
                dark:bg-[#FFC107]

                px-6
                py-3

                text-sm
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
              Open in Google Maps
            </a>

          </div>

        </div>

      </div>

    </section>
  );
}