"use client";

import { useFormStatus } from "react-dom";
import { useState } from "react";
import { hapusProperti } from "@/app/_lib/action";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ConfirmDialog from "./ConfirmDialog";

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group flex items-center justify-center gap-2 uppercase text-xs font-bold text-stone-500 w-full flex-1 px-3 hover:bg-red-50 transition-colors hover:text-red-700 cursor-pointer disabled:opacity-50"
    >
      <Trash2 size={16} className="shrink-0" />
      <span>{pending ? "Menghapus..." : "Hapus"}</span>
    </button>
  );
}

export default function HapusPropertiButton({
  propertiId,
}: {
  propertiId: string;
}) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <form
        className="flex flex-1 flex-col"
        action={async () => {
          setShowConfirm(true);
        }}
      >
        <DeleteButton />
      </form>
      <ConfirmDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={async () => {
          try {
            await hapusProperti(propertiId);
            toast.success("Properti berhasil dihapus");
            router.refresh();
          } catch (e) {
            toast.error(
              e instanceof Error ? e.message : "Gagal menghapus properti",
            );
          }
        }}
        title="Hapus Properti"
        message="Apakah Anda yakin ingin menghapus properti ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Ya, Hapus"
      />
    </>
  );
}
