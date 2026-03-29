import Image from "next/image";
import { Property } from "../_lib/type";
import { FaHeart } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import { IoLocationSharp } from "react-icons/io5";
import { formatRupiah } from "../_lib/currency";
import Link from "next/link";

export default function Card({ property }: { property: Property }) {
  const image = property.property_images?.[0]?.image_url;
  const typeProperty = property.rooms?.[0]?.name;
  // console.log(property.id, property.rooms);
  return (
    <div className="bg-white col-span-1 row-span-1 rounded-2xl shadow-md grid grid-rows-2">
      <div className="row-span-1 relative">
        <Image
          src={image}
          alt=""
          fill
          className="object-cover rounded-tr-2xl rounded-tl-2xl"
        />
        <span className="absolute top-4 left-4 text-white uppercase text-xs font-extralight bg-orange-600 p-1.5 rounded-lg">
          {typeProperty}
        </span>
        <div className="absolute top-4 right-4 p-1.5 bg-gray-200 rounded-full flex items-center justify-center">
          <FaHeart size={22} />
        </div>
      </div>
      <div className="row-span-1 p-6 flex flex-col justify-between">
        {/* <div className="flex flex-col gap-3"> */}
        <div className="flex flex-row justify-between items-center">
          <h2 className="font-semibold">{property.title}</h2>
          <p className="flex flex-row items-center gap-1">
            <IoStar size={22} className="text-orange-600" />
            <span className="text-sm leading-none font-semibold">
              {property.rating}
            </span>
          </p>
        </div>
        {/* </div> */}
        <p className="text-xs text-gray-500 flex flex-row items-center gap-1 mt-4 mb-4 text-center">
          <IoLocationSharp size={16} />
          <span>
            {property.province}, {property.city}
          </span>
        </p>
        <p className="text-sm text-gray-500 leading-relaxed tracking-tight">
          {property.description}
        </p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-orange-600">
            <span className="font-semibold text-lg sm:text-xl">
              {formatRupiah(property.price_per_night)}
            </span>
            <span className="text-gray-400 text-sm"> /night</span>
          </p>

          <Link href={`/bookings/${property.id}`}>
            <button className="bg-black text-white px-4 py-2 rounded-xl text-sm cursor-pointer">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
