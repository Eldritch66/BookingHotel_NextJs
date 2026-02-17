import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png";

export default function Navbar() {
  return (
    <nav className="flex flex-row items-center">
      <ul className="flex items-center gap-4 text-sm">
        <li className="mr-14">
          <Link href="#">
            <Image
              src={Logo}
              alt="Logo"
              quality={100}
              className="object-cover object-center w-30 h-34 block "
            />
          </Link>
        </li>
        <li>
          <Link href="#">facilities</Link>
        </li>
        <li>
          <Link href="#">About Us</Link>
        </li>
        <li>
          <Link href="#">Services</Link>
        </li>
      </ul>
    </nav>
  );
}
