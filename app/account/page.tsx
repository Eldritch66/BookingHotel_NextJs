import { auth } from "../_lib/auth";
import { getGuest, getBookings } from "../_lib/data-services";
import { redirect } from "next/navigation";
import DashboardStats from "../_components/DashboardStats";
import ActiveBookings from "../_components/ActiveBookings";
import Link from "next/link";
import { FiEdit2, FiArrowRight } from "react-icons/fi";
import type { Booking } from "../_lib/type";

export const metadata = {
  title: "Dashboard",
};

export default async function Page() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const guest = await getGuest(session.user.email);
  const raw = await getBookings(guest?.guest_id);

  const bookings = raw as unknown as Booking[];
  const totalSpending = bookings.reduce(
    (sum, b) => sum + (b.total_price || 0),
    0,
  );
  const upcomingCount = bookings.filter(
    (b) => new Date(b.end_date) > new Date(),
  ).length;
  const uniqueProperties = new Set(
    bookings.map((b) => b.rooms.properties.title),
  ).size;

  const firstName = session?.user?.name?.split(" ")[0] || "Tamu";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h2 className="font-semibold text-2xl text-accent-400">
            Selamat datang kembali, {firstName}!
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {bookings.length > 0
              ? `Anda memiliki ${upcomingCount} booking mendatang`
              : "Mulai rencanakan liburan Anda"}
          </p>
        </div>
        <Link
          href="/account/edit-profile"
          className="hidden sm:inline-flex items-center gap-2 text-sm text-gray-500 rounded-lg px-3 py-2 transition-all duration-300 hover:bg-stone-50 hover:text-gray-800 hover:shadow-sm"
        >
          <FiEdit2 size={14} className="transition-transform duration-300 group-hover:rotate-12" />
          Edit Profil
        </Link>
      </div>

      <DashboardStats
        stats={{
          totalBookings: bookings.length,
          totalSpending,
          upcomingCount,
          uniqueProperties,
        }}
      />

      <div className="animate-fade-up" style={{ animationDelay: "150ms" }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
            <span className="inline-block w-1 h-5 rounded-full bg-stone-900" />
            Booking Aktif
          </h3>
          {bookings.length > 0 && (
            <Link
              href="/account/bookings"
              className="group text-sm text-primary-1000 hover:text-orange-700 flex items-center gap-1 transition-all duration-300 hover:gap-2"
            >
              Lihat Semua <FiArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
        <ActiveBookings bookings={bookings} />
      </div>

      <div className="sm:hidden pt-2 animate-fade-up" style={{ animationDelay: "300ms" }}>
        <Link
          href="/account/edit-profile"
          className="group flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-all duration-300 hover:bg-stone-50 hover:border-gray-400 hover:shadow-sm hover:-translate-y-0.5"
        >
          <FiEdit2 size={15} className="transition-transform duration-300 group-hover:rotate-12" />
          Edit Profil
        </Link>
      </div>
    </div>
  );
}
