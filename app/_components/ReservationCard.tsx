"use client";

import Link from "next/link";
import Image from "next/image";
import { FiEye, FiTrash2 } from "react-icons/fi";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteBooking } from "../_lib/action";
import toast from "react-hot-toast";
import {
  endOfDay,
  format,
  formatDistance,
  isAfter,
  isToday,
  parseISO,
  startOfDay,
} from "date-fns";
import { Booking } from "../_lib/type";
import { formatRupiah } from "../_lib/currency";

export const formatDistanceFromNow = (dateStr: string) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  }).replace("about ", "");

type BookingStatus = "pending" | "aktif" | "selesai" | "dibatalkan";

function getStatus(
  start: string,
  end: string,
  dbStatus?: string,
): BookingStatus {
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
  { label: string; color: string }
> = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  aktif: {
    label: "Aktif",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  selesai: {
    label: "Selesai",
    color: "bg-gray-100 text-gray-600 border-gray-200",
  },
  dibatalkan: {
    label: "Dibatalkan",
    color: "bg-red-50 text-red-500 border-red-200",
  },
};

function ReservationCard({ booking }: { booking: Booking }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    id,
    start_date,
    end_date,
    num_nights,
    total_price,
    num_guests,
    status: dbStatus,
    rooms: {
      properties: { title, property_images },
    },
  } = booking;

  const image = property_images?.[0]?.image_url;
  const status = getStatus(start_date, end_date, dbStatus);
  const { label, color } = statusConfig[status];
  const canDelete = status === "selesai" || status === "dibatalkan";

  function handleDelete() {
    const toastId = toast.loading("Menghapus booking...");
    startTransition(async () => {
      try {
        await deleteBooking(id);
        toast.success("Booking berhasil dihapus", { id: toastId });
        router.refresh();
      } catch (e) {
        toast.error((e as Error).message || "Gagal menghapus booking", {
          id: toastId,
        });
      }
    });
  }

  return (
    <div className="group flex flex-col border border-primary-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 animate-fade-up">
      <div className="flex items-center">
        <div className="relative h-28 sm:h-32 aspect-square flex-shrink-0 bg-gray-100 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={`Property ${title}`}
              quality={40}
              fill
              className="object-cover border-r border-primary-800 transition-all duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              No image
            </div>
          )}
        </div>

        <div className="flex-grow px-3 sm:px-6 py-3 flex flex-col min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base sm:text-xl font-semibold leading-snug">
              {num_nights} malam di {title}
            </h3>
            <span
              className={`h-6 px-2 sm:h-7 sm:px-3 text-[10px] sm:text-xs font-bold flex items-center rounded-full border ${color} flex-shrink-0`}
            >
              {label}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-primary-300 mt-1 leading-snug">
            {format(parseISO(start_date), "EEE, dd MMM yyyy")} (
            {isToday(parseISO(start_date))
              ? "Hari ini"
              : formatDistanceFromNow(start_date)}
            ) &mdash; {format(parseISO(end_date), "EEE, dd MMM yyyy")}
          </p>

          <div className="flex gap-3 mt-auto items-baseline pt-2">
            <p className="text-base sm:text-xl font-semibold text-accent-400">
              {formatRupiah(total_price)}
            </p>
            <p className="text-primary-300">&bull;</p>
            <p className="text-sm sm:text-lg text-primary-300">
              {num_guests} tamu{num_guests > 1 && ""}
            </p>
          </div>
          {status === "dibatalkan" && booking.refund_amount != null && (
            <p className="text-xs text-green-600 font-medium mt-1">
              Refund {formatRupiah(booking.refund_amount)}
            </p>
          )}
        </div>

        {/* ── Desktop ── */}
        <div className="hidden sm:flex flex-col border-l border-primary-800 flex-shrink-0 self-stretch">
          <Link
            href={`/account/bookings/${id}`}
            className="flex flex-1 flex-col items-center justify-center gap-2 w-[100px] uppercase text-xs font-bold text-primary-300 px-3 hover:bg-accent-600 transition-all duration-200 hover:text-primary-900 cursor-pointer"
          >
            <FiEye className="h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-all duration-200 group-hover:scale-110" />
            <span>Detail</span>
          </Link>
          <button
            onClick={handleDelete}
            disabled={isPending || !canDelete}
            className="flex items-center justify-center gap-2 w-[100px] py-2.5 border-t border-primary-800 uppercase text-xs font-bold px-3 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer data-[enabled=true]:text-red-400 data-[enabled=true]:hover:bg-red-50 data-[enabled=true]:hover:text-red-600 text-stone-400"
            data-enabled={canDelete}
          >
            <FiTrash2 className="h-4 w-4" />
            <span>{isPending ? "..." : "Hapus"}</span>
          </button>
        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="flex sm:hidden border-t border-primary-800">
        <Link
          href={`/account/bookings/${id}`}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 uppercase text-xs font-bold text-primary-300 hover:bg-accent-600 transition-all duration-200 hover:text-primary-900 cursor-pointer"
        >
          <FiEye className="h-4 w-4 text-primary-600" />
          <span>Detail</span>
        </Link>
        <button
          onClick={handleDelete}
          disabled={isPending || !canDelete}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 border-l border-primary-800 uppercase text-xs font-bold px-3 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer data-[enabled=true]:text-red-400 data-[enabled=true]:hover:bg-red-50 data-[enabled=true]:hover:text-red-600 text-stone-400"
          data-enabled={canDelete}
        >
          <FiTrash2 className="h-4 w-4" />
          <span>{isPending ? "..." : "Hapus"}</span>
        </button>
      </div>
    </div>
  );
}

export default ReservationCard;
