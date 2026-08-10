"use client";

import {
  Globe,
  ShoppingCart,
  LayoutDashboard,
  UserCircle,
} from "lucide-react";

interface Props {
  course: any;
}

const icons = [
  Globe,
  ShoppingCart,
  LayoutDashboard,
  UserCircle,
];

export default function Projects({ course }: Props) {
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
        Live Projects
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
        Practice with real-world projects during the internship.
      </p>

      {/* Project Cards */}

      <div className="mt-6 grid gap-5 md:grid-cols-2">

        {course.projects?.map((item: any, index: number) => {

          const Icon = icons[index % icons.length];

          return (

            <div
              key={item.id}
              className="
                group

                rounded-2xl

                border
                border-[#798321]/15
                dark:border-gray-700

                bg-white
                dark:bg-[#1E293B]

                p-6

                transition-all
                duration-300

                hover:-translate-y-1
                hover:border-[#798321]/40
                dark:hover:border-[#FFC107]/40

                hover:shadow-lg
              "
            >

              {/* Icon */}

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center

                  rounded-xl

                  bg-[#F8FAF1]
                  dark:bg-[#0F172A]

                  transition-all
                  duration-300

                  group-hover:bg-[#798321]/10
                  dark:group-hover:bg-[#FFC107]/10
                "
              >

                <Icon
                  size={22}
                  className="
                    text-[#798321]
                    dark:text-[#FFC107]
                  "
                />

              </div>

              {/* Project Name */}

              <h3
                className="
                  mt-4
                  text-base
                  font-bold

                  text-[#5F6E1D]
                  dark:text-white
                "
              >
                {item.project_name}
              </h3>

              {/* Description */}

              <p
                className="
                  mt-2

                  text-sm
                  leading-7
                  font-medium

                  text-[#4B5563]
                  dark:text-gray-300
                "
              >
                Build this project as part of the internship using
                modern technologies and industry best practices.
              </p>

            </div>

          );

        })}

      </div>

    </div>
  );
}