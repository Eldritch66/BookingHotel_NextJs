import { formatDate } from "date-fns";
import { DateRange } from "react-day-picker";

function ReservationForm({
  createBooking,
  id,
  price_per_night,
  range,
  nights,
}: {
  createBooking: (formData: FormData) => Promise<void>;
  id: string;
  price_per_night: number;
  range?: DateRange;
  nights: number;
}) {
  return (
    <form action={createBooking}>
      <input type="hidden" name="room_id" value={id} />
      <input type="hidden" name="price_per_night" value={price_per_night} />
      <input
        type="hidden"
        name="start_date"
        value={range?.from ? formatDate(range.from, "yyyy-MM-dd") : ""}
      />
      <input
        type="hidden"
        name="end_date"
        value={range?.to ? formatDate(range.to, "yyyy-MM-dd") : ""}
      />
      <input type="hidden" name="num_nights" value={nights} />

      <button
        type="submit"
        disabled={!range?.from || !range?.to}
        className="w-full text-lg font-semibold bg-primary-1000 text-white py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        Book Now
      </button>
    </form>
  );
}

export default ReservationForm;
