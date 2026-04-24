import Link from "next/link";
import Login from "./Login";
import Navbar from "./Navigation";
import Image from "next/image";
import Logo from "@/public/logo.png";
import HamburgerMenu from "./HumbergerMenu";
import { auth } from "../_lib/auth";

async function Header() {
  const session = await auth();
  return (
    <header className="flex px-4 py-5 justify-between items-center mx-auto w-full lg:max-w-[1750px] h-16 sticky top-0 z-50 bg-white shadow-sm rounded-none sm:rounded-full">
      {/* Logo */}
      <div className="shrink-0 px-2">
        <Link href="/">
          <Image
            src={Logo}
            alt="Logo"
            quality={100}
            className="w-28 h-auto object-contain block"
          />
        </Link>
      </div>

      <div className="hidden sm:flex flex-1 justify-center items-center">
        <Navbar />
      </div>

      <div className="hidden sm:flex flex-shrink-0">
        <Login />
      </div>

      <div className="flex sm:hidden">
        <HamburgerMenu session={session} />
      </div>
    </header>
  );
}

export default Header;
