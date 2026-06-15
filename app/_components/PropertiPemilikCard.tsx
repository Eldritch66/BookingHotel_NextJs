"use client";

import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { Home, User, ExternalLink } from "lucide-react";
import { PropertiPemilik } from "../_lib/type";
import { formatRupiah } from "../_lib/currency";
import HapusPropertiButton from "./HapusPropertiButton";

export default function PropertiPemilikCard({
  properti,
}: {
  properti: PropertiPemilik;
}) {
  const isActive = properti.status === "aktif";

  return (
    <div className="flex flex-col border border-stone-200">
      <div className="flex">
        <div className="relative h-28 sm:h-32 aspect-square shrink-0 bg-stone-100">
          {properti.foto_url ? (
            <Image
              src={properti.foto_url}
              alt={properti.nama_properti}
              fill
              className="object-cover border-r border-stone-200"
              sizes="132px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center border-r border-stone-200">
              <Home size={32} className="text-stone-300" />
            </div>
          )}
        </div>

        <div className="flex flex-1 min-w-0">
          <div className="flex flex-col justify-center gap-1.5 px-3 sm:px-6 py-3 flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-base sm:text-xl font-semibold text-stone-900 truncate">
                  {properti.nama_properti}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500">
                  {properti.tipe} &middot; {properti.kota} &middot; {formatRupiah(properti.harga_per_bulan)}/bln
                </p>
              </div>
              <div className="flex flex-col items-end shrink-0">
                {isActive ? (
                  <span className="bg-green-800 text-green-200 h-6 px-2 sm:h-7 sm:px-3 uppercase text-[10px] sm:text-xs font-bold flex items-center">
                    Aktif
                  </span>
                ) : (
                  <span className="bg-stone-200 text-stone-500 h-6 px-2 sm:h-7 sm:px-3 uppercase text-[10px] sm:text-xs font-bold flex items-center">
                    Kosong
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-stone-100 pt-2">
              {isActive && properti.penyewa_nama ? (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-sm text-stone-700 min-w-0">
                    <User size={14} className="shrink-0 text-stone-400" />
                    <span className="font-medium truncate">{properti.penyewa_nama}</span>
                    {properti.penyewa_email && (
                      <span className="text-stone-400 text-xs shrink-0">({properti.penyewa_email})</span>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-0.5 shrink-0">
                    {properti.tanggal_mulai && (
                      <span className="text-[11px] sm:text-xs text-stone-500 text-right leading-tight">
                        {format(parseISO(properti.tanggal_mulai), "dd MMM yyyy", { locale: id })}
                        {properti.tanggal_selesai
                          ? ` — ${format(parseISO(properti.tanggal_selesai), "dd MMM yyyy", { locale: id })}`
                          : ""}
                      </span>
                    )}
                    <span className="text-[11px] sm:text-xs font-semibold text-stone-800">
                      {properti.durasi_bulan && `${properti.durasi_bulan} bulan`}
                      {properti.durasi_bulan && properti.total_harga && " · "}
                      {properti.total_harga && formatRupiah(properti.total_harga)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-stone-400">Belum ada penyewa</p>
              )}
            </div>
          </div>
        </div>

        <div className="hidden sm:flex flex-col border-l border-stone-200 w-[100px] shrink-0">
          <Link
            href={`/account/pemilik/properti/${properti.id}`}
            className="group flex items-center justify-center gap-2 uppercase text-xs font-bold text-stone-500 border-b border-stone-200 flex-1 px-3 hover:bg-stone-100 transition-colors"
          >
            <ExternalLink size={14} className="shrink-0" />
            <span>Detail</span>
          </Link>
          <HapusPropertiButton propertiId={properti.id} />
        </div>
      </div>

      <div className="flex sm:hidden border-t border-stone-200">
        <Link
          href={`/account/pemilik/properti/${properti.id}`}
          className="group flex items-center justify-center gap-2 flex-1 uppercase text-xs font-bold text-stone-500 border-r border-stone-200 py-2.5 hover:bg-stone-100 transition-colors"
        >
          <ExternalLink size={14} />
          <span>Detail</span>
        </Link>
        <HapusPropertiButton propertiId={properti.id} />
      </div>
    </div>
  );
}
