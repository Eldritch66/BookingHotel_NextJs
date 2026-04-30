import { IoStar } from "react-icons/io5";
import { formatRupiah } from "../_lib/currency";

export default function PricePerNightAndRating({
  price,
  rating,
}: {
  price: number;
  rating: number;
}) {
  return (
    <div className="flex justify-between items-center px-2">
      <p className="font-semibold text-2xl">
        {formatRupiah(price)}
        <span className="text-gray-400 font-light text-lg">/ night</span>
      </p>

      <div className="flex items-center gap-1 text-sm">
        <IoStar className="text-[#a67f71]" />
        <span>{rating}</span>
      </div>
    </div>
  );
}
