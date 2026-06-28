"use client";

import ReservationCard from "./ReservationCard";
import { Booking } from "../_lib/type";

function ReservationList({ bookings }: { bookings: Booking[] }) {
  return (
    <ul className="space-y-6">
      {bookings.map((booking) => (
        <ReservationCard booking={booking} key={booking.id} />
      ))}
    </ul>
  );
}

export default ReservationList;
