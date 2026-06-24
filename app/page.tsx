import Image from "next/image";
import image1 from "@/public/hero-section.jpg";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import { VscArrowSmallRight } from "react-icons/vsc";
import AboutImageCarousel from "./_components/AboutImageCarousel";
import WhyChoseUs from "./_components/WhyChoseUs";
import TestiMonial from "./_components/Testimonial";
import Faq from "./_components/Faq";
import Footer from "./_components/Footer";
import FilterMethodLandingPage from "./_components/FilterMethodLandingPage";
import MainRootTagPage from "./_components/MainRootTagPage";

export default async function Page() {
  return (
    <>
      <MainRootTagPage>
        <Image
          src={image1}
          alt="best place to stay"
          placeholder="blur"
          className="rounded-3xl object-cover object-center w-full h-175 block brightness-80"
        />
        <section className="absolute top-1/5 sm:top-1/4 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl px-4 text-white">
          <h1 className="text-4xl lg:text-6xl font-light mb-4">
            Temukan Hotel Menarik, bandingkan harga, dan <br />
            pesan liburan impian Anda dengan mudah
          </h1>
          <p className="text-base">
            Cari hotel terpercaya untuk menginap yang tak terlupakan dan
            pemesanan tanpa repot. <br /> Temukan opsi terbaik di dekat Anda
            dalam hitungan detik dengan mudah dan percaya diri.
          </p>
        </section>
        {/* Card wrapper */}
        <div className="w-full flex justify-center px-4">
          <div className="relative md:absolute md:bottom-40 bg-white max-w-xl md:max-w-5xl w-full h-auto rounded-md z-50">
            <FilterMethodLandingPage />
          </div>
        </div>
      </MainRootTagPage>
      {/* ===== ABOUT US PAGE ====== */}
      <section className="min-h-screen w-full max-w-[1700px] mx-auto mt-10">
        <div className="flex justify-center text-center mb-14">
          <p className="w-36 py-2 border-2 border-gray-200 rounded-full text-sm cursor-pointer hover:bg-gray-100">
            Kenali Kami
            <VscArrowSmallRight className="inline ml-2 text-xl" />
          </p>
        </div>
        <h2 className="text-5xl font-light text-center tracking-wide leading-tight">
          Jelajahi Penginapan, Tentang Kenyamanan, Menginap Anda, <br />
          Prioritas Kami
        </h2>
        <div className="mt-40 grid grid-cols-1 lg:grid-cols-[1fr_1.4fr_1.1fr] gap-10 mx-4">
          {/* <div className="mt-30 grid grid-cols-[300px_480px_360px]"> */}
          <div className="flex flex-col col-span-1">
            <p className="w-30 py-2 border-2 rounded-full border-gray-200 shadow-sm text-lg hover:shadow-none tracking-tight leading-tight text-center">
              Tentang Kami
            </p>
            <h3 className="text-2xl font-sans font-semibold mt-4 mb-2 tracking-wide leading-tight">
              Kami mengkhususkan diri pada hotel dan penginapan terbaik di
              seluruh Indonesia, dari resor mewah di Bali hingga vila nyaman di
              Yogyakarta.
            </h3>
            <div className="mt-8 flex items-center justify-between bg-black text-white rounded-full px-4 py-2 w-40 cursor-pointer hover:bg-gray-800">
              <span className="font-light">Pelajari Lebih Lanjut</span>
              <BsArrowUpRightCircleFill className="-mr-2" size={30} />
            </div>
          </div>
          <AboutImageCarousel />
        </div>
      </section>
      <hr className="w-min-h-screen w-full max-w-[1700px] mx-auto my-40 text-gray-300" />
      <WhyChoseUs />
      <TestiMonial />
      <Faq />
      <Footer />
    </>
  );
}
