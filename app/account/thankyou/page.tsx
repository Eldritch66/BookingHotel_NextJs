import Link from "next/link";

export default function Page() {
  return (
    <div className="w-full justify-center flex-col">
      <h1 className="text-3xl font-semibold mb-10">
        Thank you for your reservation!
      </h1>
      <Link
        href="/account/reservation"
        className="underline text-xl text-accent-500"
      >
        Manage your reservations &rarr;
      </Link>
    </div>
  );
}
