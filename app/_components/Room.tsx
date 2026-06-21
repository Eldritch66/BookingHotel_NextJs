"use client";

import { Room } from "../_lib/type";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { startOfDay } from "date-fns";
import { formatRupiah } from "../_lib/currency";
import DateRangePicker from "./DateRangePicker";
import ImageCarouselRoomDetail from "./ImageCarouselRoomDetail";
import RoomImageGallery from "./RoomImageGallery";
import HeaderDetailPage from "./HeaderDetailPage";
import PricePerNightAndRating from "./PricePerNightAndRating";
import { createBooking } from "../_lib/action";
import ReservationForm from "./ReservationForm";

export default function DetailRoom({ room }: { room: Room }) {
  const [range, setRange] = useState<DateRange | undefined>();

  const {
    id,
    property_id,
    name,
    price_per_night,
    bed_type,
    quantity,
    created_at,
    size,
    description_full,
    properties,
  } = room;

  const { title, city, province, property_images } =
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
    <div className="min-h-screen h-full w-full mt-0 overflow-x-hidden">
      <ImageCarouselRoomDetail images={images} />

      <RoomImageGallery propImages={images} title={title} />

      <section
        className="w-full lg:max-w-[1750px] bg-white border-white rounde
      d-t-2xl mx-auto mt-6 px-2 grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-6"
      >
        <HeaderDetailPage
          title={title}
          city={city}
          province={province}
          name={name}
          description_full={description_full}
        />

        <div className="shadow-lg w-full rounded-2xl px-4 py-4 border border-gray-200 sticky h-fit bg-white">
          <PricePerNightAndRating price={price_per_night} />
          <div className="mt-4">
            <DateRangePicker
              range={range}
              onRangeChange={(value) => {
                setRange(value);
              }}
              disabled={(date) => {
                if (date < startOfDay(new Date())) return true;
                if (room.bookedRanges) {
                  return room.bookedRanges.some((range) => {
                    const start = new Date(range.start_date + "T00:00:00");
                    const end = new Date(range.end_date + "T00:00:00");
                    return date >= start && date < end;
                  });
                }
                return false;
              }}
            />
          </div>
          <ReservationForm
            createBooking={createBooking}
            id={id}
            price_per_night={price_per_night}
            range={range}
            nights={nights}
          />
          <p className="text-center text-sm text-gray-400 mt-2">
            You won&apos;t be charged yet
          </p>
          {range?.from && range?.to && (
            <div className="mt-4 text-sm text-gray-600 space-y-2">
              <div className="flex justify-between text-base">
                <span>
                  {formatRupiah(price_per_night)} × {nights} nights
                </span>
                <span>{formatRupiah(total)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span>Service fee</span>
                <span>{formatRupiah(service)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span>Taxes</span>
                <span>{formatRupiah(tax)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold text-black text-lg">
                <span>Total</span>
                <span>{formatRupiah(total + service + tax)}</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
