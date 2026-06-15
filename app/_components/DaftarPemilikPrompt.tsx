"use client";

import { Building2 } from "lucide-react";
import { registerAsPemilik } from "@/app/_lib/action";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 bg-[#a67f71] text-white px-5 py-3 text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
    >
      {pending ? "Mendaftarkan..." : "Daftar sebagai Pemilik"}
    </button>
  );
}

export default function DaftarPemilikPrompt() {
  const router = useRouter();

  return (
    <div className="border border-stone-200 bg-white p-10 text-center">
      <div className="flex justify-center mb-4">
        <Building2 size={48} className="text-stone-300" />
      </div>
      <h3 className="font-semibold text-lg text-stone-900 mb-2">
        Kelola Properti
      </h3>
      <p className="text-stone-500 mb-6 max-w-sm mx-auto">
        Anda belum terdaftar sebagai pemilik. Daftarkan diri Anda untuk mulai
        mengelola properti.
      </p>
      <form
        action={async () => {
          await registerAsPemilik();
          router.refresh();
        }}
      >
        <SubmitButton />
      </form>
    </div>
  );
}
