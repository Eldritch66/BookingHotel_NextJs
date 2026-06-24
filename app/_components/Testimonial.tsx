"use client";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import type { EmblaCarouselType } from "embla-carousel";
import Image from "next/image";

const testimonials = [
  {
    comment:
      "Dengan dedikasi dan keahlian kami dalam perhotelan, kami berusaha menyediakan penginapan yang bukan sekadar akomodasi, tetapi perjalanan nyaman menuju relaksasi dan pengalaman tak terlupakan.",
    name: "Azan Mohammad",
    role: "Product Manager at JMK Studio",
    avatar: "/avatar2.jpg",
  },
  {
    comment:
      "Pemesanan berjalan lancar dan resortnya melebihi ekspektasi. Sangat direkomendasikan untuk keluarga.",
    name: "Rina Putri",
    role: "Travel Blogger",
    avatar: "/avatar1.jpg",
  },
  {
    comment:
      "Kami telah menginap di banyak resor di seluruh Indonesia, tetapi yang ini menonjol. Suasananya tenang, kamarnya nyaman, dan layanannya terasa tulus. Ini menciptakan pengalaman menginap yang tak terlupakan.",
    name: "Clara Wijaya",
    role: "Lifestyle Content Creator",
    avatar: "/avatar5.jpg",
  },
  {
    comment:
      "Seluruh pengalaman berjalan mulus dari awal hingga akhir. Platform ini membantu kami menemukan vila yang sempurna, dan propertinya sesuai dengan foto-fotonya. Setiap detail mencerminkan kenyamanan, kualitas, dan keramahtamahan yang tulus.",

    name: "Rizky Mahendra",
    role: "Business Consultant",
    avatar: "/avatar4.jpg",
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
    <section className="relative py-32 mt-30 overflow-hidden">
      {/* Circle Background */}
      <div className="absolute top-1/3 left-1/2 w-[800px] h-[800px] border border-gray-200 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-80"></div>

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

                <div className="flex flex-row justify-center items-center gap-3">
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
