import { DateRange } from "react-day-picker";

function ReservationForm({
  createBooking,
  id,
  price_per_night,
  range,
  nights,
  guests,
}: {
  createBooking: (formData: FormData) => Promise<void>;
  id: string;
  price_per_night: number;
  range?: DateRange;
  nights: number;
  guests: number;
}) {
  return (
    <form action={createBooking}>
      <input type="hidden" name="room_id" value={id} />
      <input type="hidden" name="price_per_night" value={price_per_night} />
      <input
        type="hidden"
        name="start_date"
        value={range?.from?.toISOString().split("T")[0] ?? ""}
      />
      <input
        type="hidden"
        name="end_date"
        value={range?.to?.toISOString().split("T")[0] ?? ""}
      />
      <input type="hidden" name="num_nights" value={nights} />
      <input type="hidden" name="num_guests" value={guests} />

      <button
        type="submit"
        disabled={!range?.from || !range?.to}
        className="w-full text-2xl bg-[#a67f71] text-white py-3 rounded-xl mt-4 font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Reserve Now
      </button>
    </form>
  );
}

export default ReservationForm;
