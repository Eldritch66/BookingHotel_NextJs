import ReservationList from "@/app/_components/ReservationList";
import { auth } from "@/app/_lib/auth";
import { getBookings, getGuest } from "@/app/_lib/data-services";
import Link from "next/link";
import { redirect } from "next/navigation";
export default async function Page() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const guest = await getGuest(session.user.email);
  const bookings = await getBookings(guest?.guest_id);

  return (
    <div className="animate-fade-up">
      <h2 className="font-semibold text-2xl text-accent-400 mb-7 flex items-center gap-3">
        <span className="inline-block w-1 h-6 rounded-full bg-stone-900" />
        Booking Saya
      </h2>

      {bookings.length === 0 ? (
        <p className="text-lg animate-fade-up" style={{ animationDelay: "100ms" }}>
          Anda belum memiliki booking. Jelajahi{" "}
          <Link className="underline text-accent-500 hover:text-orange-700 transition-colors duration-200" href="/cabins">
            kabin mewah kami &rarr;
          </Link>
        </p>
      ) : (
        <ul className="space-y-6">
          <ReservationList bookings={bookings as any} />
        </ul>
      )}
    </div>
  );
}
