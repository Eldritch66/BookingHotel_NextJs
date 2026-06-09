import Image from "next/image";
import Link from "next/link";
import { Property } from "../_lib/type";
import { formatRupiah } from "../_lib/currency";

export default function LandingCard({ property }: { property: Property }) {
  const image = property.property_images?.[0]?.image_url;

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md">
      <div className="relative aspect-[3/2] w-full overflow-hidden">
        <Image
          src={image}
          alt={property.title}
          fill
          quality={75}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover ${property.isOccupied ? "opacity-60" : ""}`}
        />
        {property.isOccupied && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-semibold tracking-wide text-white shadow-lg">
              Terisi
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h2 className="line-clamp-1 text-lg font-semibold text-neutral-900">
          {property.title}
        </h2>

        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-orange-600">
            <span className="text-lg font-semibold">
              {formatRupiah(property.price_per_two_months)}
            </span>
            <span className="text-sm text-neutral-400"> / 2 bulan</span>
          </p>

          <Link href={`/properti/${property.id}`}>
            <button className="cursor-pointer rounded-xl bg-black px-4 py-2 text-sm text-white transition hover:bg-neutral-800">
              Lihat Detail
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
