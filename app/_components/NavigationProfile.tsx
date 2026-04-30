"use client";

import { FiHome, FiCalendar, FiUser, FiLogOut } from "react-icons/fi";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function NavigationProfile() {
  return (
    <nav className="flex flex-col justify-between border-r h-full">
      <ul className="grid gap-10">
        <li className="items-center w-full">
          <Link href="/account" className="flex flex-row">
            <FiHome size={20} className="mr-2" />
            Home
          </Link>
        </li>
        <li className="flex flex-row items-center">
          <Link href="/account/reservation" className="flex flex-row">
            <FiCalendar size={20} className="mr-2" />
            Reservation
          </Link>
        </li>
      </ul>
      <div
        onClick={() => signOut({ redirectTo: "/" })}
        className="flex flex-row items-center cursor-pointer"
      >
        <FiLogOut size={20} className="mr-2" />
        Sign Out
      </div>
    </nav>
  );
}
