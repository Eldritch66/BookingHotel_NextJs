import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ metode?: string }>;
}) {
  const { metode } = await searchParams;

  return (
    <div className="w-full flex flex-col items-center justify-center py-16">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-6">
        <CheckCircle size={44} className="text-green-600" />
      </div>

      <h1 className="text-3xl font-semibold text-stone-900 text-center mb-2">
        Pembayaran Berhasil!
      </h1>

      <p className="text-stone-500 text-center max-w-sm">
        Sewa properti Anda telah berhasil diproses.
      </p>

      {metode && (
        <div className="mt-6 rounded-2xl bg-stone-50 border border-stone-200 px-6 py-3 text-sm text-stone-600">
          Metode pembayaran:{" "}
          <span className="font-semibold text-stone-800">{metode}</span>
        </div>
      )}

      <Link
        href="/account/sewa"
        className="mt-8 inline-flex items-center gap-2 bg-[#a67f71] text-white px-6 py-3 rounded-2xl font-semibold hover:opacity-90 transition"
      >
        Kelola Sewa Saya
      </Link>
    </div>
  );
}
