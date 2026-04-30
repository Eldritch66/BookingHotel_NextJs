import Image from "next/image";

export default function RoomImageGallery({
  propImages,
  title,
}: {
  propImages: { id: string; image_url: string }[];
  title?: string;
}) {
  const images = propImages || [];

  const mainImage = images[0]?.image_url;
  const img1 = images[1]?.image_url;
  const img2 = images[2]?.image_url;
  const img3 = images[3]?.image_url;
  const img4 = images[4]?.image_url;
  return (
    <section className="hidden w-full lg:max-w-[1750px] mx-auto px-2 relative h-[60vh] md:grid grid-cols-2 gap-2 overflow-hidden">
      <div className="relative">
        <Image
          src={mainImage ?? ""}
          alt={title ?? ""}
          fill
          className="object-cover rounded-tl-4xl rounded-bl-4xl"
        />
      </div>

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
  );
}
