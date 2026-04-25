import { IoSearch } from "react-icons/io5";
import FilterFeaturesProperties from "../_components/FilterFeaturesProperties";
import { FaWifi } from "react-icons/fa6";
import { MdFoodBank } from "react-icons/md";
import { MdPool } from "react-icons/md";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { BsCurrencyDollar } from "react-icons/bs";
import PropertiesList from "../_components/PropertiesList";
import { Suspense } from "react";
import Spinner from "../_components/Spinner";
import { getFilteredProperties } from "../_lib/data-services";
import { dataTypeProperties } from "../_lib/dataTypeProperties";
import NavCabins2 from "../_components/NavCabins2";
import MyPagination from "@/components/paginationBooking";

export const metadata = {
  title: "cabins",
};

const ratingOptions = ["All", "1", "2", "3", "4", "5"];

export default async function Bookings({
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

  const perPage = 6;

  const currentPage = Number(page ?? 1);
  const totalPages = Math.max(1, Math.ceil(dataProperties.length / perPage));

  const paginatedProperties = dataProperties.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );
  return (
    <main className="min-h-screen w-full">
      <section className="w-full max-w-6xl mx-auto mt-4 sm:mt-12 px-2 sm:px-6 relative h-24 sm:h-20">
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
                item.label === "Location"
                  ? "location"
                  : item.label === "Budget Range"
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
      <section className="hidden md:flex w-full lg:max-w-[1750px] mx-auto h-20 mt-10 relative">
        <form className="flex items-center gap-3">
          <FilterFeaturesProperties
            icon={<BsCurrencyDollar size="16" />}
            label="Price Range"
            options={["All", "400", "600", "1000", "1200"]}
          />

          <FilterFeaturesProperties
            icon={<MdOutlineStarPurple500 size="16" />}
            label="Rating"
            options={ratingOptions}
          />

          <label className="ml-6 flex items-center justify-center gap-2 relative w-20 border border-gray-200 rounded-xl shadow-sm h-10">
            <input
              type="checkbox"
              className="h-6 w-full absolute z-10 appearance-none cursor-pointer"
            />
            <FaWifi size={16} />
            <span className="text-sm -ml-1">Wifi</span>
          </label>

          <label className="flex items-center justify-center gap-2 relative w-20 border border-gray-200 rounded-xl shadow-sm h-10">
            <input
              type="checkbox"
              className="h-6 w-full absolute z-10 appearance-none cursor-pointer"
            />
            <MdPool size={16} />
            <span className="text-sm -ml-1">Pool</span>
          </label>

          <label className="flex items-center justify-center gap-2 relative w-24 border border-gray-200 rounded-xl shadow-sm h-10">
            <input
              type="checkbox"
              className="h-6 w-full absolute z-10 appearance-none"
            />
            <MdFoodBank size={16} />
            <span className="z-20 text-sm -ml-1">Breakfast</span>
          </label>

          <label className="absolute right-0 flex flex-row items-center gap-6">
            <span className="text-gray-400 text-base tracking-tighter">
              Sort by:
            </span>
            <FilterFeaturesProperties
              label="Recomended"
              options={[
                "Recommended",
                "Highest Rating",
                "Lowest Price",
                "Highest Price",
                "Most Popular",
              ]}
            />
          </label>
        </form>
      </section>
      <hr className="w-min-h-screen w-full lg:max-w-[1750px] mx-auto text-gray-200" />
      <section className="w-full lg:max-w-[1750px] mx-auto mt-10 mb-10">
        <div className="flex flex-row items-center justify-between">
          <h2 className="font-bold text-xl">Properties In Indonesia</h2>
          <p className="font-extralight text-sm text-gray-400">
            {dataProperties.length} properties found
          </p>
        </div>

        <div className="grid gap-6 mt-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Suspense fallback={<Spinner />}>
            <PropertiesList properties={paginatedProperties} />
          </Suspense>
        </div>
      </section>
      <MyPagination
        currentPage={currentPage}
        totalPages={totalPages}
        searchParams={{ location, type, price }}
      />{" "}
    </main>
  );
}
