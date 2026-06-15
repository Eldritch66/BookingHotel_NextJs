"use client";

import { Property } from "../_lib/type";
import { useState } from "react";
import { format, addMonths } from "date-fns";
import { formatRupiah } from "../_lib/currency";
import { buatPemesanan } from "../_lib/action";
import FormPemesanan from "./FormPemesanan";
import { MapPin, Home, Tag, User, Minus, Plus, Ruler, Bed, Bath, Users, Building2 } from "lucide-react";
import Image from "next/image";

export default function PropertyDetail({
  property,
  isTersedia = true,
  isPemilik = false,
}: {
  property: Property;
  isTersedia?: boolean;
  isPemilik?: boolean;
}) {
  const [months, setMonths] = useState(2);

  const {
    title,
    price_per_month,
    price_per_two_months,
    city,
    province,
    address,
    type,
    owner_name,
    property_images,
    unit,
  } = property;

  const heroImage = property_images?.[0]?.image_url ?? null;

  const today = new Date();
  const wibDate = new Date(today.getTime() + (today.getTimezoneOffset() + 420) * 60000);
  const startDate = wibDate;
  const endDate = addMonths(startDate, months);

  const extraMonths = Math.max(0, months - 2);
  const total = price_per_two_months + extraMonths * price_per_month;
  const service = 25000;
  const tax = Math.ceil(total * 0.1);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-[1750px] px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr] lg:items-start">
          {/* LEFT COLUMN: Image + Unit Info */}
          <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-sm h-[clamp(360px,72vh,760px)]">
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt={title}
                  fill
                  quality={85}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-center"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-stone-400">
                  <div className="flex flex-col items-center gap-3">
                    <Home size={40} strokeWidth={1.5} />
                    <span className="text-sm font-medium uppercase tracking-[0.18em]">
                      Foto tidak tersedia
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Unit Info */}
            {unit && (
              <div className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400 mb-4">
                  Spesifikasi Unit
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {unit.luas_bangunan && (
                    <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-stone-50 px-3 py-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                        <Ruler size={15} className="text-stone-500" />
                      </div>
                      <span className="text-sm font-semibold text-stone-800">
                        {unit.luas_bangunan} m²
                      </span>
                      <span className="text-[10px] text-stone-400 uppercase tracking-wide">
                        Luas
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-stone-50 px-3 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                      <Bed size={15} className="text-stone-500" />
                    </div>
                    <span className="text-sm font-semibold text-stone-800">
                      {unit.jumlah_kamar_tidur}
                    </span>
                    <span className="text-[10px] text-stone-400 uppercase tracking-wide">
                      Kamar Tidur
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-stone-50 px-3 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                      <Bath size={15} className="text-stone-500" />
                    </div>
                    <span className="text-sm font-semibold text-stone-800">
                      {unit.jumlah_kamar_mandi}
                    </span>
                    <span className="text-[10px] text-stone-400 uppercase tracking-wide">
                      Kamar Mandi
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-stone-50 px-3 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                      <Users size={15} className="text-stone-500" />
                    </div>
                    <span className="text-sm font-semibold text-stone-800">
                      {unit.kapasitas_penghuni}
                    </span>
                    <span className="text-[10px] text-stone-400 uppercase tracking-wide">
                      Penghuni
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-stone-50 px-3 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                      <Building2 size={15} className="text-stone-500" />
                    </div>
                    <span className="text-sm font-semibold text-stone-800">
                      Lantai {unit.lantai}
                    </span>
                    <span className="text-[10px] text-stone-400 uppercase tracking-wide">
                      Lantai
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS + BOOKING */}
          <div className="lg:sticky lg:top-6">
            <div className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
              {type && (
                <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                  <Tag size={11} />
                  {type}
                </div>
              )}

              <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                {title}
              </h1>

              <div className="mt-3 flex items-center gap-1.5 text-sm text-stone-500">
                <MapPin size={14} />
                {city}, {province}, Indonesia
              </div>

              <div className="my-6 border-t border-stone-100" />

              {address && (
                <div className="mb-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                    Alamat
                  </p>
                  <div className="mt-2 flex items-start gap-2 text-sm leading-6 text-stone-600">
                    <MapPin
                      size={14}
                      className="mt-1 shrink-0 text-stone-400"
                    />
                    <span>{address}</span>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                  Pemilik
                </p>
                <div className="mt-2 flex items-center gap-2 text-sm text-stone-600">
                  <User size={14} className="shrink-0 text-stone-400" />
                  <span>{owner_name ?? "—"}</span>
                </div>
              </div>

              <div className="border-t border-stone-100 pt-5">
                <span className="text-2xl font-semibold tracking-tight text-stone-950">
                  {formatRupiah(price_per_two_months)}
                </span>
                <span className="ml-2 text-sm text-stone-400">/ 2 bulan</span>
              </div>

              {isPemilik ? (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-6 text-center">
                  <p className="text-lg font-semibold text-amber-700">
                    Properti Anda
                  </p>
                  <p className="mt-1 text-sm text-amber-600">
                    Anda adalah pemilik dari properti ini.
                  </p>
                </div>
              ) : isTersedia ? (
                <>
                  {/* Month Selector */}
                  <div className="mt-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400 mb-2">
                      Durasi Sewa
                    </p>
                    <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setMonths((m) => Math.max(2, m - 1))}
                        disabled={months <= 2}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-300 text-stone-600 transition hover:border-stone-400 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="text-lg font-semibold text-stone-900">
                        {months} Bulan
                      </span>

                      <button
                        type="button"
                        onClick={() => setMonths((m) => m + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-300 text-stone-600 transition hover:border-stone-400 hover:bg-white"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="mt-2 flex justify-between text-sm text-stone-500">
                      <span>
                        {format(startDate, "dd MMM yyyy")} &mdash;{" "}
                        {format(endDate, "dd MMM yyyy")}
                      </span>
                      <span className="font-medium text-stone-700">
                        {months} bulan
                      </span>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="mt-4 rounded-2xl bg-stone-50 px-4 py-4 text-sm text-stone-600">
                    <div className="flex justify-between">
                      <span>2 bulan pertama</span>
                      <span>{formatRupiah(price_per_two_months)}</span>
                    </div>
                    {extraMonths > 0 && (
                      <div className="mt-2 flex justify-between">
                        <span>{extraMonths} bulan tambahan × {formatRupiah(price_per_month)}</span>
                        <span>{formatRupiah(extraMonths * price_per_month)}</span>
                      </div>
                    )}
                    <div className="mt-2 flex justify-between font-medium text-stone-800">
                      <span>Total Sewa</span>
                      <span>{formatRupiah(total)}</span>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <span>Biaya layanan</span>
                      <span>{formatRupiah(service)}</span>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <span>Pajak (10%)</span>
                      <span>{formatRupiah(tax)}</span>
                    </div>
                    <div className="mt-3 flex justify-between border-t border-stone-200 pt-3 font-semibold text-stone-950">
                      <span>Total Pembayaran</span>
                      <span>{formatRupiah(total + service + tax)}</span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <FormPemesanan
                      buatPemesanan={buatPemesanan}
                      price_per_two_months={price_per_two_months}
                      price_per_month={price_per_month}
                      startDate={startDate}
                      endDate={endDate}
                      months={months}
                      propertiId={property.id}
                      propertiTitle={title}
                    />
                  </div>
                </>
              ) : (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-center">
                  <p className="text-lg font-semibold text-red-700">
                    Tidak Tersedia
                  </p>
                  <p className="mt-1 text-sm text-red-600">
                    Kontrakan ini sedang disewa oleh penyewa lain.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
