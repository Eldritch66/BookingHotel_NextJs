"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function AboutCTA() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-[1750px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-gradient-to-br from-stone-900 to-stone-800 px-8 py-16 sm:py-20 text-center"
        >
          <p className="text-amber-400 tracking-widest uppercase text-sm font-medium mb-4">
            Mulai Sekarang
          </p>
          <h2 className="text-3xl sm:text-4xl font-light text-white leading-tight mb-4">
            Siap untuk pengalaman menginap yang berbeda?
          </h2>
          <p className="text-stone-400 max-w-xl mx-auto mb-8">
            Temukan dan pesan penginapan impian Anda di seluruh Indonesia.
          </p>
          <Link
            href="/"
            className="group inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold px-8 py-3.5 rounded-full transition-all duration-300"
          >
            Jelajahi Properti
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
