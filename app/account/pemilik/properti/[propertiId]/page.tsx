import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/app/_lib/auth";
import { getPemilik, getPropertiDetailPemilik } from "@/app/_lib/data-services";
import { formatRupiah } from "@/app/_lib/currency";
import { format, parseISO } from "date-fns";
import { ArrowLeft, Calendar, Clock, DollarSign, Home, MapPin, User, Mail } from "lucide-react";
import HapusPropertiButton from "@/app/_components/HapusPropertiButton";

export default async function DetailPropertiPage({
  params,
}: {
  params: Promise<{ propertiId: string }>;
}) {
  const { propertiId } = await params;
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const pemilik = await getPemilik(session.user.email);
  if (!pemilik) redirect("/role?alert=harus-pemilik");

  let properti;
  try {
    properti = await getPropertiDetailPemilik(propertiId);
  } catch {
    notFound();
  }

  const isActive = properti.status === "aktif";

  return (
    <div>
      <Link
        href="/account/pemilik/properti"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 mb-6 transition"
      >
        <ArrowLeft size={16} />
        Kembali
      </Link>

      <div className="rounded-xl border border-stone-200 bg-white overflow-hidden shadow-sm">
        <div className="relative h-48 sm:h-56 w-full bg-stone-100">
          {properti.foto_url ? (
            <Image
              src={properti.foto_url}
              alt={properti.nama_properti}
              fill
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Home size={48} className="text-stone-300" />
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-stone-900">
                {properti.nama_properti}
              </h1>
              <p className="text-stone-500 mt-1 flex items-center gap-1.5">
                <MapPin size={14} />
                {properti.tipe} &middot; {properti.kota}
              </p>
              <p className="text-stone-500 text-sm mt-0.5">{properti.alamat}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-stone-800">
                {formatRupiah(properti.harga_per_bulan)} / bln
              </span>
              {isActive ? (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-xs font-semibold">
                  Aktif
                </span>
              ) : (
                <span className="bg-stone-100 text-stone-400 px-3 py-1 rounded-md text-xs font-semibold">
                  Kosong
                </span>
              )}
            </div>
          </div>

          {isActive && properti.penyewa_nama && (
            <>
              <div className="border-t border-stone-100 pt-5 mb-6">
                <h2 className="text-sm font-semibold text-stone-700 mb-4">
                  Penyewa Saat Ini
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-lg bg-stone-50 p-4">
                    <User size={20} className="text-stone-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-stone-400 uppercase tracking-wide font-medium">
                        Nama Penyewa
                      </p>
                      <p className="text-sm font-semibold text-stone-800 mt-0.5">
                        {properti.penyewa_nama}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg bg-stone-50 p-4">
                    <Mail size={20} className="text-stone-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-stone-400 uppercase tracking-wide font-medium">
                        Email
                      </p>
                      <p className="text-sm font-semibold text-stone-800 mt-0.5">
                        {properti.penyewa_email ?? "—"}
                      </p>
                    </div>
                  </div>
                  {properti.tanggal_mulai && (
                    <div className="flex items-start gap-3 rounded-lg bg-stone-50 p-4">
                      <Calendar size={20} className="text-stone-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-stone-400 uppercase tracking-wide font-medium">
                          Tanggal Mulai
                        </p>
                        <p className="text-sm font-semibold text-stone-800 mt-0.5">
                          {format(parseISO(properti.tanggal_mulai), "dd MMM yyyy")}
                        </p>
                      </div>
                    </div>
                  )}
                  {properti.tanggal_selesai && (
                    <div className="flex items-start gap-3 rounded-lg bg-stone-50 p-4">
                      <Calendar size={20} className="text-stone-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-stone-400 uppercase tracking-wide font-medium">
                          Tanggal Selesai
                        </p>
                        <p className="text-sm font-semibold text-stone-800 mt-0.5">
                          {format(parseISO(properti.tanggal_selesai), "dd MMM yyyy")}
                        </p>
                      </div>
                    </div>
                  )}
                  {properti.durasi_bulan && (
                    <div className="flex items-start gap-3 rounded-lg bg-stone-50 p-4">
                      <Clock size={20} className="text-stone-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-stone-400 uppercase tracking-wide font-medium">
                          Durasi
                        </p>
                        <p className="text-sm font-semibold text-stone-800 mt-0.5">
                          {properti.durasi_bulan} bulan
                        </p>
                      </div>
                    </div>
                  )}
                  {properti.total_harga && (
                    <div className="flex items-start gap-3 rounded-lg bg-stone-50 p-4">
                      <DollarSign size={20} className="text-stone-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-stone-400 uppercase tracking-wide font-medium">
                          Total Harga
                        </p>
                        <p className="text-sm font-semibold text-stone-800 mt-0.5">
                          {formatRupiah(properti.total_harga)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {!isActive && (
            <div className="border-t border-stone-100 pt-5 mb-6">
              <p className="text-stone-400 text-sm">Properti ini sedang tidak disewa.</p>
            </div>
          )}

          {properti.riwayat_sewa.length > 0 && (
            <div className="border-t border-stone-100 pt-5">
              <h2 className="text-sm font-semibold text-stone-700 mb-4">
                Riwayat Sewa
              </h2>
              <div className="space-y-2">
                {properti.riwayat_sewa.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-lg bg-stone-50 px-4 py-3 text-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-stone-800 truncate">
                        {s.penyewa_nama}
                      </p>
                      <p className="text-stone-400 text-xs">
                        {format(parseISO(s.tanggal_mulai), "dd MMM yyyy")} &mdash;{" "}
                        {format(parseISO(s.tanggal_selesai), "dd MMM yyyy")}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="font-semibold text-stone-800">{formatRupiah(s.total_harga)}</p>
                      <p className="text-xs text-stone-400">{s.durasi_bulan} bulan</p>
                    </div>
                    <span
                      className={`ml-3 text-[11px] font-semibold px-2 py-0.5 rounded ${
                        s.status === "aktif" || s.status === "pending"
                          ? "bg-green-100 text-green-700"
                          : "bg-stone-200 text-stone-500"
                      }`}
                    >
                      {s.status === "aktif" || s.status === "pending" ? "Aktif" : s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-stone-100 pt-6 mt-5">
            <HapusPropertiButton propertiId={properti.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
