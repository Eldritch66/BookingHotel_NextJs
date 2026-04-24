import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex flex-row items-center z-50 sticky">
      <ul className="flex items-center gap-4 text-sm">
        <li>
          <Link href="/bookings">Booking</Link>
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
