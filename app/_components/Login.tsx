import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { auth } from "../_lib/auth";
import Image from "next/image";

export default async function Login() {
  const session = await auth();
  return (
    <div
      className="flex gap-2
      justify-end items-center text-sm z-50"
    >
      {session?.user ? (
        <Link
          href="/account"
          className="hover:text-accent-400 transition-colors flex items-center gap-4"
        >
          {session.user.image ? (
            <Image
              className="h-8 w-8 rounded-full"
              src={session.user.image}
              width={20}
              height={20}
              alt={session.user.name || "User avatar"}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-[#8b5e3c] flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {(session.user.name || "U").charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <span className="text-base font-extralight">Guest area</span>
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
