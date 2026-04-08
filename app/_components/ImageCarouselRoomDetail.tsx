"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ImageCarouselRoomDetail({
  images,
}: {
  images: { image_url: string }[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [currentIndex, setCurrentIndex] = useState(1);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentIndex(emblaApi.selectedScrollSnap() + 1);
    };

    emblaApi.on("select", onSelect);

    // set awal
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);
  return (
    <section className="block md:hidden relative">
      <div className="embla" ref={emblaRef}>
        <div className="flex">
          {images.map((img, i) => (
            <div key={i} className="min-w-full relative h-[50vh] md:h-[60vh]">
              <Image src={img.image_url} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-2 right-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
        {currentIndex} / {images.length}
      </div>
    </section>
  );
}
