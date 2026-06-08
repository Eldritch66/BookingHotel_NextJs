"use client";

import { useFormStatus } from "react-dom";
import { hapusProperti } from "@/app/_lib/action";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100 transition disabled:opacity-50"
    >
      <Trash2 size={14} />
      {pending ? "Menghapus..." : "Hapus"}
    </button>
  );
}

export default function HapusPropertiButton({
  propertiId,
}: {
  propertiId: string;
}) {
  const router = useRouter();

  return (
    <form
      action={async () => {
        if (
          !window.confirm(
            "Apakah Anda yakin ingin menghapus properti ini? Tindakan ini tidak dapat dibatalkan.",
          )
        )
          return;
        await hapusProperti(propertiId);
        router.refresh();
      }}
    >
      <DeleteButton />
    </form>
  );
}
