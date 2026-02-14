import Image from "next/image";
import Header from "./components/Header";
import image1 from "@/public/hero-section.jpg";
import DropDown from "./components/DropDown";

export default function Home() {
  return (
    <div className="h-[2000px]">
      <Header />
      <div className="min-h-screen w-full max-w-7xl mx-auto text-center relative">
        <Image
          src={image1}
          alt="best place to stay"
          className="rounded-3xl object-cover object-center w-full h-175 block brightness-90"
        />
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white w-full px-4 ">
          <h1 className="text-5xl font-semibold mb-4">
            Find Amazing Hotels, compare prices, and <br />
            book your dream vacation easily
          </h1>
          <p className="text-base">
            Search trusted hotels for unforgettable stays and hassle-free
            bookings. <br /> Find the best options near you in seconds with ease
            and confidence.
          </p>
        </div>
        <div className="w-full flex justify-center">
          <div className="absolute -bottom-0  bg-white w-6xl h-40 rounded-md z-50 ">
            <section className="flex justify-start w-full h-full">
              <div className="items-center flex gap-4 px-4 py-6">
                <DropDown />
                <span>Location</span>
                <span>Type</span>
                <span>Price</span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
