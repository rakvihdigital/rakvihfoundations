import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="group inline-block">
      <Image
        src="/images/Rakvih Foundation.png"
        alt="RAKVIH Foundation Logo"
        width={220}
        height={64}
        priority
        className="object-contain transition-transform duration-300 group-hover:scale-105"
      />
    </Link>
  );
}