import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { auth } from "../_lib/auth";

export default async function Login() {
  const session = await auth();
  return (
    <div
      className="flex gap-2
      justify-end items-center text-sm z-50"
    >
      {session?.user ? (
        <Link href="/account" className="hover:text-accent-400 transition-colors">
          <span className="text-base font-extralight">Dashboard</span>
        </Link>
      ) : (
        <div className="bg-orange-600 border-2 px-4 py-2 rounded-full text-white flex items-center gap-2">
          <Link href="login">Login</Link>
          <CgProfile size={36} />
        </div>
      )}
    </div>
  );
}
