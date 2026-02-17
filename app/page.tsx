import Image from "next/image";
import Header from "./components/Header";
import image1 from "@/public/hero-section.jpg";
import DropDown from "./components/DropDown";
import { IoCameraOutline } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";
import { PiCurrencyCircleDollarLight } from "react-icons/pi";
import { VscArrowSmallRight } from "react-icons/vsc";
import { BiSolidRightTopArrowCircle } from "react-icons/bi";
import AboutImageCarousel from "./components/AboutImageCarousel";

const dataTypeHotel = [
  {
    label: "Location",
    icon: <IoLocationOutline />,
    options: [
      "Bogor, Jawa Barat",
      "Bali, Indonesia",
      "Yogyakarta, Indonesia",
      "Bandung, Indonesia",
      "Jakarta, Indonesia",
    ],
  },
  {
    label: "Type",
    icon: <IoCameraOutline />,
    options: ["Hotel", "Villa", "Resort"],
  },
  {
    label: "Price",
    icon: <PiCurrencyCircleDollarLight />,
    options: ["Budget", "Mid-range", "Luxury", "All"],
  },
];

export default function Home() {
  return (
    <>
      <div className="h-[2000px]">
        <Header />
        <div className="min-h-screen w-full max-w-7xl mx-auto text-center relative">
          <Image
            src={image1}
            alt="best place to stay"
            className="rounded-3xl object-cover object-center w-full h-175 block brightness-90"
          />
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white w-full px-4 ">
            <h1 className="text-5xl font-light mb-4">
              Find Amazing Hotels, compare prices, and <br />
              book your dream vacation easily
            </h1>
            <p className="text-base">
              Search trusted hotels for unforgettable stays and hassle-free
              bookings. <br /> Find the best options near you in seconds with
              ease and confidence.
            </p>
          </div>
          <div className="w-full flex justify-center">
            <div className="absolute -bottom-14  bg-white max-w-5xl w-full h-40 rounded-md z-50 ">
              <section className="flex justify-start w-full h-full shadow-xl">
                <div className="flex items-center justify-center gap-4 px-4 py-6 w-full">
                  {/* {dataTypeHotel.map((item) => (
                    <div key={item.label} className="flex flex-col gap-2">
                      <span>{item.label}</span>
                      <DropDown icon={item.icon} options={item.options} />
                    </div>
                  ))} */}
                  {dataTypeHotel.map((item) => (
                    <div key={item.label} className="flex flex-col gap-2">
                      <span className="font-light">{item.label}</span>
                      <DropDown icon={item.icon} options={item.options} />
                    </div>
                  ))}
                  <div className="flex flex-col gap-2"></div>
                  <div className="flex flex-col gap-2">
                    <span className="opacity-0">Label</span>
                    <button className="h-12 px-6 rounded-md bg-black text-white cursor-pointer">
                      Search Hotel
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* ===== ABOUT US PAGE ====== */}
        <section className="min-h-screen w-full max-w-7xl mx-auto mt-28">
          <div className="flex justify-center text-center mb-14">
            <p className="w-36 py-2 border-2 border-gray-200 rounded-full text-sm cursor-pointer hover:bg-gray-100">
              Let&apos;s know us
              <VscArrowSmallRight className="inline ml-2 text-xl" />
            </p>
          </div>
          <h2 className="text-5xl font-light text-center tracking-wide leading-tight">
            Explore Stays, About Comfort, Your Stay, <br />
            Our Priority
          </h2>
          <div className="mt-30 grid grid-cols-[1fr_1.4fr_1.1fr] gap-10">
            {/* <div className="mt-30 grid grid-cols-[300px_480px_360px]"> */}
            <div className="flex flex-col col-span-1">
              <p className="w-20 py-2 border-2 rounded-full border-gray-200 shadow-sm text-sm hover:shadow-none tracking-tight leading-tight text-center">
                About Us
              </p>
              <h3 className="text-xl font-light mt-4 mb-2 tracking-wide leading-tight">
                We specialize in the best hotels and stays across Indonesia,
                from luxury resorts in Bali to cozy villas in Yogyakarta.
              </h3>
              <div className="mt-8 flex items-center justify-between bg-black text-white rounded-full px-4 py-2 w-40 cursor-pointer hover:bg-gray-800">
                <span className="font-light">Learn More</span>
                <BiSolidRightTopArrowCircle className="text-4xl -mr-4" />
              </div>
            </div>
            <AboutImageCarousel />
          </div>
        </section>
      </div>
    </>
  );
}
