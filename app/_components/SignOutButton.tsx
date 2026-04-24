"use client";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ redirectTo: "/" })}
      className="w-full py-3 px-6 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
    >
      Sign Out
    </button>
  );
}
