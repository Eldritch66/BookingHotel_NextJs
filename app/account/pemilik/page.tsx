import { auth } from "@/app/_lib/auth";
import { getUserByEmail, getOwnerStats } from "@/app/_lib/data-services";
import { formatRupiah } from "@/app/_lib/currency";
import DaftarPemilikPrompt from "@/app/_components/DaftarPemilikPrompt";
import Link from "next/link";
import {
  Building2,
  Users,
  Clock,
  Home,
  Wallet,
  ArrowRight,
} from "lucide-react";

export default async function Page() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] || "Owner";

  const user = session?.user?.email
    ? await getUserByEmail(session.user.email)
    : null;

  if (!user || user.role !== "pemilik") {
    return (
      <div>
        <DaftarPemilikPrompt />
      </div>
    );
  }

  const stats = await getOwnerStats(user.id);

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-semibold text-2xl text-stone-900">
          Selamat datang, {firstName}!
        </h2>
        <p className="text-stone-500 text-sm mt-1">
          Ringkasan properti Anda
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="border border-stone-200 bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-stone-400 font-medium">
                Total Properti
              </p>
              <p className="text-3xl font-bold text-stone-900 mt-1">
                {stats.total}
              </p>
            </div>
            <div className="p-3 bg-stone-100 text-stone-600">
              <Building2 size={22} />
            </div>
          </div>
        </div>

        <div className="border border-stone-200 bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-stone-400 font-medium">
                Disewa
              </p>
              <p className="text-3xl font-bold text-green-700 mt-1">
                {stats.aktif}
              </p>
            </div>
            <div className="p-3 bg-green-50 text-green-600">
              <Users size={22} />
            </div>
          </div>
        </div>

        <div className="border border-stone-200 bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-stone-400 font-medium">
                Pending
              </p>
              <p className="text-3xl font-bold text-yellow-700 mt-1">
                {stats.pending}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 text-yellow-600">
              <Clock size={22} />
            </div>
          </div>
        </div>

        <div className="border border-stone-200 bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-stone-400 font-medium">
                Kosong
              </p>
              <p className="text-3xl font-bold text-stone-400 mt-1">
                {stats.kosong}
              </p>
            </div>
            <div className="p-3 bg-stone-50 text-stone-400">
              <Home size={22} />
            </div>
          </div>
        </div>
      </div>

      <div className="border border-stone-200 bg-white p-5 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-stone-400 font-medium">
              Pendapatan Aktif
            </p>
            <p className="text-3xl font-bold text-stone-900 mt-1">
              {formatRupiah(stats.pendapatanAktif)}
            </p>
            <p className="text-xs text-stone-400 mt-1">
              dari {stats.aktif} properti yang disewa
            </p>
          </div>
          <div className="p-3 bg-[#a67f71]/10 text-[#a67f71]">
            <Wallet size={22} />
          </div>
        </div>
      </div>

      <Link
        href="/account/pemilik/properti"
        className="inline-flex items-center gap-2 border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50 transition"
      >
        Kelola Properti
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
