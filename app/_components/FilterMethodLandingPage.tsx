"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoCameraOutline, IoLocationOutline } from "react-icons/io5";
import { PiCurrencyCircleDollarLight } from "react-icons/pi";
import DropDownFilterMain from "./DropDownFilterRoot";

const dataTypeHotel = [
  {
    key: "location",
    label: "Location",
    icon: <IoLocationOutline />,
    options: [
      "Bogor, Jawa Barat",
      "Bali, Indonesia",
      "Yogyakarta, Indonesia",
      "Bandung, Indonesia",
      "Jakarta, Indonesia",
      "All",
    ],
  },
  {
    key: "type",
    label: "Type",
    icon: <IoCameraOutline />,
    options: ["hotel", "villa", "resort", "All"],
  },
  {
    key: "price",
    label: "Price",
    icon: <PiCurrencyCircleDollarLight />,
    options: ["Budget", "Mid-range", "Luxury", "All"],
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
    location: "All",
    type: "All",
    price: "All",
  });

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (filters.location !== "All") params.set("location", filters.location);
    if (filters.type !== "All") params.set("type", filters.type);
    if (filters.price !== "All") params.set("price", filters.price);

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
            Search Hotel
          </button>
        </div>
      </div>
    </section>
  );
}
