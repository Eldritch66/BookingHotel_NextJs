import Link from "next/link";
import { CgProfile } from "react-icons/cg";

export default function Login() {
  return (
    <div
      className="flex gap-2
      justify-end items-center text-sm z-50"
    >
      <div className="flex items-center">
        <CgProfile size={36} />
      </div>
      <div className="bg-black border-2 px-4 py-2 rounded-full text-white">
        <Link href="#">Login</Link>
      </div>
    </div>
  );
}
