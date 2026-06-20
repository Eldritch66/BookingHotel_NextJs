"use client";

import { useFormStatus } from "react-dom";
import { useState } from "react";
import { updateStatusSewa } from "@/app/_lib/action";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ConfirmDialog from "./ConfirmDialog";

function TerimaButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center justify-center gap-2 flex-1 py-3 bg-green-600 text-white text-sm font-bold uppercase hover:bg-green-700 transition disabled:opacity-50 cursor-pointer"
    >
      <Check size={18} />
      {pending ? "Memproses..." : "Terima"}
    </button>
  );
}

function TolakButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center justify-center gap-2 flex-1 py-3 bg-red-500 text-white text-sm font-bold uppercase hover:bg-red-600 transition disabled:opacity-50 cursor-pointer"
    >
      <X size={18} />
      {pending ? "Memproses..." : "Tolak"}
    </button>
  );
}

export default function KonfirmasiSewaButton({
  sewaId,
}: {
  sewaId: string;
}) {
  const router = useRouter();
  const [showTolakConfirm, setShowTolakConfirm] = useState(false);

  return (
    <>
      <div className="flex border-t border-stone-100 pt-4 mt-2 gap-3">
        <form
          className="flex-1 flex"
          action={async () => {
            await updateStatusSewa(sewaId, "aktif");
            toast.success("Sewa berhasil diterima");
            router.refresh();
          }}
        >
          <TerimaButton />
        </form>
        <form
          className="flex-1 flex"
          action={async () => {
            setShowTolakConfirm(true);
          }}
        >
          <TolakButton />
        </form>
      </div>
      <ConfirmDialog
        open={showTolakConfirm}
        onClose={() => setShowTolakConfirm(false)}
        onConfirm={async () => {
          await updateStatusSewa(sewaId, "dibatalkan");
          toast.success("Sewa berhasil ditolak");
          router.refresh();
        }}
        title="Tolak Penyewa"
        message="Apakah Anda yakin ingin menolak penyewa ini?"
        confirmLabel="Ya, Tolak"
        variant="danger"
      />
    </>
  );
}
