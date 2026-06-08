import { formatRupiah } from "../_lib/currency";

export default function PricePerNightAndRating({
  price,
}: {
  price: number;
}) {
  return (
    <div className="flex justify-between items-center px-2">
      <p className="font-semibold text-2xl">
        {formatRupiah(price)}
        <span className="text-gray-400 font-light text-lg">/ 2 bulan</span>
      </p>
    </div>
  );
}
