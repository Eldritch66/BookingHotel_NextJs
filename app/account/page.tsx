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

  const firstName = session?.user?.name?.split(" ")[0] || "Guest";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-2xl text-accent-400">
          Welcome back, {firstName}!
        </h2>
        <Link
          href="/account/edit-profile"
          className="hidden sm:inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <FiEdit2 size={14} />
          Edit Profile
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

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg text-gray-800">
            Booking Aktif
          </h3>
          {bookings.length > 0 && (
            <Link
              href="/account/reservation"
              className="text-sm text-primary-1000 hover:underline flex items-center gap-1"
            >
              Lihat Semua <FiArrowRight size={14} />
            </Link>
          )}
        </div>
        <ActiveBookings bookings={bookings} />
      </div>

      <div className="sm:hidden pt-2">
        <Link
          href="/account/edit-profile"
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50"
        >
          <FiEdit2 size={15} />
          Edit Profile
        </Link>
      </div>
    </div>
  );
}
