import { Room } from "../_lib/type";

export default function DetailRoom({ rooms }: { rooms: Room }) {
  const {
    id,
    property_id,
    name,
    price_per_night,
    bed_type,
    quantity,
    created_at,
    size,
    properties,
  } = rooms;
  const property = properties?.[0];

  const { title, city, province } = property || {};
  return (
    <div className="flex items-center justify-center h-screen text-4xl">
      <span className="bg-amber-300 text-2xl">Room Details</span>
    </div>
  );
}
