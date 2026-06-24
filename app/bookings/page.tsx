import { IoSearch } from "react-icons/io5";
import PropertiesList from "../_components/PropertiesList";
import { Suspense } from "react";
import Spinner from "../_components/Spinner";
import {
  getFilteredProperties,
  getBookedRangesForRooms,
} from "../_lib/data-services";
import { dataTypeProperties } from "../_lib/dataTypeProperties";
import NavCabins2 from "../_components/NavCabins2";
import PaginationBookingPage from "../_components/PaginationBooking";
import FooterBooking from "../_components/FooterBooking";


export const metadata = {
  title: "Bookings",
  description:
    "Browse and book hotels across Indonesia. Compare prices, filter by location, and find the best Properties deals easily.",
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    location?: string;
    type?: string;
    price?: string;
    page?: string;
  }>;
}) {
  const { location, type, price, page } = await searchParams;

  // console.log("searchParams:", { location, type, price });

  const city = location?.split(",")[0]?.trim();

  const dataProperties = await getFilteredProperties({
    location: city,
    type,
    price,
  });

  const allRoomIds = dataProperties
    .flatMap((p) => p.rooms.map((r) => r.id.toString()))
    .filter(Boolean);
  const bookedRanges = await getBookedRangesForRooms(allRoomIds);
  const bookedRoomIds = new Set(bookedRanges.map((b) => b.room_id));

  const enrichedProperties = dataProperties.map((prop) => {
    const roomIds = prop.rooms.map((r) => r.id.toString());
    const activeBookings = bookedRanges.filter((b) =>
      roomIds.includes(b.room_id),
    );
    const bookedUntil = activeBookings.length > 0
      ? activeBookings.reduce((latest, curr) =>
          curr.end_date > latest.end_date ? curr : latest,
        ).end_date
      : undefined;
    return {
      ...prop,
      isBooked: roomIds.some((id) => bookedRoomIds.has(id)),
      bookedUntil,
    };
  });

  const perPage = 6;

  const currentPage = Number(page ?? 1);
  const totalPages = Math.max(1, Math.ceil(enrichedProperties.length / perPage));

  const paginatedProperties = enrichedProperties.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );
  return (
    <main className="min-h-screen w-full relative">
      <section className="w-full max-w-6xl mx-auto mt-4 sm:mt-12 mb-6 sm:mb-10 px-2 sm:px-6 relative h-24 sm:h-20">
        <div className="flex items-center w-full h-full bg-white border-gray-200 rounded-2xl shadow-sm divide-gray-200">
          {/* {dataTypeProperties.map((item, index) => (
            <NavCabins
              key={item.label}
              label={item.label}
              options={item.options}
              isLast={index === dataTypeProperties.length - 1}
            />
          ))} */}
          {dataTypeProperties.map((item, index) => (
            <NavCabins2
              key={item.label}
              label={item.label}
              options={item.options}
              paramKey={
                item.label === "Lokasi"
                  ? "location"
                  : item.label === "Rentang Harga"
                    ? "price"
                    : "type"
              }
              // fallbackValue={
              //   item.label === "Location"
              //     ? "Bogor, Jawa Barat"
              //     : item.label === "Budget Range"
              //       ? "Low Budget"
              //       : "Hotel"
              // }
              isLast={index === dataTypeProperties.length - 1}
            />
          ))}
          <div className="px-2 sm:px-6">
            <button className="flex items-center justify-center w-10 sm:w-12 h-12 rounded-xl bg-orange-600 text-white hover:bg-[##a67f71] transition">
              <IoSearch size={20} />
            </button>
          </div>
        </div>
      </section>
      <hr className="w-min-h-screen w-full lg:max-w-[1750px] mx-auto text-gray-200" />
      <section className="w-full lg:max-w-[1750px] mx-auto mt-10 mb-10">
        <div className="flex flex-row items-center justify-between mx-2 sm:mx-0">
          <h2 className="font-bold text-lg sm:text-xl">
            Properties In Indonesia
          </h2>
          <p className="font-extralight text-xs text-gray-400">
            {enrichedProperties.length} properties found
          </p>
        </div>

        <div className="grid gap-6 mt-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Suspense fallback={<Spinner />}>
            <PropertiesList properties={paginatedProperties} />
          </Suspense>
        </div>
      </section>
      <PaginationBookingPage
        currentPage={currentPage}
        totalPages={totalPages}
        searchParams={{ location, type, price }}
      />
      <div className="mt-10 h-20 sm:h-10"></div>
      <FooterBooking />
    </main>
  );
}
