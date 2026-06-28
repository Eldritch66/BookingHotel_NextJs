"use client";

import { useTransition } from "react";
import SpinnerMini from "./SpinnerMini";
import { HiOutlineTrash } from "react-icons/hi2";

function DeleteReservation({
  bookingId,
  onDelete,
}: {
  bookingId: string;
  onDelete: (bookingId: string) => void;
}) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (confirm("Are you sure you want to delete this booking?"))
      startTransition(() => onDelete(bookingId));
  }

  return (
    <button
      onClick={handleDelete}
      className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 flex-grow px-3 hover:bg-red-50 transition-all duration-200 hover:text-red-600 cursor-pointer"
    >
      {!isPending ? (
        <>
          <HiOutlineTrash className="h-5 w-5 text-primary-600 transition-all duration-200 group-hover:text-red-500 group-hover:scale-110" />
          <span className="mt-1">Delete</span>
        </>
      ) : (
        <span className="mx-auto">
          <SpinnerMini />
        </span>
      )}
    </button>
  );
}

export default DeleteReservation;
