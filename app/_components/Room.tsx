"use client";

import Image from "next/image";
import { Room } from "../_lib/type";
import { useEffect, useState } from "react";
import { IoLocationSharp } from "react-icons/io5";
import { IoStar } from "react-icons/io5";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import RoomDropDown from "./roomDropDown";
import { formatRupiah } from "../_lib/currency";
import ImageCarouselRoomDetail from "./ImageCarouselRoomDetail";

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

  const mainImage = images[0]?.image_url;
  const img1 = images[1]?.image_url;
  const img2 = images[2]?.image_url;
  const img3 = images[3]?.image_url;
  const img4 = images[4]?.image_url;

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
    <div className="min-h-screen w-full mt-40 overflow-hidden">
      {/* ================= MOBILE (EMBLA) ================= */}
      <ImageCarouselRoomDetail images={images} />

      <section className="hidden w-full max-w-[1320px] mx-auto px-6 relative h-[60vh] md:grid grid-cols-2 gap-2 overflow-hidden">
        <div className="relative">
          <Image
            src={mainImage ?? ""}
            alt={title ?? ""}
            fill
            className="object-cover rounded-tl-4xl rounded-bl-4xl"
          />
        </div>

        <div className="grid grid-cols-2 grid-rows-2 gap-1">
          <div className="relative">
            <Image src={img1 ?? ""} alt="" fill className="object-cover" />
          </div>

          <div className="relative">
            <Image
              src={img2 ?? ""}
              alt=""
              fill
              className="object-cover rounded-tr-4xl"
            />
          </div>

          <div className="relative">
            <Image src={img3 ?? ""} alt="" fill className="object-cover " />
          </div>

          <div className="relative">
            <Image
              src={img4 ?? ""}
              alt=""
              fill
              className="object-cover rounded-br-4xl"
            />
          </div>
        </div>
      </section>

      <section
        className="w-full max-w-[1320px] bg-white border-white rounde
      d-t-2xl mx-auto mt-6 px-6 grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-6"
      >
        <header className="flex gap-2 flex-col">
          <h1 className="text-4xl font-semibold">{title}</h1>
          <p className="text-sm text-gray-400 flex flex-row items-center gap-1">
            <IoLocationSharp size={18} /> {province}, {city}, Indonesia
          </p>

          <div className="flex flex-row gap-4">
            <div className="flex items-center gap-2 border border-[#a67f71] bg-gray-100 px-4 py-1 rounded-lg">
              <IoStar size={20} className="text-[#a67f71]" />
              <span className="text-lg font-semibold">{rating}</span>
              <span className="text-sm text-gray-500">
                ({review_count} reviews)
              </span>
            </div>

            <div className="flex items-center gap-2 border border-gray-200 bg-blue-50 px-4 py-1 rounded-lg">
              <span className="text-base font-sans font-semibold tracking-wide">
                {name}
              </span>
            </div>
          </div>
          <p className="text-base text-gray-600 w-full md:w-[80%] text-pretty">
            {description_full}
          </p>
        </header>

        <div className="shadow-lg w-full rounded-2xl px-4 py-4 border border-gray-200 sticky h-fit bg-white">
          {/* <div className="shadow-lg w-full rounded-2xl px-4 py-4 border border-gray-200 sticky top-20 h-fit bg-white"> */}
          {/* PRICE */}
          <div className="flex justify-between items-center px-2">
            <p className="font-semibold text-2xl">
              {formatRupiah(price_per_night)}
              <span className="text-gray-400 font-light text-lg">/ night</span>
            </p>

            <div className="flex items-center gap-1 text-sm">
              <IoStar className="text-[#a67f71]" />
              <span>{rating}</span>
            </div>
          </div>
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
          <button className="w-full text-2xl bg-[#a67f71] text-white py-3 rounded-xl mt-4 font-semibold hover:opacity-90 transition">
            Reserve Now
          </button>
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
