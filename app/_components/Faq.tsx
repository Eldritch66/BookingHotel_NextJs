"use client";

import { useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";

const faqList = [
  {
    h3: "Bagaimana cara mengubah atau membatalkan pemesanan saya?",
    p: "Anda dapat dengan mudah mengelola booking Anda melalui dasbor akun. Cukup buka 'Pemesanan Saya', pilih penginapan Anda, dan pilih ubah atau batalkan. Harap diperhatikan bahwa kebijakan pembatalan dapat bervariasi tergantung pada properti.",
  },
  {
    h3: "Metode pembayaran apa yang diterima?",
    p: "Kami menerima kartu kredit dan debit utama, transfer bank, dan gerbang pembayaran Indonesia terpilih. Semua transaksi diproses dengan aman untuk memastikan keamanan dan privasi Anda.",
  },
  {
    h3: "Kapan saya akan menerima konfirmasi pemesanan?",
    p: "Konfirmasi pemesanan dikirim secara instan ke email terdaftar Anda setelah pembayaran berhasil. Anda juga dapat melihat detail booking kapan saja di akun Anda.",
  },
  {
    h3: "Apakah ada biaya pembatalan?",
    p: "Biaya pembatalan tergantung pada kebijakan masing-masing properti. Beberapa penginapan menawarkan pembatalan gratis dalam jangka waktu tertentu, sementara yang lain mungkin menerapkan biaya parsial.",
  },
  {
    h3: "Apakah Anda menawarkan garansi harga terbaik?",
    p: "Ya. Jika Anda menemukan harga yang lebih rendah yang tersedia untuk umum untuk properti dan tanggal yang sama, kami akan meninjau dan menyamakannya sesuai dengan kebijakan garansi harga terbaik kami.",
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
          FAQ <br /> Umum <br /> oleh Klien
        </h2>
        <p className="text-gray-400 text-center mx-4 md:text-left md:ml-8">
          Berikut adalah daftar pertanyaan yang sering diajukan (FAQ) yang dapat
          Anda gunakan sebagai referensi
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
