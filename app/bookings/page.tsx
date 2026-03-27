import { IoSearch } from "react-icons/io5";
import NavCabins from "../_components/NavCabins";
import FilterFeaturesProperties from "../_components/FilterFeaturesProperties";
import { FaWifi } from "react-icons/fa6";
import { MdFoodBank } from "react-icons/md";
import { MdPool } from "react-icons/md";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { BsCurrencyDollar } from "react-icons/bs";
import { properties } from "../_lib/data-services";
import Card from "../_components/Card";

export const metadata = {
  title: "cabins",
};
const dataTypeHotel = [
  {
    label: "Location",
    options: [
      "Bogor, Jawa Barat",
      "Bali, Indonesia",
      "Yogyakarta, Indonesia",
      "Bandung, Indonesia",
      "Jakarta, Indonesia",
    ],
  },

  {
    label: "Guest",
    options: ["2", "4", "6"],
  },
  {
    label: "Property Type",
    options: ["Hotel", "Villa", "Resort"],
  },
];
const ratingOptions = ["All", "1", "2", "3", "4", "5"];

export default async function Bookings() {
  const dataProperties = await properties();
  // console.log(dataProperties);
  return (
    <main className="min-h-screen w-full">
      <section className="max-w-6xl mx-auto mt-12 px-6 relative h-20">
        <div className="flex items-center w-full  bg-white border-gray-200 rounded-2xl shadow-sm divide-gray-200 h-full">
          {dataTypeHotel.map((item, index) => (
            <NavCabins
              key={item.label}
              label={item.label}
              options={item.options}
              isLast={index === dataTypeHotel.length - 1}
            />
          ))}
          {/* Search button */}
          <div className="px-6 col-span-2">
            <button className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-600 text-white hover:bg-[##a67f71] transition">
              <IoSearch size={20} />
            </button>
          </div>
        </div>
      </section>

      {/*===== FILTER FEATURES PROPERTIES START =======  */}
      <section className="w-full max-w-7xl mx-auto h-20 mt-10 relative">
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
              Sort by:{" "}
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
      {/*===== FILTER FEATURES PROPERTIES END =======  */}

      <hr className="w-min-h-screen w-full max-w-7xl mx-auto text-gray-200" />
      <section className="h-screen w-full max-w-7xl mx-auto mt-10 ">
        <div className="flex flex-row items-center justify-between">
          <h2 className="font-bold text-xl">Properties In Indonesia</h2>
          <p className="font-extralight text-sm text-gray-400">
            {dataProperties.length} properties found
          </p>
        </div>
        <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-4 mt-4">
          {/* <div className="bg-white col-span-1 row-span-1 rounded-2xl shadow-md"></div>
          <div className="bg-amber-200 col-span-1 row-span-1"></div>
          <div className="bg-amber-600 col-span-1 row-span-1"></div>
          <div className="bg-blue-400 col-span-1 row-span-1"></div>
          <div className="bg-gray-600 col-span-1 row-span-1"></div>
          <div className="bg-green-600 col-span-1 row-span-1"></div> */}
          {dataProperties.slice(0, 6).map((properti) => (
            <Card property={properti} key={properti.id} />
          ))}
        </div>
      </section>
    </main>
  );
}
