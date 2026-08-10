"use client";

import { motion } from "framer-motion";

export default function BackgroundShapes() {
  return (
    <>
      {/* Main Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {/* White Background */}
        <div className="absolute inset-0 bg-[#F8FBF3] dark:bg-[#020617]" />

        {/* Green Blob */}
        <motion.div
          animate={{
            y: [0, -25, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
          className="
            absolute
            -top-32
            -left-24
            h-[420px]
            w-[420px]
            rounded-full
            bg-[#798321]/12
            blur-[100px]
          "
        />

        {/* Yellow Blob */}
        <motion.div
          animate={{
            y: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
          className="
            absolute
            top-10
            right-0
            h-[350px]
            w-[350px]
            rounded-full
            bg-[#FFC107]/20
            blur-[120px]
          "
        />

        {/* Bottom Green */}
        <motion.div
          animate={{
            x: [0, -20, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
          }}
          className="
            absolute
            bottom-0
            left-1/2
            h-[450px]
            w-[450px]
            -translate-x-1/2
            rounded-full
            bg-[#798321]/10
            blur-[150px]
          "
        />

        {/* Top Left Shape */}
        <div
          className="
            absolute
            top-0
            left-0
            h-[240px]
            w-[340px]
            rounded-br-[160px]
            bg-[#FFC107]
            opacity-90
          "
        />

        {/* Bottom Right Shape */}
        <div
          className="
            absolute
            bottom-0
            right-0
            h-[280px]
            w-[320px]
            rounded-tl-[180px]
            bg-[#798321]
          "
        />

        {/* Floating Circles */}

        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 5,
          }}
          className="
            absolute
            top-40
            left-20
            h-5
            w-5
            rounded-full
            bg-[#798321]
          "
        />

        <motion.div
          animate={{
            y: [0, 15, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 6,
          }}
          className="
            absolute
            bottom-40
            right-24
            h-6
            w-6
            rounded-full
            bg-[#FFC107]
          "
        />

        {/* Yellow Ring */}

        <div
          className="
            absolute
            top-52
            right-44
            h-16
            w-16
            rounded-full
            border-[6px]
            border-[#FFC107]
          "
        />

        {/* Green Ring */}

        <div
          className="
            absolute
            bottom-44
            left-36
            h-16
            w-16
            rounded-full
            border-[6px]
            border-[#798321]
          "
        />

        {/* Dots */}

        <div className="absolute top-24 right-1/3 grid grid-cols-5 gap-3">
          {[...Array(15)].map((_, i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-[#798321]"
            />
          ))}
        </div>

        <div className="absolute bottom-24 left-10 grid grid-cols-5 gap-3">
          {[...Array(20)].map((_, i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-[#FFC107]"
            />
          ))}
        </div>

        {/* Grid Pattern */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.03]
            bg-[linear-gradient(to_right,#798321_1px,transparent_1px),linear-gradient(to_bottom,#798321_1px,transparent_1px)]
            bg-[size:40px_40px]
          "
        />
      </div>
    </>
  );
}