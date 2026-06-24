import { formatRupiah } from "../_lib/currency";

export default function PricePerNightAndRating({
  price,
}: {
  price: number;
}) {
  return (
    <div>
      <p className="font-bold text-2xl text-gray-900">
        {formatRupiah(price)}
        <span className="text-gray-400 font-normal text-base"> / night</span>
      </p>
    </div>
  );
}
