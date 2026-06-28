"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const founders = [
  {
    name: "Petrik Albadri",
    role: "CEO & Founder",
    image: "/about_Us/ceo_satu.png",
    objectPosition: "object-center",
  },
  {
    name: "Regal",
    role: "CFO & Co-Founder",
    image: "/about_Us/ceo_dua.png",
    objectPosition: "object-top",
  },
  {
    name: "Are",
    role: "CTO & Co-Founder",
    image: "/about_Us/ceo_tiga.png",
    objectPosition: "object-top",
  },
  {
    name: "Pitol",
    role: "UI/UX & Co-Founder",
    image: "/about_Us/ceo_empat.png",
    objectPosition: "object-top",
  },
];

export default function AboutHero() {
  return (
    <section className="py-20 sm:py-28 px-4">
      <div className="max-w-[1750px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Company text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-amber-600 tracking-widest uppercase text-sm font-medium mb-4">
              Tentang Kami
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-stone-800 leading-tight mb-6">
              Nginapin adalah platform booking penginapan terpercaya di
              Indonesia
            </h1>
            <p className="text-stone-500 leading-relaxed text-lg mb-6">
              Kami menghubungkan para pelancong dengan properti terbaik — dari
              hotel mewah, villa nyaman, hingga penginapan tradisional — di
              berbagai kota Indonesia. Transparan, mudah, dan aman.
            </p>
            <p className="text-stone-500 leading-relaxed mb-8">
              Misi kami sederhana: membuat pencarian dan pemesanan penginapan
              menjadi pengalaman yang menyenangkan, tanpa ribet, dan bisa
              diakses oleh siapa saja.
            </p>

            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-3xl font-bold text-stone-800">2.500+</p>
                <p className="text-stone-500 text-sm">Properti</p>
              </div>
              <div className="w-px bg-stone-200" />
              <div>
                <p className="text-3xl font-bold text-stone-800">50+</p>
                <p className="text-stone-500 text-sm">Kota</p>
              </div>
              <div className="w-px bg-stone-200" />
              <div>
                <p className="text-3xl font-bold text-stone-800">15.000+</p>
                <p className="text-stone-500 text-sm">Pelanggan</p>
              </div>
            </div>
          </motion.div>

          {/* Right: 4 CEO photos — 2x2 grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid grid-cols-2 gap-4"
          >
            {founders.map((founder, i) => (
              <motion.div
                key={founder.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-stone-100 mb-3">
                  <Image
                    src={founder.image}
                    alt={founder.name}
                    fill
                    className={`object-cover ${founder.objectPosition}`}
                  />
                </div>
                <h3 className="font-semibold text-stone-800 text-sm">
                  {founder.name}
                </h3>
                <p className="text-amber-600 text-xs">{founder.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
