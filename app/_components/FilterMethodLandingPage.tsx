"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoCameraOutline, IoLocationOutline } from "react-icons/io5";
import { PiCurrencyCircleDollarLight } from "react-icons/pi";
import DropDownFilterMain from "./DropDownFilterRoot";

const dataTypeHotel = [
  {
    key: "location",
    label: "Lokasi",
    icon: <IoLocationOutline />,
    options: [
      "Bogor, Jawa Barat",
      "Bali, Indonesia",
      "Yogyakarta, Indonesia",
      "Bandung, Indonesia",
      "Jakarta, Indonesia",
      "Semua",
    ],
  },
  {
    key: "type",
    label: "Tipe",
    icon: <IoCameraOutline />,
    options: ["Hotel", "Villa", "Resort", "Semua"],
  },
  {
    key: "price",
    label: "Harga",
    icon: <PiCurrencyCircleDollarLight />,
    options: ["Ekonomis", "Menengah", "Mewah", "Semua"],
  },
] as const;

type FilterState = {
  location: string;
  type: string;
  price: string;
};

export default function FilterMethodLandingPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>({
    location: "Semua",
    type: "Semua",
    price: "Semua",
  });

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (filters.location !== "Semua") params.set("location", filters.location);
    if (filters.type !== "Semua") params.set("type", filters.type);
    if (filters.price !== "Semua") params.set("price", filters.price);

    router.push(`/bookings?${params.toString()}`);
  };

  return (
    <section className="flex justify-start w-full h-full shadow-xl">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center gap-4 px-4 py-6 w-full">
        {dataTypeHotel.map((item) => (
          <div
            key={item.label}
            className="flex flex-col gap-2 w-full md:w-auto"
          >
            <span className="font-light">{item.label}</span>
            <div className="w-full md:w-auto">
              <DropDownFilterMain
                icon={item.icon}
                options={item.options}
                value={filters[item.key]}
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    [item.key]: value,
                  }))
                }
              />
            </div>
          </div>
        ))}

        <div className="flex flex-col gap-2 w-full md:w-auto">
          <span className="opacity-0 hidden md:block">Label</span>
          <button
            onClick={handleSearch}
            className="h-12 px-6 rounded-md bg-black text-white cursor-pointer w-full md:w-auto"
          >
            Cari Hotel
          </button>
        </div>
      </div>
    </section>
  );
}
