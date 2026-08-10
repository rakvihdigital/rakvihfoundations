"use client";

import { motion } from "framer-motion";

const particles = [
  {
    top: "12%",
    left: "16%",
    size: 6,
    color: "#FFC107",
    duration: 6,
    delay: 0,
  },
  {
    top: "22%",
    left: "78%",
    size: 8,
    color: "#798321",
    duration: 7,
    delay: 1,
  },
  {
    top: "42%",
    left: "10%",
    size: 5,
    color: "#FFC107",
    duration: 5,
    delay: 2,
  },
  {
    top: "62%",
    left: "88%",
    size: 7,
    color: "#798321",
    duration: 6,
    delay: 1.5,
  },
  {
    top: "82%",
    left: "34%",
    size: 6,
    color: "#FFC107",
    duration: 7,
    delay: 2.2,
  },
  {
    top: "35%",
    left: "52%",
    size: 5,
    color: "#798321",
    duration: 6,
    delay: 0.5,
  },
];

export default function HeroParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"

          style={{
            top: particle.top,
            left: particle.left,
            width: particle.size,
            height: particle.size,
            background: particle.color,
            boxShadow: `0 0 18px ${particle.color}`,
          }}

          animate={{
            y: [-12, 12, -12],
            x: [-4, 4, -4],
            opacity: [0.15, 0.5, 0.15],
            scale: [1, 1.2, 1],
          }}

          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

    </div>
  );
}