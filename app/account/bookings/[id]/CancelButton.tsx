"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelBooking } from "@/app/_lib/action";
import { FiXCircle } from "react-icons/fi";
import toast from "react-hot-toast";

export default function CancelButton({ bookingId }: { bookingId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleCancel() {
    const toastId = toast.loading("Membatalkan booking...");
    startTransition(async () => {
      try {
        await cancelBooking(bookingId);
        toast.success("Booking berhasil dibatalkan", { id: toastId });
        router.refresh();
      } catch (e) {
        toast.error((e as Error).message || "Gagal membatalkan booking", {
          id: toastId,
        });
      }
    });
  }

  return (
    <button
      onClick={handleCancel}
      disabled={isPending}
      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-orange-200 bg-orange-50 text-orange-600 font-medium text-sm transition-all duration-200 hover:bg-orange-100 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {isPending ? (
        <span className="spinner-mini" />
      ) : (
        <>
          <FiXCircle size={16} />
          Batalkan Booking
        </>
      )}
    </button>
  );
}
