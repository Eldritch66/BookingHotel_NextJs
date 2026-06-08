"use client";

import { registerAsPenyewa, registerAsPemilik } from "../_lib/action";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, Suspense } from "react";

function AlertBanner() {
  const searchParams = useSearchParams();
  const alert = searchParams.get("alert");

  if (alert !== "harus-penyewa") return null;

  return (
    <div className="mb-6 rounded-2xl bg-yellow-50 border border-yellow-200 px-5 py-3 text-sm text-yellow-800">
      Anda harus mendaftar sebagai <strong>Penyewa</strong> untuk melanjutkan
      booking. Silakan pilih peran di bawah.
    </div>
  );
}

export default function RolePage() {
  const [isPending, startTransition] = useTransition();
  const { update } = useSession();
  const router = useRouter();

  async function handlePenyewa() {
    await registerAsPenyewa();
    await update();
    router.push("/");
  }

  async function handlePemilik() {
    await registerAsPemilik();
    await update();
    router.push("/");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#faf7f4]">
      <div className="w-full max-w-sm">
        <Suspense fallback={null}>
          <AlertBanner />
        </Suspense>

        <h1 className="font-serif text-3xl font-bold text-[#3b2314] mb-2 text-center">
          Anda siapa?
        </h1>
        <p className="text-[#9b8b7a] text-sm mb-10 text-center">
          Pilih peran kamu di Nginapin
        </p>

        <div className="flex flex-col gap-4">
          <button
            disabled={isPending}
            onClick={() => startTransition(() => handlePenyewa())}
            className="py-5 px-6 rounded-2xl bg-[#8b5e3c] text-white text-left hover:bg-[#6e4a2e] transition-colors disabled:opacity-60"
          >
            <p className="font-semibold text-base">🏠 Saya Penyewa</p>
            <p className="text-sm opacity-80 mt-0.5">
              Cari & booking kosan atau kontrakan
            </p>
          </button>

          <button
            disabled={isPending}
            onClick={() => startTransition(() => handlePemilik())}
            className="py-5 px-6 rounded-2xl border-2 border-[#8b5e3c] text-[#8b5e3c] text-left hover:bg-[#f5f0ea] transition-colors disabled:opacity-60"
          >
            <p className="font-semibold text-base">🏗️ Saya Pemilik</p>
            <p className="text-sm opacity-70 mt-0.5">
              Daftarkan & kelola properti saya
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
