"use client";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import type { EmblaCarouselType } from "embla-carousel";
import Image from "next/image";

const testimonials = [
  {
    comment:
      "With our dedication and expertise in hospitality, we strive to provide stays that are not just accommodations, but a comforting journey toward relaxation and memorable experiences.",
    name: "Azan Mohammad",
    role: "Product Manager at JMK Studio",
    avatar: "/avatar2.jpg",
  },
  {
    comment:
      "Booking was seamless and the resort exceeded expectations. Highly recommended for families.",
    name: "Rina Putri",
    role: "Travel Blogger",
    avatar: "/avatar3.jpg",
  },
  {
    comment:
      "What impressed me the most was how effortless the entire process was. The platform made it easy to compare options and choose the perfect villa for our family getaway. The property matched the photos beautifully and the service exceeded expectations in every way.",
    name: "Clara Wijaya",
    role: "Lifestyle Content Creator",
    avatar: "/avatar4.jpg",
  },
  {
    comment:
      "We’ve stayed in many resorts across Indonesia, but this experience felt different. The attention to detail, comfort of the rooms, and the sense of calm throughout the property created a memorable stay. It truly reflects a commitment to quality and authentic hospitality.",
    name: "Rizky Mahendra",
    role: "Business Consultant",
    avatar: "/avatar5.jpg",
  },
];

export default function TestiMonial() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ]);

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
    <section className="relative py-32 overflow-hidden">
      {/* Circle Background */}
      <div className="absolute top-1/2 left-1/2 w-[900px] h-[900px] "></div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <p className="text-sm tracking-widest uppercase text-gray-500 mb-6">
          Testimonial
        </p>

        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((item, index) => (
              <div key={index} className="flex-[0_0_100%] px-10">
                <p className="text-2xl leading-relaxed text-gray-800 mb-10">
                  “{item.comment}”
                </p>

                <div className="flex flex-col items-center gap-3">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    width={60}
                    height={60}
                    quality={40}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-10">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition cursor-pointer ${
                index === selectedIndex ? "bg-black scale-125" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
