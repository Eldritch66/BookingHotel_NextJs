import Link from "next/link";

export default function Login() {
  return (
    <div
      className="flex flex-1 gap-2
      justify-end items-center text-sm"
    >
      <div className="border-black border-2 px-4 py-2 rounded-full">
        <Link href="#">Sign Up</Link>
      </div>
      <div className="bg-black border-2 px-4 py-2 rounded-full text-white">
        <Link href="#">Login</Link>
      </div>
    </div>
  );
}
