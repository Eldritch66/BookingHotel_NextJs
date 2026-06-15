import Link from "next/link";
import { auth } from "@/app/_lib/auth";
import { getPemilik, getPropertiPemilik } from "@/app/_lib/data-services";
import { redirect } from "next/navigation";
import { Plus, Home } from "lucide-react";
import PropertiPemilikCard from "@/app/_components/PropertiPemilikCard";
import DaftarPemilikPrompt from "@/app/_components/DaftarPemilikPrompt";

export default async function Page() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const pemilik = await getPemilik(session.user.email);
  if (!pemilik) return <DaftarPemilikPrompt />;

  const propertiList = await getPropertiPemilik(pemilik.id);

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <h2 className="font-semibold text-2xl text-stone-900">
          Properti Saya
        </h2>
        <Link
          href="/account/pemilik/properti/tambah"
          className="inline-flex items-center gap-2 bg-[#a67f71] text-white px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition"
        >
          <Plus size={18} />
          Tambah Properti
        </Link>
      </div>

      {propertiList.length === 0 ? (
        <div className="border border-stone-200 bg-white p-10 text-center">
          <div className="flex justify-center mb-4">
            <Home size={48} className="text-stone-300" />
          </div>
          <p className="text-stone-500 mb-4">
            Belum ada properti. Tambahkan properti pertama Anda!
          </p>
          <Link
            href="/account/pemilik/properti/tambah"
            className="inline-flex items-center gap-2 bg-[#a67f71] text-white px-5 py-3 text-sm font-semibold hover:opacity-90 transition"
          >
            <Plus size={18} />
            Tambah Properti
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {propertiList.map((p) => (
            <PropertiPemilikCard key={p.id} properti={p} />
          ))}
        </div>
      )}
    </div>
  );
}
