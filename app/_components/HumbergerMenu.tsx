"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Logo from "@/public/logo.png";

import { CgProfile } from "react-icons/cg";
import Image from "next/image";
import { Session } from "next-auth";

export default function HamburgerMenu({
  session,
}: {
  session: Session | null;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative z-[60] flex items-center justify-center w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors duration-200 ${
          isOpen ? "hidden" : "flex" // ✅ hide when menu is open
        }`}
        aria-label="Toggle menu"
      >
        <span
          className={`absolute transition-all duration-300 ${
            isOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
          }`}
        >
          <X size={20} className="text-stone-700" />
        </span>
        <span
          className={`absolute transition-all duration-300 ${
            isOpen ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"
          }`}
        >
          <Menu size={20} className="text-stone-700" />
        </span>
      </button>

      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[45] transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide-down Menu Panel */}
      <div
        className={`fixed top-0 left-0 right-0 z-[50] bg-white shadow-xl
          transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
      >
        {/* Header row inside menu */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <Image
              src={Logo}
              alt="Logo"
              quality={100}
              className="w-24 h-auto object-contain"
            />
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100"
          >
            <X size={16} className="text-stone-600" />
          </button>
        </div>

        {/* Nav Links — staggered fade-in */}
        <nav className="px-6 py-6 flex flex-col gap-1">
          {[
            { label: "Booking", href: "/bookings" },
            { label: "About Us", href: "#" },
            { label: "Services", href: "#" },
          ].map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`group flex items-center justify-between py-4 border-b border-stone-100
                text-2xl font-light text-stone-800 hover:text-stone-500
                transition-all duration-300
                ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{
                transitionDelay: isOpen ? `${150 + i * 80}ms` : "0ms",
              }}
            >
              {item.label}
              <span className="text-stone-300 group-hover:translate-x-1 transition-transform duration-200 text-lg">
                →
              </span>
            </Link>
          ))}
        </nav>

        <div
          className={`px-6 py-6 transition-all duration-300
            ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: isOpen ? "420ms" : "0ms" }}
        >
          {" "}
          {session?.user?.image ? (
            // ✅ Logged in: show avatar + guest area link
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 w-full px-5 py-3.5 rounded-full
                bg-stone-900 text-white text-sm font-medium
                hover:bg-stone-700 transition-colors duration-200"
            >
              <Image
                className="h-8 rounded-full"
                src={session.user.image}
                width={32}
                height={32}
                alt={session.user.name || "User avatar"}
                referrerPolicy="no-referrer"
              />
              <span>Guest area</span>
            </Link>
          ) : (
            // ✅ Not logged in: show login button
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 w-full px-5 py-3.5 rounded-full
                bg-stone-900 text-white text-sm font-medium
                hover:bg-stone-700 transition-colors duration-200"
            >
              <CgProfile size={20} />
              Login to your account
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
