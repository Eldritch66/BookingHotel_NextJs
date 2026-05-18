import { formatRupiah } from "../_lib/currency";

export default function PricePerNightAndRating({
  price,
  isAvailable,
}: {
  price: number;
  isAvailable: string;
}) {
  return (
    <div className="flex justify-between items-center px-2">
      <p className="font-semibold text-2xl">
        {formatRupiah(price)}
        <span className="text-gray-400 font-light text-lg">/ night</span>
      </p>

      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isAvailable === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {isAvailable === 'available' ? 'Available' : 'Unavailable'}
      </span>
    </div>
  );
}
