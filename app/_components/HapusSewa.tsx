"use client";

import { useTransition } from "react";
import SpinnerMini from "./SpinnerMini";
import { HiOutlineTrash } from "react-icons/hi2";

function HapusSewa({
  sewaId,
  onDelete,
}: {
  sewaId: string;
  onDelete: (sewaId: string) => void;
}) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (confirm("Apakah Anda yakin ingin membatalkan sewa ini?"))
      startTransition(() => onDelete(sewaId));
  }

  return (
    <button
      onClick={handleDelete}
      className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 flex-grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900 cursor-pointer"
    >
      {!isPending ? (
        <>
          <HiOutlineTrash className="h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-colors" />
          <span className="mt-1">Hapus</span>
        </>
      ) : (
        <span className="mx-auto">
          <SpinnerMini />
        </span>
      )}
    </button>
  );
}

export default HapusSewa;
