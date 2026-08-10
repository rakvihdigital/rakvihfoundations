"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "About Us",
    href: "/about",
  },
  {
    name: "Programs",
    href: "/programs",
  },
  {
    name: "Success Stories",
    href: "/success-stories",
  },
  {
    name: "FAQ",
    href: "/faq",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];

export default function DesktopMenu() {
  const pathname = usePathname();

  return (
    <ul className="hidden lg:flex items-center gap-8">
      {menus.map((menu) => (
        <li key={menu.name}>
          <Link
            href={menu.href}
            className={`font-medium transition ${
              pathname === menu.href
                ? "text-[#FFC107]"
                : "text-white hover:text-[#FFC107]"
            }`}
          >
            {menu.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}