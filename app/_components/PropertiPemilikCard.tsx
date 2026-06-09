"use client";

import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { Home, User, Calendar, DollarSign, ExternalLink } from "lucide-react";
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
    <div className="rounded-xl border border-stone-200 bg-white overflow-hidden shadow-sm">
      <div className="flex">
        <div className="relative h-[132px] w-[132px] shrink-0 overflow-hidden bg-stone-100">
          {properti.foto_url ? (
            <Image
              src={properti.foto_url}
              alt={properti.nama_properti}
              fill
              className="object-cover"
              sizes="132px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Home size={32} className="text-stone-300" />
            </div>
          )}
        </div>

        <div className="flex flex-1 min-w-0">
          <div className="flex flex-col justify-center gap-1.5 px-4 sm:px-5 py-3 flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-stone-900 truncate">
                  {properti.nama_properti}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500">
                  {properti.tipe} &middot; {properti.kota} &middot; {formatRupiah(properti.harga_per_bulan)}/bln
                </p>
              </div>
              {isActive ? (
                <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap shrink-0 mt-0.5">
                  Aktif
                </span>
              ) : (
                <span className="bg-stone-100 text-stone-400 px-2.5 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap shrink-0 mt-0.5">
                  Kosong
                </span>
              )}
            </div>

            {isActive && properti.penyewa_nama ? (
              <>
                <div className="mt-1.5 border-t border-stone-100 pt-2 space-y-1">
                  <div className="flex items-center gap-1.5 text-sm text-stone-700">
                    <User size={14} className="shrink-0 text-stone-400" />
                    <span className="font-medium">{properti.penyewa_nama}</span>
                    {properti.penyewa_email && (
                      <span className="text-stone-400 text-xs">({properti.penyewa_email})</span>
                    )}
                  </div>

                  {properti.tanggal_mulai && (
                    <div className="flex items-center gap-1.5 text-sm text-stone-500">
                      <Calendar size={14} className="shrink-0 text-stone-400" />
                      <span>
                        {format(parseISO(properti.tanggal_mulai), "dd MMM yyyy", { locale: id })}
                        {properti.tanggal_selesai
                          ? ` — ${format(parseISO(properti.tanggal_selesai), "dd MMM yyyy", { locale: id })}`
                          : ""}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-sm">
                    {properti.durasi_bulan && (
                      <span className="text-stone-500">{properti.durasi_bulan} bulan</span>
                    )}
                    {properti.total_harga && (
                      <span className="flex items-center gap-1 font-semibold text-stone-800">
                        <DollarSign size={13} className="text-stone-400" />
                        {formatRupiah(properti.total_harga)}
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-1.5 border-t border-stone-100 pt-2">
                <p className="text-sm text-stone-400">Belum ada penyewa</p>
              </div>
            )}
          </div>

          <div className="hidden sm:flex flex-col border-l border-stone-200 shrink-0">
            <Link
              href={`/account/pemilik/properti/${properti.id}`}
              className="flex items-center justify-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-800 hover:bg-stone-50 px-3 py-2 border-b border-stone-200 flex-1 transition"
            >
              <ExternalLink size={14} />
              Detail
            </Link>
            <HapusPropertiButton propertiId={properti.id} />
          </div>
        </div>
      </div>

      <div className="flex sm:hidden border-t border-stone-200">
        <Link
          href={`/account/pemilik/properti/${properti.id}`}
          className="flex items-center justify-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-800 flex-1 py-2.5 border-r border-stone-200 transition"
        >
          <ExternalLink size={14} />
          Detail
        </Link>
        <HapusPropertiButton propertiId={properti.id} />
      </div>
    </div>
  );
}
