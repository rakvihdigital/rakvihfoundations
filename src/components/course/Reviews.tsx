"use client";

import { Star } from "lucide-react";

interface Props {
  course: any;
}

export default function Reviews({ course }: Props) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-[#798321]/15
        dark:border-gray-700

        bg-white
        dark:bg-[#111827]

        p-6

        shadow-[0_4px_20px_rgba(95,110,29,0.04)]
        transition-all
        duration-500
      "
    >

      {/* Heading */}

      <h2
        className="
          text-xl
          font-black

          text-[#5F6E1D]
          dark:text-white
        "
      >
        Student Reviews
      </h2>

      {/* Subtitle */}

      <p
        className="
          mt-2
          text-sm
          font-medium

          text-[#6B7280]
          dark:text-gray-400
        "
      >
        Hear what our students say about this course.
      </p>

      {/* Reviews */}

      <div className="mt-6 space-y-5">

        {course.reviews && course.reviews.length > 0 ? (

          course.reviews.map((item: any) => (

            <div
              key={item.id}
              className="
                rounded-2xl

                border
                border-[#798321]/15
                dark:border-gray-700

                bg-[#F8FAF1]/40
                dark:bg-[#1E293B]

                p-6

                transition-all
                duration-300

                hover:border-[#798321]/40
                dark:hover:border-[#FFC107]/40

                hover:shadow-md
              "
            >

              {/* Rating */}

              <div className="mb-4 flex gap-1">

                {[...Array(item.rating || 5)].map((_, index) => (

                  <Star
                    key={index}
                    size={16}
                    className="fill-[#FFC107] text-[#FFC107]"
                  />

                ))}

              </div>

              {/* Review */}

              <p
                className="
                  text-sm
                  leading-7
                  font-medium
                  italic

                  text-[#4B5563]
                  dark:text-gray-300
                "
              >
                "{item.review}"
              </p>

              {/* Student */}

              <div className="mt-6 flex items-center gap-4">

                {/* Avatar */}

                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center

                    rounded-full

                    bg-[#798321]
                    dark:bg-[#FFC107]

                    font-bold

                    text-[#FFC107]
                    dark:text-[#0F172A]

                    shadow-sm
                  "
                >
                  {item.student_name
                    ? item.student_name.charAt(0).toUpperCase()
                    : "S"}
                </div>

                {/* Name */}

                <div>

                  <h3
                    className="
                      text-sm
                      font-bold

                      text-[#5F6E1D]
                      dark:text-white
                    "
                  >
                    {item.student_name}
                  </h3>

                  <p
                    className="
                      text-xs
                      font-semibold

                      text-[#6B7280]
                      dark:text-gray-400
                    "
                  >
                    {item.role}
                  </p>

                </div>

              </div>

            </div>

          ))

        ) : (

          <div
            className="
              rounded-2xl

              border
              border-dashed

              border-[#798321]/30
              dark:border-gray-700

              bg-white
              dark:bg-[#1E293B]

              py-12

              text-center
            "
          >

            <h3
              className="
                text-lg
                font-bold

                text-[#5F6E1D]
                dark:text-white
              "
            >
              No Reviews Yet
            </h3>

            <p
              className="
                mt-2
                text-sm

                text-[#6B7280]
                dark:text-gray-400
              "
            >
              Student reviews will appear here after learners complete
              the course.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}