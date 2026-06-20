import Image from "next/image";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import { format, parseISO } from "date-fns";
import { Sewa } from "../_lib/type";
import { formatRupiah } from "../_lib/currency";
import HapusSewa from "./HapusSewa";
import { Home } from "lucide-react";

function SewaCard({ sewa }: { sewa: Sewa }) {
  const {
    id,
    tanggal_mulai,
    tanggal_selesai,
    durasi_bulan,
    total_harga,
    properti_title,
    properti_image,
    status,
  } = sewa;

  const isActive = status === "aktif" || status === "pending";
  const endDate = parseISO(tanggal_selesai);
  const isExpired = endDate < new Date();
  const isHapusEnabled = status === "dibatalkan" || isExpired;

  return (
    <div className="flex flex-col border border-primary-800">
      <div className="flex items-center">
        <div className="relative h-28 sm:h-32 aspect-square flex-shrink-0 overflow-hidden bg-stone-100">
          {properti_image ? (
            <Image
              src={properti_image}
              alt={properti_title || "Properti"}
              quality={40}
              fill
              className="object-cover border-r border-primary-800"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Home size={32} className="text-stone-300" />
            </div>
          )}
        </div>

        <div className="flex-grow px-3 sm:px-6 py-3 flex flex-col min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base sm:text-xl font-semibold leading-snug">
              {durasi_bulan} bulan di {properti_title}
            </h3>
            {status === "aktif" ? (
              <span className="bg-green-800 text-green-200 h-6 px-2 sm:h-7 sm:px-3 uppercase text-[10px] sm:text-xs font-bold flex items-center rounded-sm flex-shrink-0">
                Aktif
              </span>
            ) : status === "pending" ? (
              <span className="bg-yellow-200 text-yellow-800 h-6 px-2 sm:h-7 sm:px-3 uppercase text-[10px] sm:text-xs font-bold flex items-center rounded-sm flex-shrink-0">
                Pending
              </span>
            ) : (
              <span className="bg-red-800 text-red-200 h-6 px-2 sm:h-7 sm:px-3 uppercase text-[10px] sm:text-xs font-bold flex items-center rounded-sm flex-shrink-0">
                Dibatalkan
              </span>
            )}
          </div>

          <p className="text-xs sm:text-lg text-primary-300 mt-1 leading-snug">
            {format(parseISO(tanggal_mulai), "MMM yyyy")} &mdash;{" "}
            {format(parseISO(tanggal_selesai), "MMM yyyy")}
          </p>

          <div className="flex gap-3 mt-auto items-baseline pt-2">
            <p className="text-base sm:text-xl font-semibold text-accent-400">
              {formatRupiah(total_harga)}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex flex-col border-l border-primary-800 w-[100px]">
          {isActive && (
            <Link
              href={`/account/sewa/${id}`}
              className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 border-b border-primary-800 flex-grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900"
            >
              <FiExternalLink className="h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-colors" />
              <span className="my-2">Detail</span>
            </Link>
          )}
          <div className="mt-1.5"></div>
          <HapusSewa sewaId={id} isEnabled={isHapusEnabled} />
        </div>
      </div>

      <div className="flex sm:hidden border-t border-primary-800">
        {isActive && (
          <Link
            href={`/account/sewa/${id}`}
            className="group flex items-center justify-center gap-2 flex-1 uppercase text-xs font-bold text-primary-300 border-r border-primary-800 py-2.5 hover:bg-accent-600 transition-colors hover:text-primary-900"
          >
            <FiExternalLink className="h-4 w-4 text-primary-600 group-hover:text-primary-800 transition-colors" />
            <span>Detail</span>
          </Link>
        )}
        <div
          className={`${isActive ? "flex-1" : "w-full"} flex [&>*]:flex-1 [&>*]:flex [&>*]:items-center [&>*]:justify-center`}
        >
          <HapusSewa sewaId={id} isEnabled={isHapusEnabled} />
        </div>
      </div>
    </div>
  );
}

export default SewaCard;
