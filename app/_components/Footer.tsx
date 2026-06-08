import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo.png";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 lg:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* Left */}
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2">
              <Image src={Logo} alt="Nginapin" className="h-8 w-auto" />
            </Link>

            <p className="mt-3 text-sm leading-relaxed text-neutral-500">
              Temukan kosan dan kontrakan di Bogor dengan proses yang lebih
              mudah, transparan, dan nyaman.
            </p>
          </div>

          {/* Right */}
          <nav className="flex gap-6 text-sm text-neutral-600">
            <Link href="/properti" className="transition hover:text-orange-600">
              Properti
            </Link>

            <Link href="/about" className="transition hover:text-orange-600">
              About Us
            </Link>
          </nav>
        </div>

        <div className="mt-8 border-t border-neutral-100 pt-6">
          <p className="text-center text-sm text-neutral-400">
            © {new Date().getFullYear()} Nginapin. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
