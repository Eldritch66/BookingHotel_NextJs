"use client";

import { FiHome, FiCalendar, FiUser, FiLogOut } from "react-icons/fi";
import { signOut } from "next-auth/react";

export default function NavigationProfile() {
  return (
    <nav className="flex flex-col justify-between  border-r h-full">
      <ul className="grid gap-10">
        <li className="flex flex-row items-center">
          <FiHome size={20} className="mr-2" />
          Home
        </li>
        <li className="flex flex-row items-center">
          <FiCalendar size={20} className="mr-2" />
          Reservation
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
