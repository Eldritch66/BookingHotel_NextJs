import Image from "next/image";
import { Property } from "../_lib/type";

export default function Card({ property }: { property: Property }) {
  const image = property.property_images?.[0]?.image_url;
  return (
    <div className="bg-white col-span-1 row-span-1 rounded-2xl shadow-md grid grid-rows-2">
      <div className="row-span-1 relative">
        <Image
          src={image}
          alt=""
          fill
          className="object-cover rounded-tr-2xl rounded-tl-2xl"
        />
      </div>
      <div className="row-span-1 "></div>
    </div>
  );
}
