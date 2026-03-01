"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { SlArrowLeftCircle, SlArrowRightCircle } from "react-icons/sl";
import room_one from "@/public/room1.jpg";
import room_two from "@/public/room2.jpg";
import room_three from "@/public/room3.jpg";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import { FaStarOfLife } from "react-icons/fa6";
import { BsArrowRightCircleFill } from "react-icons/bs";
import { PiSunThin } from "react-icons/pi";
import { useCallback, useEffect, useState } from "react";

export default function WhyChoseUs() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const slides = [
    { image: room_one, alt: "awesome vila" },
    { image: room_two, alt: "awesome hotels" },
    { image: room_three, alt: "awesome resort" },
  ];

  const [selectedIndex, setSelectedIndex] = useState(1);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap() + 1);
    };

    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);
  const goToPrev = () => emblaApi?.scrollPrev();
  const goToNext = () => emblaApi?.scrollNext();

  return (
    <section className="min-h-screen w-full max-w-7xl mx-auto grid grid-cols-2 mt-40 gap-20">
      <div className="flex flex-col">
        <ul className="flex flex-row mb-10 gap-4 ">
          <li className="flex items-center mr-6">
            <PiSunThin size={28} />
          </li>
          <li className="px-3 py-1 text-center text-sm font-medium rounded-full border border-gray-200 shadow-sm hover:bg-black hover:text-white cursor-pointer">
            Vila
          </li>
          <li className="px-3 py-1 text-center text-sm font-medium rounded-full border border-gray-200 shadow-sm hover:bg-black hover:text-white cursor-pointer">
            Resort
          </li>
          <li className="px-3 py-1 text-center text-sm font-medium rounded-full border border-gray-200 shadow-sm hover:bg-black hover:text-white cursor-pointer">
            Hotel
          </li>
        </ul>
        <div className="embla h-125 w-full relative bg-[#a67f71] rounded-3xl flex items-center">
          <div className="grid grid-cols-[2.2fr_2fr] h-[400px] gap-8">
            <div className="embla__viewport h-full ml-2" ref={emblaRef}>
              <div className="embla__container flex h-full ">
                {slides.map((image) => (
                  <div
                    key={image.alt}
                    className="embla__slide relative h-full "
                  >
                    <Image
                      src={image.image}
                      key={image.alt}
                      alt="awesome vila"
                      fill
                      className="object-cover rounded-2xl shadow-md"
                    />
                  </div>
                ))}
                {/* <div className="embla__slide relative h-full ">
                  <Image
                    src={room_one}
                    alt="awesome vila"
                    fill
                    className="object-cover rounded-2xl shadow-md"
                  />
                </div>
                <div className="embla__slide relative h-full">
                  <Image
                    src={room_two}
                    alt="awesome hotels"
                    fill
                    className="object-cover rounded-2xl shadow-md"
                  />
                </div>
                <div className="embla__slide relative h-full">
                  <Image
                    src={room_three}
                    alt="awesome resort"
                    fill
                    className="object-cover rounded-2xl shadow-md"
                  />
                </div> */}
              </div>
            </div>
            <div className="p-6 flex flex-col justify-between">
              <h2 className="text-2xl font-light leading-tight text-white">
                Comfortable Rooms with excellent care
              </h2>
              <p className="text-sm text-neutral-300 mb-3">
                Experience serene spaces crafted with attention to detail,
                ensuring every moment feels personal and refined.
              </p>
              <div className="flex items-center justify-between bg-black text-white rounded-full px-4 py-1.5 w-34 cursor-pointer hover:bg-gray-800">
                <span className="font-extralight text-sm">See Details</span>
                <BsArrowUpRightCircleFill className="-mr-2" size={30} />
              </div>
              <div className="font-extralight">
                <span className="text-xl text-white">{selectedIndex} </span>
                <span className="text-xl text-gray-300">/ {slides.length}</span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-2 right-6 z-50">
            <button className="embla__prev mr-2 text-white" onClick={goToPrev}>
              <SlArrowLeftCircle size={40} />
            </button>
            <button className="embla__next" onClick={goToNext}>
              <BsArrowRightCircleFill className="text-white" size={40} />
            </button>
          </div>
        </div>
      </div>
      <div className="w-full h-full">
        <h2 className="text-5xl leading-tight">
          Discover Excellence in Hospitality. Trusted Hotels You Can Rely On
        </h2>
        <div className="grid grid-cols-2 h-full w-full gap-6 mt-10">
          <Image
            src={room_one}
            alt="discover our best hotels"
            className="h-[354px] object-cover rounded-4xl"
          />
          <div className="w-full h-85 flex flex-col justify-center">
            <FaStarOfLife size={20} className="mb-4" />
            <p className="self-center font-extralight">
              Discover thoughtfully designed spaces where elegance meets
              tranquility. From private villas to refined resort suites, every
              stay is crafted to offer warmth, serenity, and exceptional
              hospitality.
            </p>
          </div>
        </div>

        {/* small feature card */}
      </div>
    </section>
  );
}
