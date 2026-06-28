import Link from "next/link";
import Image from "next/image";
import { format, parseISO, isPast, endOfDay } from "date-fns";
import { FiCalendar, FiMapPin, FiArrowRight } from "react-icons/fi";
import type { Booking } from "../_lib/type";
import { formatRupiah } from "../_lib/currency";

export default function ActiveBookings({
  bookings,
}: {
  bookings: Booking[];
}) {
  const active = bookings.filter(
    (b) => !isPast(endOfDay(parseISO(b.end_date))),
  ).slice(0, 3);

  if (active.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
        <FiCalendar size={32} className="mx-auto text-gray-300 mb-2" />
        <p className="text-gray-500 text-sm">Tidak ada booking aktif</p>
        <Link
          href="/bookings"
          className="inline-flex items-center gap-1 text-sm text-primary-1000 hover:underline mt-2"
        >
          Cari properti <FiArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {active.map((booking, i) => (
        <Link
          key={booking.id}
          href={`/bookings/${booking.id}`}
          className="group flex items-center gap-3 sm:gap-4 rounded-xl border border-gray-200 bg-white p-3 sm:p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-gray-300 animate-fade-up"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
            {booking.rooms.properties.property_images?.[0]?.image_url ? (
              <Image
                src={booking.rooms.properties.property_images[0].image_url}
                alt={booking.rooms.properties.title}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-110"
                sizes="80px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                No img
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm sm:text-base font-semibold text-gray-900 truncate transition-colors duration-300 group-hover:text-primary-1000">
              {booking.rooms.properties.title}
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 mt-0.5">
              <FiMapPin size={12} />
              {booking.rooms.properties.city}, {booking.rooms.properties.province}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {format(parseISO(booking.start_date), "dd MMM yyyy")} &mdash;{" "}
              {format(parseISO(booking.end_date), "dd MMM yyyy")}
            </p>
          </div>
          <div className="text-right flex-shrink-0 transition-all duration-300 group-hover:translate-x-0.5">
            <p className="text-sm font-bold text-primary-1000 transition-colors duration-300 group-hover:text-orange-700">
              {formatRupiah(booking.total_price)}
            </p>
            <p className="text-xs text-gray-400">{booking.num_nights} malam</p>
          </div>
        </Link>
      ))}
      {bookings.length > 3 && (
        <Link
          href="/account/bookings"
          className="block text-center text-sm text-primary-1000 hover:underline pt-1 transition-all duration-300 hover:translate-x-1 animate-fade-up"
          style={{ animationDelay: `${active.length * 80}ms` }}
        >
          Lihat semua booking &rarr;
        </Link>
      )}
    </div>
  );
}
