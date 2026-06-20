import { getSewaById, getUserByEmail } from "@/app/_lib/data-services";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/app/_lib/auth";
import { formatRupiah } from "@/app/_lib/currency";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { simulasiPembayaran } from "@/app/_lib/action";
import { Banknote, QrCode, CreditCard } from "lucide-react";

export default async function PembayaranPage({
  params,
}: {
  params: Promise<{ sewaId: string }>;
}) {
  const { sewaId } = await params;
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await getUserByEmail(session.user.email);
  if (!user || user.role !== "penyewa") redirect("/role?alert=harus-penyewa");

  const sewa = await getSewaById(sewaId);
  if (!sewa) notFound();
  if (sewa.penyewa_id !== user.id) notFound();

  const properti = Array.isArray(sewa.properti) ? sewa.properti[0] : sewa.properti;
  const properti_title = properti?.nama_properti ?? "";

  const service = 25000;
  const tax = Math.ceil(sewa.total_harga * 0.1);
  const total_display = sewa.total_harga + service + tax;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-stone-900 mb-6">
          Pembayaran
        </h1>

        {/* Sewa Summary Card */}
        <div className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-stone-900 mb-3">
            {properti_title || "Properti"}
          </h2>
          <div className="space-y-2 text-sm text-stone-600">
            <div className="flex justify-between">
              <span>Tanggal Sewa</span>
              <span className="font-medium text-stone-800">
                {format(parseISO(sewa.tanggal_mulai), "dd MMM yyyy", { locale: id })} &mdash;{" "}
                {format(parseISO(sewa.tanggal_selesai), "dd MMM yyyy", { locale: id })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Durasi</span>
              <span className="font-medium text-stone-800">{sewa.durasi_bulan} bulan</span>
            </div>
          </div>
          <div className="mt-4 border-t border-stone-100 pt-4 space-y-2 text-sm text-stone-600">
            <div className="flex justify-between">
              <span>Total Sewa</span>
              <span>{formatRupiah(sewa.total_harga)}</span>
            </div>
            <div className="flex justify-between">
              <span>Biaya layanan</span>
              <span>{formatRupiah(service)}</span>
            </div>
            <div className="flex justify-between">
              <span>Pajak (10%)</span>
              <span>{formatRupiah(tax)}</span>
            </div>
            <div className="flex justify-between border-t border-stone-200 pt-3 font-semibold text-stone-950 text-base">
              <span>Total Pembayaran</span>
              <span>{formatRupiah(total_display)}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <h2 className="text-lg font-semibold text-stone-900 mb-4">
          Pilih Metode Pembayaran
        </h2>

        <form
          action={simulasiPembayaran}
          className="space-y-4"
        >
          <input type="hidden" name="sewa_id" value={sewaId} />

          {/* QRIS */}
          <label className="block rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm cursor-pointer transition has-[:checked]:border-[#a67f71] has-[:checked]:ring-2 has-[:checked]:ring-[#a67f71]/20">
            <input
              type="radio"
              name="metode"
              value="QRIS"
              defaultChecked
              className="peer/qris absolute opacity-0 pointer-events-none"
            />
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-stone-100">
                <QrCode size={24} className="text-stone-700" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900">QRIS</span>
                  <span className="text-xs text-stone-400 peer-checked/qris:text-[#a67f71]">Pilih</span>
                </div>
                <p className="text-sm text-stone-500 mt-1">
                  Scan QR code menggunakan aplikasi e-wallet atau mobile banking
                </p>
                <div className="hidden peer-checked/qris:block mt-4 rounded-2xl bg-stone-50 p-4 text-center">
                  <div className="inline-flex items-center justify-center w-40 h-40 bg-white border-2 border-dashed border-stone-300 rounded-xl mb-3">
                    <QrCode size={80} className="text-stone-800" />
                  </div>
                  <p className="text-xs text-stone-500">
                    Scan QR ini dengan aplikasi pembayaran Anda
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    *Simulasi — pembayaran tidak diproses secara riil
                  </p>
                </div>
              </div>
            </div>
          </label>

          {/* Bank Transfer BCA */}
          <label className="block rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm cursor-pointer transition has-[:checked]:border-[#a67f71] has-[:checked]:ring-2 has-[:checked]:ring-[#a67f71]/20">
            <input
              type="radio"
              name="metode"
              value="Transfer BCA"
              className="peer/bca absolute opacity-0 pointer-events-none"
            />
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-stone-100">
                <Banknote size={24} className="text-stone-700" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900">Transfer Bank BCA</span>
                  <span className="text-xs text-stone-400 peer-checked/bca:text-[#a67f71]">Pilih</span>
                </div>
                <p className="text-sm text-stone-500 mt-1">
                  Transfer ke rekening virtual account BCA
                </p>
                <div className="hidden peer-checked/bca:block mt-4 rounded-2xl bg-stone-50 p-4">
                  <div className="text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400 mb-2">
                      Nomor Virtual Account
                    </p>
                    <p className="text-2xl font-mono font-bold tracking-widest text-stone-900">
                      88012 3456789
                    </p>
                    <p className="text-xs text-stone-500 mt-2">
                      a.n. PT Booking App Indonesia
                    </p>
                    <p className="text-xs text-stone-400 mt-1">
                      *Simulasi — pembayaran tidak diproses secara riil
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </label>

          {/* PayPal */}
          <label className="block rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm cursor-pointer transition has-[:checked]:border-[#a67f71] has-[:checked]:ring-2 has-[:checked]:ring-[#a67f71]/20">
            <input
              type="radio"
              name="metode"
              value="PayPal"
              className="peer/pp absolute opacity-0 pointer-events-none"
            />
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-stone-100">
                <CreditCard size={24} className="text-stone-700" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900">PayPal</span>
                  <span className="text-xs text-stone-400 peer-checked/pp:text-[#a67f71]">Pilih</span>
                </div>
                <p className="text-sm text-stone-500 mt-1">
                  Bayar menggunakan akun PayPal Anda
                </p>
                <div className="hidden peer-checked/pp:block mt-4 rounded-2xl bg-stone-50 p-4 text-center">
                  <div className="inline-flex items-center gap-3 rounded-xl bg-white border border-stone-200 px-6 py-3 mb-3">
                    <CreditCard size={20} className="text-blue-600" />
                    <span className="font-semibold text-stone-800">PayPal</span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Anda akan diarahkan ke PayPal untuk menyelesaikan pembayaran
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    *Simulasi — pembayaran tidak diproses secara riil
                  </p>
                </div>
              </div>
            </div>
          </label>

          <button
            type="submit"
            className="w-full bg-[#a67f71] text-white py-4 rounded-2xl mt-6 text-lg font-semibold hover:opacity-90 transition cursor-pointer"
          >
            Konfirmasi Pembayaran
          </button>
        </form>
      </div>
    </div>
  );
}
