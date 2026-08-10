"use client";

import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

type Props = {
  icon: any;
  number: number;
  suffix: string;
  title: string;
  color: string;
};

export default function StatCard({
  icon: Icon,
  number,
  suffix,
  title,
}: Props) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.4,
  });

  return (
    <div
      ref={ref}
      className="
        h-[140px]
        px-4
        py-4
        flex
        flex-col
        items-center
        justify-center
        text-center
        rounded-xl
        border
        border-zinc-100
        bg-white
        shadow-md
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl

        dark:border-neutral-800
        dark:bg-[#0a0a0a]
        dark:hover:bg-[#171717]
        dark:hover:border-[#798321]/40
        dark:hover:shadow-[0_10px_35px_rgba(0,0,0,0.35)]
      "
    >
      {/* Icon */}
      <div
        className="
          mb-2
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-[#798321]/10
          dark:bg-[#798321]/20
        "
      >
        <Icon
          className="
            h-5
            w-5
            text-[#798321]
            dark:text-[#FFC107]
          "
        />
      </div>

      {/* Number */}
      <h2
        className="
          text-3xl
          font-extrabold
          leading-none
          text-[#FFC107]
        "
      >
        {inView ? (
          <CountUp
            end={number}
            duration={2.5}
            separator=","
          />
        ) : (
          0
        )}
        {suffix}
      </h2>

      {/* Title */}
      <p
        className="
          mt-2
          text-sm
          font-medium
          text-zinc-600
          dark:text-neutral-300
        "
      >
        {title}
      </p>
    </div>
  );
}