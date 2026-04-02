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

  const { title, city, province, property_images } = properties ?? {};
  const images = property_images || [];

  const mainImage = images[0]?.image_url;
  const img1 = images[1]?.image_url;
  const img2 = images[2]?.image_url;
  const img3 = images[3]?.image_url;
  const img4 = images[4]?.image_url;

  // ===== MY KESALAHAN SAYA =====
  // const property = properties;
  // const { title, city, province } = property || {};
  // const images = room.properties?.[0]?.property_images || [];
  // const property = properties?.[0]; // grab first element
  // const images = property?.property_images || [];
  // const images = room.properties?.property_images || [];
  // const mainImage = images[0]?.image_url;
  // const img1 = images[1]?.image_url;
  // console.log("Images:", images);
  // const img2 = images[2]?.image_url;
  // const img3 = images[3]?.image_url;
  // const img4 = images[4]?.image_url;

  return (
    <main className="min-h-screen w-full">
      <section className="max-w-[1320px] mx-auto mt-12 px-6 relative h-[60dvh] grid grid-cols-2 gap-2">
        {/* LEFT */}
        <div className="relative">
          <Image
            src={mainImage ?? ""}
            alt={title ?? ""}
            fill
            className="object-cover rounded-tl-4xl rounded-bl-4xl"
          />
        </div>

        {/* RIGHT */}
        <div className="grid grid-cols-2 grid-rows-2 gap-1">
          <div className="relative">
            <Image src={img1 ?? ""} alt="" fill className="object-cover" />
          </div>

          <div className="relative">
            <Image
              src={img2 ?? ""}
              alt=""
              fill
              className="object-cover rounded-tr-4xl"
            />
          </div>

          <div className="relative">
            <Image src={img3 ?? ""} alt="" fill className="object-cover " />
          </div>

          <div className="relative">
            <Image
              src={img4 ?? ""}
              alt=""
              fill
              className="object-cover rounded-br-4xl"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
