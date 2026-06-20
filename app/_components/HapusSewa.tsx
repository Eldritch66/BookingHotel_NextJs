"use client";

import { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi2";
import toast from "react-hot-toast";
import { hapusSewaPenyewa } from "@/app/_lib/action";
import { useRouter } from "next/navigation";
import ConfirmDialog from "./ConfirmDialog";

export default function HapusSewa({
  sewaId,
  isEnabled,
}: {
  sewaId: string;
  isEnabled: boolean;
}) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await hapusSewaPenyewa(sewaId);
      toast.success("Sewa berhasil dihapus");
      router.refresh();
    } catch {
      toast.error("Gagal menghapus sewa");
      setIsDeleting(false);
    }
  }

  return (
    <>
      <button
        onClick={() => isEnabled && setShowConfirm(true)}
        disabled={!isEnabled || isDeleting}
        className={`group flex items-center gap-2 uppercase text-xs font-bold flex-grow px-3 transition-colors ${
          isEnabled
            ? "text-primary-300 hover:bg-accent-600 hover:text-primary-900 cursor-pointer"
            : "text-stone-300 cursor-not-allowed"
        }`}
      >
        <HiOutlineTrash className="h-5 w-5" />
        <span className="mt-1">{isDeleting ? "..." : "Hapus"}</span>
      </button>
      <ConfirmDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Hapus Sewa"
        message="Apakah Anda yakin ingin menghapus sewa ini? Data akan dihapus permanen."
        confirmLabel="Ya, Hapus"
      />
    </>
  );
}
