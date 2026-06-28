import { auth } from "@/app/_lib/auth";
import { getBookingWithDetails, getGuest } from "@/app/_lib/data-services";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FiCalendar,
  FiMapPin,
  FiHome,
  FiUsers,
  FiMoon,
  FiArrowLeft,
  FiCreditCard,
  FiClock,
} from "react-icons/fi";
import {
  endOfDay,
  format,
  isAfter,
  isBefore,
  isToday,
  parseISO,
  startOfDay,
} from "date-fns";
import { formatRupiah } from "@/app/_lib/currency";
import CancelButton from "./CancelButton";

type BookingStatus = "pending" | "aktif" | "selesai" | "dibatalkan";

function getStatus(start: string, end: string, dbStatus?: string): BookingStatus {
  if (dbStatus === "dibatalkan" || dbStatus === "cancelled") return "dibatalkan";

  const now = new Date();
  const startDate = startOfDay(parseISO(start));
  const endDate = endOfDay(parseISO(end));

  if (isAfter(now, endDate)) return "selesai";
  if (isAfter(now, startDate) || isToday(parseISO(start))) return "aktif";
  return "pending";
}

const statusConfig: Record<
  BookingStatus,
  { label: string; color: string; cancelable: boolean }
> = {
  pending: {
    label: "Pending",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    cancelable: true,
  },
  aktif: {
    label: "Aktif",
    color: "bg-green-50 text-green-700 border-green-200",
    cancelable: false,
  },
  selesai: {
    label: "Selesai",
    color: "bg-gray-100 text-gray-500 border-gray-200",
    cancelable: false,
  },
  dibatalkan: {
    label: "Dibatalkan",
    color: "bg-red-50 text-red-500 border-red-200",
    cancelable: false,
  },
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const guest = await getGuest(session.user.email);
  if (!guest) redirect("/login");

  const { id } = await params;
  const booking = await getBookingWithDetails(id);

  if (!booking || booking.guest_id !== guest.guest_id) notFound();

  const status = getStatus(booking.start_date, booking.end_date, booking.status);
  const { label, color, cancelable } = statusConfig[status];
  const payment = booking.payments?.[0];
  const room = booking.rooms;
  const property = room?.properties;
  const image = property?.property_images?.[0]?.image_url;

  return (
    <div className="animate-fade-up max-w-2xl mx-auto">
      <Link
        href="/account/reservation"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors duration-200 mb-6"
      >
        <FiArrowLeft size={16} />
        Kembali
      </Link>

      {/* Image */}
      <div className="relative h-56 sm:h-72 w-full bg-gray-100 mb-6 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={property?.title ?? ""}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 600px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <FiHome size={48} />
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {property?.title}
          </h1>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <FiMapPin size={14} />
            {property?.city}, {property?.province}
          </p>
        </div>
        <span
          className={`px-3 py-1 text-xs font-bold rounded-full border ${color} flex-shrink-0`}
        >
          {label}
        </span>
      </div>

      {/* Room info */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
          <div className="p-2 rounded-lg bg-stone-100">
            <FiHome size={18} className="text-stone-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Tipe Kamar</p>
            <p className="font-semibold text-gray-900">{room?.name ?? "-"}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <FiCalendar size={16} className="text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Check-in</p>
              <p className="font-semibold text-gray-900 text-sm">
                {format(parseISO(booking.start_date), "EEE, dd MMM yyyy")}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FiCalendar size={16} className="text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Check-out</p>
              <p className="font-semibold text-gray-900 text-sm">
                {format(parseISO(booking.end_date), "EEE, dd MMM yyyy")}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FiMoon size={16} className="text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Durasi</p>
              <p className="font-semibold text-gray-900 text-sm">
                {booking.num_nights} malam
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FiUsers size={16} className="text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Tamu</p>
              <p className="font-semibold text-gray-900 text-sm">
                {booking.num_guests} orang
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment */}
      {payment && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FiCreditCard size={16} className="text-gray-500" />
            Pembayaran
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Metode</span>
              <span className="font-medium text-gray-900">
                {payment.payment_method === "qris"
                  ? "QRIS"
                  : payment.payment_method === "paypal"
                    ? "PayPal"
                    : payment.payment_method ?? "-"}
              </span>
            </div>
            {payment.transaction_id && (
              <div className="flex justify-between">
                <span className="text-gray-500">ID Transaksi</span>
                <span className="font-mono text-gray-900 text-xs">
                  {payment.transaction_id}
                </span>
              </div>
            )}
            {payment.paid_at && (
              <div className="flex justify-between">
                <span className="text-gray-500">Dibayar pada</span>
                <span className="font-medium text-gray-900">
                  {format(parseISO(payment.paid_at), "dd MMM yyyy HH:mm")}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-100 pt-2">
              <span className="text-gray-500">Total</span>
              <span className="font-bold text-gray-900">
                {formatRupiah(payment.amount ?? booking.total_price)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Total & Actions */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-500">Total Harga</span>
          <span className="text-xl font-bold text-gray-900">
            {formatRupiah(booking.total_price)}
          </span>
        </div>
        <div className="space-y-3">
          {cancelable && (
            <CancelButton bookingId={booking.id} />
          )}
          {status === "aktif" && (
            <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
              <FiClock size={12} />
              Reservasi aktif tidak dapat dibatalkan
            </p>
          )}
          {status === "dibatalkan" && booking.refund_amount != null && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-center">
              <p className="font-semibold text-green-700">Refund Berhasil</p>
              <p className="text-green-600">
                Dana sebesar {formatRupiah(booking.refund_amount)} telah dikembalikan
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
