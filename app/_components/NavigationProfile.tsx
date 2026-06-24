"use client";

import { FiHome, FiCalendar, FiUser, FiLogOut } from "react-icons/fi";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function NavigationProfile() {
  return (
    <nav className="flex flex-row sm:flex-col justify-between sm:justify-start border-b sm:border-b-0 sm:border-r pb-4 sm:pb-0 sm:h-full">
      <ul className="flex flex-row sm:flex-col items-center sm:items-start gap-6 sm:gap-10">
        <li>
          <Link
            href="/account"
            className="flex flex-row items-center text-sm sm:text-base font-medium"
          >
            <FiHome size={20} className="mr-2" />
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/account/reservation"
            className="flex flex-row items-center text-sm sm:text-base font-medium"
          >
            <FiCalendar size={20} className="mr-2" />
            Reservation
          </Link>
        </li>
        <li>
          <Link
            href="/account/edit-profile"
            className="flex flex-row items-center text-sm sm:text-base font-medium"
          >
            <FiUser size={20} className="mr-2" />
            Edit Profile
          </Link>
        </li>
      </ul>
      <div
        onClick={() => signOut({ redirectTo: "/" })}
        className="flex flex-row items-center text-sm sm:text-base font-medium cursor-pointer sm:mt-auto mr-1"
      >
        <FiLogOut size={20} className="mr-2" />
        Sign Out
      </div>
    </nav>
  );
}
