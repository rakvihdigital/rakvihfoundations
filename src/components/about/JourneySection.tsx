"use client";

import { motion } from "framer-motion";
import { journey } from "./journeyData";

export default function JourneySection() {
  return (
    <section
      className="
        relative
        overflow-hidden
        py-20
        transition-all
        duration-500

        bg-[linear-gradient(135deg,#FFFFFF_0%,#EEF4DC_40%,#F8FAF1_70%,#FFFFFF_100%)]

        dark:bg-none
        dark:bg-black
      "
    >

      {/* Background Glow */}

      <div className="absolute inset-0 pointer-events-none">

        <div
          className="
            absolute
            top-1/4
            right-5
            h-[500px]
            w-[500px]
            rounded-full

            bg-[#5F6E1D]/5
            dark:bg-[#798321]/15

            blur-[130px]
          "
        />

        <div
          className="
            absolute
            bottom-1/4
            left-5
            h-[450px]
            w-[450px]
            rounded-full

            bg-[#FFE082]/25
            dark:bg-[#FFC107]/10

            blur-[110px]
          "
        />

      </div>

      {/* Grid */}

      <div
        className="
          absolute
          inset-0
          pointer-events-none
          opacity-[0.03]

          bg-[linear-gradient(to_right,#798321_1px,transparent_1px),linear-gradient(to_bottom,#798321_1px,transparent_1px)]
          bg-[size:32px_32px]
        "
        style={{
          maskImage:
            "radial-gradient(circle at center, black 70%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 70%, transparent 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6">

        {/* Heading */}

        <div className="mb-16 text-center">

          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[5px]

              text-[#FFC107]
            "
          >
            Timeline
          </p>

          <h2
            className="
              mt-2
              text-4xl
              md:text-5xl

              font-black
              tracking-tight

              text-[#798321]
              dark:text-white
            "
          >
            Our Journey
          </h2>

        </div>

        <div className="relative">

          {/* Vertical Line */}

          <div
            className="
              absolute
              left-5
              md:left-9
              top-0

              h-[calc(100%-120px)]
              w-[2px]

              bg-[#FFC107]/40
              dark:bg-[#FFC107]/30
            "
          />

          {journey.map((item, index) => (

            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 60,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.7,
                delay: index * 0.25,
              }}
              className="relative mb-14 flex items-start gap-6"
            >

              {/* Year */}

              <div
                className="
                  z-10

                  flex
                  h-10
                  w-10

                  md:h-16
                  md:w-16

                  items-center
                  justify-center

                  rounded-full

                  bg-[#FFC107]

                  text-[#798321]

                  text-xs
                  md:text-lg

                  font-black

                  shadow-[0_4px_12px_rgba(255,193,7,0.3)]
                "
              >
                {item.year}
              </div>
                            {/* Timeline Card */}

              <div
                className="
                  group

                  flex-1

                  rounded-[22px]

                  border
                  border-[#798321]/20
                  dark:border-neutral-800

                  bg-white
                  dark:bg-[#0a0a0a]

                  p-6

                  shadow-[0_4px_20px_rgba(95,110,29,0.04)]

                  transition-all
                  duration-300

                  hover:-translate-y-1
                  hover:border-[#798321]
                  dark:hover:border-[#FFC107]

                  hover:bg-[#EEF4DC]
                  dark:hover:bg-[#171717]

                  hover:shadow-[0_10px_25px_rgba(121,131,33,0.12)]
                "
              >

                {/* Title */}

                <h3
                  className="
                    text-xl
                    font-bold

                    text-[#5F6E1D]
                    dark:text-white
                  "
                >
                  {item.title}
                </h3>

                {/* Description */}

                <p
                  className="
                    mt-3

                    text-sm
                    leading-7
                    font-medium

                    text-[#374151]
                    dark:text-gray-300
                  "
                >
                  {item.description}
                </p>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}