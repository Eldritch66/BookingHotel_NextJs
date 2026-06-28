"use client";

import { FiHome, FiCalendar, FiUser, FiLogOut } from "react-icons/fi";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/account", label: "Beranda", icon: FiHome },
  { href: "/account/bookings", label: "Booking", icon: FiCalendar },
  { href: "/account/edit-profile", label: "Edit Profil", icon: FiUser },
];

export default function NavigationProfile() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-row sm:flex-col justify-between sm:justify-start border-b sm:border-b-0 sm:border-r border-stone-200 pb-4 sm:pb-0 sm:h-full">
      <ul className="flex flex-row sm:flex-col items-center sm:items-start gap-2 sm:gap-2 w-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href} className="w-full sm:w-auto">
              <Link
                href={item.href}
                className={`group relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 w-full sm:w-auto ${
                  isActive
                    ? "bg-stone-100 text-stone-900 shadow-sm"
                    : "text-stone-500 hover:bg-stone-50 hover:text-stone-800 hover:translate-x-0.5"
                }`}
              >
                <item.icon
                  size={18}
                  className={`transition-all duration-300 ${
                    isActive
                      ? "text-stone-900"
                      : "text-stone-400 group-hover:text-stone-600 group-hover:scale-110"
                  }`}
                />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-stone-900 hidden sm:block" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
      <div
        onClick={() => signOut({ redirectTo: "/" })}
        className="group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm sm:text-base font-medium cursor-pointer sm:mt-auto mr-1 text-stone-500 transition-all duration-300 hover:bg-red-50 hover:text-red-600 hover:translate-x-0.5"
      >
        <FiLogOut
          size={18}
          className="text-stone-400 transition-all duration-300 group-hover:text-red-500 group-hover:scale-110"
        />
        Keluar
      </div>
    </nav>
  );
}
