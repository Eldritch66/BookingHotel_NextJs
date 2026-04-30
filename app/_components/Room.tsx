"use client";

import { Room } from "../_lib/type";
import { useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import RoomDropDown from "./roomDropDown";
import { formatRupiah } from "../_lib/currency";
import ImageCarouselRoomDetail from "./ImageCarouselRoomDetail";
import RoomImageGallery from "./RoomImageGallery";
import HeaderDetailPage from "./HeaderDetailPage";
import PricePerNightAndRating from "./PricePerNightAndRating";
import { createBooking } from "../_lib/action";
import ReservationForm from "./ReservationForm";

export default function DetailRoom({ room }: { room: Room }) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [open, setOpen] = useState(false);
  const [guests, setGuests] = useState(1);

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

  const { title, city, province, property_images, rating, review_count } =
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
      {/* ================= MOBILE (EMBLA) ================= */}
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
          rating={rating}
          review_count={review_count}
        />

        <div className="shadow-lg w-full rounded-2xl px-4 py-4 border border-gray-200 sticky h-fit bg-white">
          {/* <div className="shadow-lg w-full rounded-2xl px-4 py-4 border border-gray-200 sticky top-20 h-fit bg-white"> */}
          {/* PRICE */}
          <PricePerNightAndRating price={price_per_night} rating={rating} />
          {/* DATE INPUT */}
          <div
            onClick={() => setOpen(true)}
            className="border border-gray-300 rounded-xl mt-4 overflow-hidden"
          >
            <div className="grid grid-cols-2">
              <div className="p-4 border-r border-gray-300">
                <p className="text-xs text-gray-400">CHECK-IN</p>
                <p className="font-medium text-lg">
                  {range?.from
                    ? format(range.from, "MMM dd, yyyy")
                    : "Add date"}
                </p>
              </div>

              <div className="p-4">
                <p className="text-xs text-gray-400">CHECK-OUT</p>
                <p className="font-medium text-lg">
                  {range?.to ? format(range.to, "MMM dd, yyyy") : "Add date"}
                </p>
              </div>
            </div>
          </div>
          {/* CALENDAR */}
          {open && (
            <div className="relative ">
              <div className="absolute z-20 mt-2 left-1/2 -translate-x-1/2 bg-white shadow-xl rounded-xl p-4 border border-gray-200">
                <DayPicker
                  mode="range"
                  selected={range}
                  onSelect={(value) => {
                    setRange(value);

                    if (value?.from && value?.to) {
                      const nights =
                        (value.to.getTime() - value.from.getTime()) /
                        (1000 * 60 * 60 * 24);

                      if (nights < 1) {
                        setRange({ from: value.from, to: undefined });
                        return;
                      }

                      setOpen(false);
                    }
                  }}
                  numberOfMonths={1}
                  className="text-sm flex justify-center"
                />
              </div>
            </div>
          )}
          {/* GUEST DROP DOWN */}
          <RoomDropDown
            options={["1 Guest", "2 Guests", "3 Guests", "4 Guests"]}
            onChange={(val) => setGuests(val)}
          />
          <ReservationForm
            createBooking={createBooking}
            id={id}
            price_per_night={price_per_night}
            range={range}
            nights={nights}
            guests={guests}
          />
          <p className="text-center text-sm text-gray-400 mt-2">
            You won&apos;t be charged yet
          </p>
          {/* PRICE DETAIL */}
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
