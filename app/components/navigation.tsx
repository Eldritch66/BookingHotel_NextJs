import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex flex-1 items-center">
      <ul className="flex flex-row gap-6 text-sm">
        <li>
          <Link href="#">Logo</Link>
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
