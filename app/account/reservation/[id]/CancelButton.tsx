"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelBooking } from "@/app/_lib/action";
import { FiTrash2 } from "react-icons/fi";

export default function CancelButton({
  bookingId,
}: {
  bookingId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleCancel() {
    if (!confirm("Yakin ingin membatalkan reservasi ini?")) return;
    startTransition(async () => {
      await cancelBooking(bookingId);
      router.push("/account/reservation");
    });
  }

  return (
    <button
      onClick={handleCancel}
      disabled={isPending}
      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 font-medium text-sm transition-all duration-200 hover:bg-red-100 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? (
        <span className="spinner-mini" />
      ) : (
        <>
          <FiTrash2 size={16} />
          Batalkan Reservasi
        </>
      )}
    </button>
  );
}
