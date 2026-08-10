"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const menus = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Programs", href: "/programs" },
  { name: "Tuition", href: "/tuition" }, // 👈 new
  { name: "Success Stories", href: "/success-stories" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="lg:hidden text-white transition-colors hover:text-[#FFC107]"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={28} /> : <Menu size={28} />}
      </button>

      {open && (
        <div className="absolute top-20 left-0 w-full bg-black border-t border-neutral-800 lg:hidden z-50">
          {menus.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-6 py-4 text-white hover:bg-[#FFC107] hover:text-black transition-colors"
              onClick={() => setOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}