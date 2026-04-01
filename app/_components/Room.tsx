import Image from "next/image";
import { Room } from "../_lib/type";

export default function DetailRoom({ room }: { room: Room }) {
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
  } = room;
  const property = properties?.[0];

  const { title, city, province } = property || {};
  return (
    <main className="min-h-screen w-full">
      <section className="max-w-[1320px] mx-auto mt-12 px-6 relative h-[60dvh]">
        <div className="w-full h-full  grid grid-cols-2">
          <div className="col-span-1 bg-amber-500 rounded-tl-4xl rounded-bl-2xl"></div>
          <div>
            <div className="col-span-1 grid grid-cols-2 rows-2"></div>
          </div>
        </div>
      </section>
    </main>
  );
}
