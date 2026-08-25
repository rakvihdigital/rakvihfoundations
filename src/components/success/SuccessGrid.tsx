import SuccessCard from "./SuccessCard";
import SuccessStoryForm from "./SuccessStoryForm";

interface Props {
  stories: any[];
}

export default function SuccessGrid({ stories }: Props) {
  return (
   <section
  id="success-cards"
  className="
    relative
    overflow-hidden
    scroll-mt-24
    py-8
    md:py-10

    transition-all
    duration-500

    bg-[linear-gradient(135deg,#FFFFFF_0%,#EEF4DC_35%,#F8FAF1_70%,#FFFFFF_100%)]

    dark:bg-none
    dark:bg-black
  "
>
      {/* Background Glow */}

      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">

        <div
          className="
            absolute
            -top-24
            -right-24
            h-[550px]
            w-[550px]
            rounded-full
            bg-[#798321]/10
            dark:bg-[#798321]/20
            blur-[140px]
          "
        />

        <div
          className="
            absolute
            -bottom-20
            -left-20
            h-[500px]
            w-[500px]
            rounded-full
            bg-[#FFC107]/15
            dark:bg-[#FFC107]/10
            blur-[130px]
          "
        />

      </div>

      {/* Grid Pattern */}

      <div
        aria-hidden="true"
        className="
          absolute
          inset-0
          pointer-events-none
          opacity-[0.03]

          bg-[linear-gradient(to_right,#798321_1px,transparent_1px),linear-gradient(to_bottom,#798321_1px,transparent_1px)]
          bg-[size:34px_34px]
        "
        style={{
          maskImage:
            "radial-gradient(circle at center, black 70%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 70%, transparent 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1450px] px-4 sm:px-6">

        {/* Heading */}

        <div className="mb-8 text-center">

          <span
            className="
              inline-flex
              items-center
              rounded-full
              border
              border-[#798321]/20
              bg-[#798321]/10
              px-4
              py-1.5

              text-[10px]
              font-bold
              uppercase
              tracking-[2px]

              text-[#798321]

              dark:border-[#FFC107]/20
              dark:bg-[#FFC107]/10
              dark:text-[#FFC107]
            "
          >
            Real Students, Real Placements
          </span>

          <h2
            className="
              mt-3

              text-2xl
              md:text-3xl

              font-black

              text-[#5F6E1D]
              dark:text-white
            "
          >
            Featured Placements
          </h2>

          <p
            className="
              mx-auto
              mt-2

              max-w-2xl

              text-[13px]
              leading-6

              text-gray-600
              dark:text-neutral-300
            "
          >
            With a 98% placement rate, 10,000+ students trained, and 500+ hiring partners, these are outcomes you can verify — not marketing claims.
          </p>

        </div>
                {/* Content */}

        <div className="grid gap-6 xl:grid-cols-[1fr_360px] items-start">

          {/* Success Cards */}

          <div
            className="
              xl:h-[82vh]
              xl:overflow-y-auto
              scrollbar-hide
              xl:pr-2

              grid
              gap-5
              sm:grid-cols-2

              content-start
            "
          >

            {stories.length > 0 ? (

              stories.map((story) => (

                <SuccessCard
                  key={story.id}
                  story={story}
                />

              ))

            ) : (

              <div
                className="
                  col-span-full

                  rounded-3xl

                  border
                  border-dashed
                  border-[#798321]/20
                  dark:border-neutral-800

                  bg-white
                  dark:bg-[#0a0a0a]

                  py-16
                  px-8

                  text-center

                  shadow-lg
                "
              >

                <div
                  className="
                    mx-auto

                    flex
                    h-16
                    w-16

                    items-center
                    justify-center

                    rounded-full

                    bg-[#798321]/10
                    dark:bg-[#798321]/20

                    text-2xl
                  "
                >
                  🎓
                </div>

                <h3
                  className="
                    mt-5

                    text-xl
                    font-bold

                    text-[#5F6E1D]
                    dark:text-white
                  "
                >
                  No Success Stories Yet
                </h3>

                <p
                  className="
                    mx-auto
                    mt-3

                    max-w-sm

                    text-sm
                    leading-6

                    text-gray-500
                    dark:text-neutral-400
                  "
                >
                  Be the first student to share your journey and inspire
                  future learners.
                </p>

              </div>

            )}

          </div>
                    {/* Sticky Form */}

          <div
            className="
              xl:sticky
              xl:top-24
              self-start

              xl:h-[82vh]

              flex
              items-start
            "
          >
            <SuccessStoryForm />
          </div>

        </div>

      </div>

    </section>
  );
}