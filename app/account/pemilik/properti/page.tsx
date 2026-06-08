import Link from "next/link";
import Image from "next/image";
import { auth } from "@/app/_lib/auth";
import { getPemilik, getPropertiByPemilik } from "@/app/_lib/data-services";
import { formatRupiah } from "@/app/_lib/currency";
import { redirect } from "next/navigation";
import { Plus, Home } from "lucide-react";
import HapusPropertiButton from "@/app/_components/HapusPropertiButton";
import DaftarPemilikPrompt from "@/app/_components/DaftarPemilikPrompt";

export default async function Page() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const pemilik = await getPemilik(session.user.email);
  if (!pemilik) return <DaftarPemilikPrompt />;

  const propertiList = await getPropertiByPemilik(pemilik.id);

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <h2 className="font-semibold text-2xl text-stone-900">
          Properti Saya
        </h2>
        <Link
          href="/account/pemilik/properti/tambah"
          className="inline-flex items-center gap-2 bg-[#a67f71] text-white px-4 py-2.5 rounded-2xl text-sm font-semibold hover:opacity-90 transition"
        >
          <Plus size={18} />
          Tambah Properti
        </Link>
      </div>

      {propertiList.length === 0 ? (
        <div className="rounded-[28px] border border-stone-200 bg-white p-10 text-center">
          <div className="flex justify-center mb-4">
            <Home size={48} className="text-stone-300" />
          </div>
          <p className="text-stone-500 mb-4">
            Belum ada properti. Tambahkan properti pertama Anda!
          </p>
          <Link
            href="/account/pemilik/properti/tambah"
            className="inline-flex items-center gap-2 bg-[#a67f71] text-white px-5 py-3 rounded-2xl text-sm font-semibold hover:opacity-90 transition"
          >
            <Plus size={18} />
            Tambah Properti
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {propertiList.map((p) => (
            <div
              key={p.id}
              className="rounded-[28px] border border-stone-200 bg-white overflow-hidden shadow-sm"
            >
              <div className="relative h-44 bg-stone-100">
                {p.foto_properti?.[0]?.url ? (
                  <Image
                    src={p.foto_properti[0].url}
                    alt={p.nama_properti}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Home size={32} className="text-stone-300" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-stone-900 text-base">
                  {p.nama_properti}
                </h3>
                <p className="text-sm text-stone-500 mt-0.5">
                  {p.tipe} &middot; {p.kota}
                </p>
                <p className="text-sm font-semibold text-stone-800 mt-2">
                  {formatRupiah(p.harga_per_bulan)} / bulan
                </p>
                <div className="flex gap-2 mt-3">
                  <span className="text-xs bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full">
                    {p.foto_properti?.length ?? 0} foto
                  </span>
                </div>
                <div className="flex gap-2 mt-4">
                  <HapusPropertiButton propertiId={p.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
