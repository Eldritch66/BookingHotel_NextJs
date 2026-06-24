"use client";

import { Room } from "../_lib/type";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { startOfDay, format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { IoLocationSharp } from "react-icons/io5";
import { formatRupiah } from "../_lib/currency";
import DateRangePicker from "./DateRangePicker";
import ImageCarouselRoomDetail from "./ImageCarouselRoomDetail";
import PricePerNightAndRating from "./PricePerNightAndRating";
import FacilitiesAndDetail from "./FacilitiesAndDetail";
import { createBooking } from "../_lib/action";
import ReservationForm from "./ReservationForm";

export default function DetailRoom({ room }: { room: Room }) {
  const [range, setRange] = useState<DateRange | undefined>();

  const {
    id,
    price_per_night,
    bed_type,
    quantity,
    properties,
  } = room;

  const { title, address, city, province, facilities, property_images } =
    properties ?? {};
  const images = property_images || [];

  let nights = 0;
  let total = 0;
  const service = 25000;
  const tax = price_per_night * 0.1;

  if (range?.from && range?.to) {
    nights =
      (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24);
    total = nights * price_per_night;
  }

  return (
    <div className="min-h-screen h-full w-full overflow-x-hidden">
      <div className="w-full lg:max-w-[1750px] mx-auto mt-4 px-3 lg:px-6">
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-x-6 gap-y-5">
          <ImageCarouselRoomDetail images={images} />

          <div className="shadow-lg w-full rounded-2xl px-5 py-6 border border-gray-200 bg-white space-y-5">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              <div className="flex items-start gap-1.5 mt-1.5 text-sm text-gray-500">
                <IoLocationSharp size={15} className="text-primary-1000 shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5 ml-[22px]">
                {city}, {province}
              </p>
            </div>

            <div className="border-t border-gray-100" />

            <PricePerNightAndRating price={price_per_night} />

            <DateRangePicker
              range={range}
              onRangeChange={(value) => setRange(value)}
              disabled={(date) => {
                if (date < startOfDay(new Date())) return true;
                if (room.bookedRanges) {
                  return room.bookedRanges.some((range) => {
                    const start = new Date(range.start_date + "T00:00:00");
                    const end = new Date(range.end_date + "T00:00:00");
                    return date >= start && date <= end;
                  });
                }
                return false;
              }}
            />

            <ReservationForm
              createBooking={createBooking}
              id={id}
              price_per_night={price_per_night}
              range={range}
              nights={nights}
            />

            <p className="text-center text-xs text-gray-400">
              You won&apos;t be charged yet
            </p>

            {range?.from && range?.to && (
              <>
                <div className="border-t border-gray-100" />
                <div className="text-sm text-gray-600 space-y-1.5">
                  <div className="flex justify-between">
                    <span>
                      {formatRupiah(price_per_night)} &times; {nights} nights
                    </span>
                    <span>{formatRupiah(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>{formatRupiah(service)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span>{formatRupiah(tax)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold text-gray-900">
                    <span>Total</span>
                    <span>{formatRupiah(total + service + tax)}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {room.bookedRanges && room.bookedRanges.length > 0 && (
            <div className="lg:col-start-1">
              <h4 className="text-sm font-medium text-gray-700 mb-2.5 flex items-center gap-1.5">
                <CalendarDays size={15} className="text-primary-1000" />
                Tidak tersedia pada:
              </h4>
              <div className="flex flex-wrap gap-2">
                {room.bookedRanges.map((r, i) => (
                  <div
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full text-xs text-red-700"
                  >
                    <CalendarDays size={13} />
                    <span>
                      {format(new Date(r.start_date), "dd MMM")} &mdash; {format(new Date(r.end_date), "dd MMM yyyy")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="lg:col-start-1">
            <FacilitiesAndDetail
              facilities={facilities}
              bedType={bed_type}
              quantity={quantity}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
