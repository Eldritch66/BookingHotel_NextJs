import { SlArrowLeftCircle } from "react-icons/sl";
import { SlArrowRightCircle } from "react-icons/sl";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";

import room_one from "@/public/room1.jpg";
import room_two from "@/public/room2.jpg";
import Image from "next/image";
export default function AboutImageCarousel() {
  return (
    <>
      <article className="image_one relative">
        <Image
          src={room_one}
          alt="best place to stay"
          className="rounded-3xl object-cover object-center w-full h-full absolute brightness-90 "
        />
        <span className="px-3 py-1 text-sm rounded-full border-2 border-amber-50 text-white drop-shadow-md left-4 top-4 absolute">
          Outdoor Area
        </span>
        <span
          className="absolute right-4 top-4 text-lg font-extralight tracking-wide leading-[1.425] text-white drop-shadow-md
                "
        >
          A trusted platform <br /> connecting you to Indonesia’s <br /> finest
          hotels, villas, and resorts.
        </span>
        <p className="px-3 py-1 text-xs rounded-full border-2 border-amber-50 text-white backdrop-blur drop-shadow-md left-4 bottom-4 absolute tracking-tight flex flex-row gap-2 items-center">
          <IoLocationOutline size={20} />
          <span>Bogor, Jawa Barat</span>
        </p>

        <BsArrowUpRightCircleFill
          size={40}
          className="absolute bottom-4 right-4 z-10 text-white cursor-pointer hover:text-gray-300"
        />
      </article>
      <article className="image_two flex flex-col justify-evenly relative">
        <div className="h-[70%] relative">
          <span className="px-3 py-1 text-sm rounded-full border-2 border-amber-50 text-white drop-shadow-md left-4 top-4 absolute z-10">
            out door
          </span>
          <p className="px-3 py-1 text-xs rounded-full border-2 border-amber-50 text-white backdrop-blur drop-shadow-md left-4 bottom-4 absolute tracking-tight flex flex-row gap-2 items-center z-10">
            <IoLocationOutline size={20} />
            <span>Bogor, Jawa Barat</span>
          </p>
          <BsArrowUpRightCircleFill
            size={40}
            className="absolute bottom-4 right-4 z-10 text-white cursor-pointer hover:text-gray-300"
          />
          <Image
            src={room_two}
            alt="best place to stay"
            className="rounded-3xl object-cover object-center w-full h-full block brightness-90 row-span-2"
          />
        </div>
        <p className="text-md font-light tracking-wide leading-tight mb-10">
          We are committed to providing exceptional service, ensuring that every
          guest enjoys a memorable and comfortable stay with us.
        </p>
        <div className="absolute right-4 bottom-0 flex flex-row gap-2">
          <button className="cursor-pointer">
            <SlArrowLeftCircle size={36} />
          </button>
          <button className="cursor-pointer">
            <SlArrowRightCircle size={36} />
          </button>
        </div>
      </article>
    </>
  );
}
