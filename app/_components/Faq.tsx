"use client";

import { useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";

const faqList = [
  {
    h3: "How do I modify or cancel my booking?",
    p: "You can easily manage your reservation through your account dashboard. Simply go to 'My Bookings', select your stay, and choose modify or cancel. Please note that cancellation policies may vary depending on the property.",
  },
  {
    h3: "What payment methods are accepted?",
    p: "We accept major credit and debit cards, bank transfers, and selected Indonesian payment gateways. All transactions are securely processed to ensure your safety and privacy.",
  },
  {
    h3: "When will I receive my booking confirmation?",
    p: "Booking confirmations are sent instantly to your registered email after successful payment. You can also view your reservation details anytime in your account.",
  },
  {
    h3: "Is there a cancellation fee?",
    p: "Cancellation fees depend on the property’s individual policy. Some stays offer free cancellation within a specific time frame, while others may apply a partial charge.",
  },
  {
    h3: "Do you offer a best price guarantee?",
    p: "Yes. If you find a lower publicly available price for the same property and dates, we will review and match it according to our best price guarantee policy.",
  },
];

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null); //activeIndex can be number or null FUCK IT I ALWAYS FORGET ABOUT THISS!!
  const handleClick = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index); // buka yang baru (yang lama otomatis tertutup)
    }
  };
  return (
    <section className="min-h-screen w-full md:max-w-[1400px] lg:max-w-[1600px] grid grid-rows-none md:grid-cols-3 mt-10 sm:mt-30 mx-auto text-black md:gap-20">
      <div className="md:col-span-1">
        <h2 className="text-6xl text-center mt-20 mb-8 mx-4 md:text-left md:ml-8">
          General <br /> FAQ <br /> By Clients
        </h2>
        <p className="text-gray-400 text-center mx-4 md:text-left md:ml-8">
          Here is a list of frequently asked questions (FAQ) titles that you can
          use as a reference
        </p>
      </div>
      <div className="md:col-span-2">
        <ul className="h-full grid grid-row-5 mt-4 md:mt-20 mb-8 ml-8">
          {faqList.map((faq, index) => (
            <li key={index} className="cursor-pointer">
              <div
                className="flex justify-between items-center "
                onClick={() => handleClick(index)}
              >
                <h3 className="text-2xl font-extralight">{faq.h3}</h3>

                {/* Icon */}
                {activeIndex === index ? (
                  <MdKeyboardArrowDown size={30} />
                ) : (
                  <MdKeyboardArrowRight size={30} />
                )}
              </div>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  activeIndex === index
                    ? "max-h-40 mt-4 opacity-100"
                    : "max-h-2 opacity-0"
                }`}
              >
                <p className="text-gray-500">{faq.p}</p>
              </div>
              <hr className="w-full mt-4 " />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
