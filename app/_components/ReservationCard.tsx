import Link from "next/link";
import Image from "next/image";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import {
  endOfDay,
  format,
  formatDistance,
  isPast,
  isToday,
  parseISO,
} from "date-fns";
import { Booking } from "../_lib/type";
import { formatRupiah } from "../_lib/currency";
import DeleteReservation from "./DeleteReservation";

export const formatDistanceFromNow = (dateStr: string) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  }).replace("about ", "");

function ReservationCard({
  booking,
  onDelete,
}: {
  booking: Booking;
  onDelete: (bookingId: string) => void;
}) {
  const {
    id,
    guest_id,
    start_date,
    end_date,
    num_nights,
    total_price,
    num_guests,
    rooms: {
      name: roomName,
      properties: { title, property_images },
    },
  } = booking;

  const image = property_images?.[0]?.image_url;
  // const isUpcoming = !isPast(new Date(end_date));
  const isUpcoming = !isPast(endOfDay(parseISO(end_date)));
  return (
    <div className="flex flex-col border border-primary-800">
      <div className="flex items-center">
        <div className="relative h-28 sm:h-32 aspect-square flex-shrink-0 bg-gray-100">
          {image ? (
            <Image
              src={image}
              alt={`Property ${title}`}
              quality={40}
              fill
              className="object-cover border-r border-primary-800"
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
              {num_nights} nights in {title}
            </h3>
            {isUpcoming ? (
              <span className="bg-green-800 text-green-200 h-6 px-2 sm:h-7 sm:px-3 uppercase text-[10px] sm:text-xs font-bold flex items-center rounded-sm flex-shrink-0">
                upcoming
              </span>
            ) : (
              <span className="bg-yellow-800 text-yellow-200 h-6 px-2 sm:h-7 sm:px-3 uppercase text-[10px] sm:text-xs font-bold flex items-center rounded-sm flex-shrink-0">
                past
              </span>
            )}
          </div>

          <p className="text-xs sm:text-lg text-primary-300 mt-1 leading-snug">
            {/* {format(new Date(start_date), "EEE, MMM dd yyyy")} (
            {isToday(new Date(start_date))
              ? "Today"
              : formatDistanceFromNow(start_date)}
            ) &mdash; {format(new Date(end_date), "EEE, MMM dd yyyy")} */}
            {format(parseISO(start_date), "EEE, MMM dd yyyy")} (
            {isToday(parseISO(start_date))
              ? "Today"
              : formatDistanceFromNow(start_date)}
            ) &mdash; {format(parseISO(end_date), "EEE, MMM dd yyyy")}
          </p>

          <div className="flex gap-3 mt-auto items-baseline pt-2">
            <p className="text-base sm:text-xl font-semibold text-accent-400">
              {formatRupiah(total_price)}
            </p>
            <p className="text-primary-300">&bull;</p>
            <p className="text-sm sm:text-lg text-primary-300">
              {num_guests} guest{num_guests > 1 && "s"}
            </p>
          </div>
        </div>

        {/* ── Desktop-only right panel (unchanged) ── */}
        <div className="hidden sm:flex flex-col border-l border-primary-800 w-[100px]">
          {isUpcoming && (
            <Link
              href={`/account/reservations/edit/${id}`}
              className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 border-b border-primary-800 flex-grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900"
            >
              <HiOutlinePencilSquare className="h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-colors" />
              <span className="my-2">Edit</span>
            </Link>
          )}
          <div className="mt-1.5"></div>
          <DeleteReservation bookingId={id} onDelete={onDelete} />
        </div>
      </div>

      {/* ── Mobile-only bottom action bar ── */}
      <div className="flex sm:hidden border-t border-primary-800">
        {isUpcoming && (
          <Link
            href={`/account/reservations/edit/${id}`}
            className="group flex items-center justify-center gap-2 flex-1 uppercase text-xs font-bold text-primary-300 border-r border-primary-800 py-2.5 hover:bg-accent-600 transition-colors hover:text-primary-900"
          >
            <HiOutlinePencilSquare className="h-4 w-4 text-primary-600 group-hover:text-primary-800 transition-colors" />
            <span>Edit</span>
          </Link>
        )}
        <div
          className={`${isUpcoming ? "flex-1" : "w-full"} flex [&>*]:flex-1 [&>*]:flex [&>*]:items-center [&>*]:justify-center`}
        >
          <DeleteReservation bookingId={id} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
}

export default ReservationCard;
