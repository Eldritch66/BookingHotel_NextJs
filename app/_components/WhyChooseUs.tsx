import { IoHomeOutline } from "react-icons/io5";
import { RiCustomerService2Fill } from "react-icons/ri";

export default function WhyChooseUs() {
  return (
    <div className="col-span-1 lg:col-span-2 w-full h-full bg-[#f6f6f6] grid grid-cols-1 gap-6 md:grid-cols-3 items-center rounded-4xl mt-30 sm:mt-20">
      <div className="flex flex-col items-center">
        <IoHomeOutline size={30} />
        <p className="font-bold text-xl my-4">Terpercaya</p>
        <p className="text-sm font-extralight text-center">
          Sewa properti dengan mitra terbaik yang sudah <br /> terverifikasi
        </p>
      </div>
      <div className="flex flex-col items-center">
        <IoHomeOutline size={30} />
        <p className="font-bold text-xl my-4">Best Price Guarantee</p>
        <p className="text-sm font-extralight text-center max-w-2/3">
          Find the same room cheaper elsewhere and we`&apos;ll match the price
          plus 5% discount.
        </p>
      </div>
      <div className="flex flex-col items-center">
        <RiCustomerService2Fill size={30} />
        <p className="font-bold text-xl my-4">24/7 Support</p>
        <p className="text-sm font-extralight text-center max-w-2/3">
          Our local travel concierge is available around the colock for any
          assistance you need
        </p>
      </div>
    </div>
  );
}
