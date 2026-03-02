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
  const [activeIndex, setActiveIndex] = useState(null);
  const handleClick = (index: number | null) => {
    if (activeIndex === index) {
      setActiveIndex(null); // tutup jika klik yang sama
    } else {
      setActiveIndex(index); // buka yang baru (yang lama otomatis tertutup)
    }
  };
  return (
    <section className="min-h-screen w-full max-w-7xl grid grid-cols-3 mt-40 mx-auto text-black gap-20">
      <div className="col-span-1">
        <h2 className="text-6xl mt-20 mb-8 ml-8">
          General FAQ <br /> By Clients
        </h2>
        <p className="text-gray-400 ml-8">
          Here is a list of frequently asked questions (FAQ) titles that you can
          use as a reference
        </p>
      </div>
      <div className="col-span-2">
        <ul className="h-full grid grid-row-5  mt-20 mb-8 ml-8">
          {faqList.map((faq, index) => (
            <>
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
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-gray-500">{faq.p}</p>
                </div>
                <hr className="w-9/10 mt-4 " />
              </li>
            </>
          ))}
          {/* <li>
            <h3 className="text-2xl">How do i modify or cancel my booking</h3>
            <hr className="w-9/10 mt-2" />
          </li>
          <li>
            <h3 className="text-2xl">Is breakfast included in the price</h3>
            <hr className="w-9/10 mt-2" />
          </li>
          <li>
            <h3 className="text-2xl">
              How does the &ldquo;Best Price Guarantee&ldquo;Work?
            </h3>
            <hr className="w-9/10 mt-2" />
          </li>
          <li>
            <h3 className="text-2xl" onClick={() => setIsClicked(!isClicked)}>
              What is your refund policy?
            </h3>
            {isClicked && (
              <p className="py-4">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Officia debitis rem consequatur facere excepturi delectus?
                Sapiente fuga necessitatibus modi placeat.
              </p>
            )}
            <hr className="w-9/10 mt-2" />
          </li>
          <li>
            <h3
              className="text-2xl cursor-pointer"
              onClick={() => setIsClicked(!isClicked)}
            >
              What payment methods do you accept?
            </h3>
            {isClicked && (
              <p className="py-4">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Officia debitis rem consequatur facere excepturi delectus?
                Sapiente fuga necessitatibus modi placeat.
              </p>
            )}
            <hr className="w-9/10 mt-2" />
          </li> */}
        </ul>
      </div>
    </section>
  );
}
