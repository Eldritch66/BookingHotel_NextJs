"use client";

import { signIn } from "next-auth/react";
// import { signInAction } from "../_lib/action";
import GoogleIcon from "./GoogleIcon";

export default function SignInButton() {
  return (
    // <form action={signInAction}> its cant be used instead its need on client component
    // <form action={signInAction}>
    <button
      onClick={() => signIn("google", { redirectTo: "/" })}
      className="flex items-center justify-center gap-3 w-full py-3.5 px-5 border border-[#e8e1d9] rounded-xl bg-white text-[#3b2314] text-sm font-medium hover:border-[#c8a98a] hover:bg-[#faf7f4] hover:shadow-sm transition-all duration-200 cursor-pointer"
    >
      <GoogleIcon />
      Continue with Google
    </button>
    // </form>
  );
}
