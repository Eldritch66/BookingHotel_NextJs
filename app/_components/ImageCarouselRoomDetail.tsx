"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ImageCarouselRoomDetail({
  images,
}: {
  images: { image_url: string }[];
}) {
  const validImages = images.filter((img) => img.image_url);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    onSelect();
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="relative">
      <div className="embla overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {validImages.map((img, i) => (
            <div key={i} className="min-w-full relative aspect-[16/9] max-h-[80vh]">
              <Image
                src={img.image_url}
                alt=""
                quality={75}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      {validImages.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {validImages.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-2.5 h-2.5 rounded-full transition cursor-pointer ${
                index === selectedIndex
                  ? "bg-primary-1000 scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
