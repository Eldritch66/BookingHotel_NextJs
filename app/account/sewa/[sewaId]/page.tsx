import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/app/_lib/auth";
import { getPenyewa, getSewaByIdWithProperti } from "@/app/_lib/data-services";
import { formatRupiah } from "@/app/_lib/currency";
import { format, parseISO } from "date-fns";
import { batalkanSewa } from "@/app/_lib/action";
import { ArrowLeft, Calendar, Clock, DollarSign, Home } from "lucide-react";

export default async function DetailSewaPage({
  params,
}: {
  params: Promise<{ sewaId: string }>;
}) {
  const { sewaId } = await params;
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const penyewa = await getPenyewa(session.user.email);
  if (!penyewa) redirect("/role?alert=harus-penyewa");

  const sewa = await getSewaByIdWithProperti(sewaId, penyewa.id);
  if (!sewa) notFound();

  const isActive = sewa.status !== "dibatalkan";

  return (
    <div>
      <Link
        href="/account/sewa"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 mb-6 transition"
      >
        <ArrowLeft size={16} />
        Kembali
      </Link>

      <div className="rounded-[28px] border border-stone-200 bg-white overflow-hidden shadow-sm">
        {/* Image */}
        <div className="relative h-48 sm:h-56 w-full bg-stone-100">
          {sewa.properti_image ? (
            <Image
              src={sewa.properti_image}
              alt={sewa.properti_title}
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

        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-stone-900">
                {sewa.properti_title || "Properti"}
              </h1>
              <p className="text-stone-500 mt-0.5">
                {sewa.durasi_bulan} bulan sewa
              </p>
            </div>
            {isActive ? (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                Aktif
              </span>
            ) : (
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                Dibatalkan
              </span>
            )}
          </div>

          {/* Info Grid */}
          <div className="grid gap-4 sm:grid-cols-2 mb-8">
            <div className="flex items-start gap-3 rounded-2xl bg-stone-50 p-4">
              <Calendar size={20} className="text-stone-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-stone-400 uppercase tracking-wide font-medium">
                  Tanggal Mulai
                </p>
                <p className="text-sm font-semibold text-stone-800 mt-0.5">
                  {format(parseISO(sewa.tanggal_mulai), "dd MMM yyyy")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-stone-50 p-4">
              <Calendar size={20} className="text-stone-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-stone-400 uppercase tracking-wide font-medium">
                  Tanggal Selesai
                </p>
                <p className="text-sm font-semibold text-stone-800 mt-0.5">
                  {format(parseISO(sewa.tanggal_selesai), "dd MMM yyyy")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-stone-50 p-4">
              <Clock size={20} className="text-stone-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-stone-400 uppercase tracking-wide font-medium">
                  Durasi
                </p>
                <p className="text-sm font-semibold text-stone-800 mt-0.5">
                  {sewa.durasi_bulan} bulan
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-stone-50 p-4">
              <DollarSign size={20} className="text-stone-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-stone-400 uppercase tracking-wide font-medium">
                  Total Harga
                </p>
                <p className="text-sm font-semibold text-stone-800 mt-0.5">
                  {formatRupiah(sewa.total_harga)}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          {isActive && (
            <div className="border-t border-stone-100 pt-6">
              <form
                action={async () => {
                  "use server";
                  await batalkanSewa(sewa.id);
                  redirect("/account/sewa");
                }}
              >
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2.5 rounded-2xl text-sm font-semibold hover:bg-red-100 transition"
                >
                  Batalkan Sewa
                </button>
              </form>
              <p className="text-xs text-stone-400 mt-3">
                Batalkan sewa ini jika Anda tidak jadi menyewa properti tersebut.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
