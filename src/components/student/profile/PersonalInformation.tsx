"use client";

import {
  User,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  VenusAndMars,
} from "lucide-react";

interface Props {
  student: any;
}

export default function PersonalInformation({
  student,
}: Props) {
  const fields = [
    {
      label: "Full Name",
      value: student?.full_name || "-",
      icon: User,
    },
    {
      label: "Email",
      value: student?.email || "-",
      icon: Mail,
    },
    {
      label: "Phone",
      value: student?.phone || "-",
      icon: Phone,
    },
    {
      label: "Gender",
      value: student?.gender || "-",
      icon: VenusAndMars,
    },
    {
      label: "Date of Birth",
      value: student?.dob || "-",
      icon: CalendarDays,
    },
    {
      label: "Address",
      value: student?.address || "-",
      icon: MapPin,
    },
  ];

  return (
    <div
      className="
        rounded-xl
        border
        border-[#EEF2E8]
        dark:border-neutral-800
        bg-white
        dark:bg-[#0a0a0a]
        p-4
        transition-colors
        duration-300
      "
    >
      {/* Header */}
      <div className="mb-4">

        <h2 className="text-sm font-bold text-[#24310F] dark:text-white">
          Personal Information
        </h2>

        <p className="text-[10px] text-gray-500 dark:text-neutral-400">
          Your personal details
        </p>

      </div>

      {/* Fields */}
      <div className="space-y-3">

        {fields.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="
                flex
                items-center
                gap-3
                rounded-lg
                border
                border-[#EEF2E8]
                dark:border-neutral-800
                bg-white
                dark:bg-[#171717]/50
                p-3
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#EEF6D8]
                  dark:bg-neutral-900
                "
              >
                <Icon
                  size={16}
                  className="text-[#6B7328] dark:text-[#FFC107]"
                />
              </div>

              <div className="flex-1">

                <p className="text-[10px] text-gray-500 dark:text-neutral-400">
                  {item.label}
                </p>

                <h3 className="text-sm font-semibold text-[#24310F] dark:text-white break-all">
                  {item.value}
                </h3>

              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}