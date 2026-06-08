import Image from "next/image";
import Link from "next/link";
import MainRootTagPage from "./_components/MainRootTagPage";
import Footer from "./_components/Footer";
import Logo from "@/public/logo.png";

const features = [
  {
    num: "01",
    title: "Kosan",
    desc: "Kamar dengan fasilitas bersama yang cocok untuk mahasiswa maupun pekerja.",
  },
  {
    num: "02",
    title: "Kontrakan",
    desc: "Unit penuh untuk keluarga atau kelompok dengan privasi lebih.",
  },
  {
    num: "03",
    title: "Booking Online",
    desc: "Reservasi langsung tanpa harus datang terlebih dahulu.",
  },
  {
    num: "04",
    title: "Kelola Properti",
    desc: "Pemilik dapat mengelola properti melalui dashboard yang mudah digunakan.",
  },
];

export default function Page() {
  return (
    <MainRootTagPage>
      {/* PAGE WRAPPER */}
      <div className="relative overflow-hidden bg-gradient-to-b from-white via-orange-50/30 to-neutral-50">
        {/* Global soft background blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 right-0 h-[520px] w-[520px] rounded-full bg-orange-100/35 blur-3xl" />
          <div className="absolute top-[38rem] left-0 h-[420px] w-[420px] rounded-full bg-amber-100/35 blur-3xl" />
        </div>

        {/* ================= HERO ================= */}
        <section className="relative">
          <div className="mx-auto max-w-7xl px-4 py-24 md:px-8 lg:px-12 lg:py-28">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              {/* LEFT */}
              <div className="mx-auto max-w-xl text-center">
                <div className="flex justify-center">
                  <span className="inline-flex rounded-full border border-orange-200 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-orange-600 shadow-sm backdrop-blur">
                    Kosan & Kontrakan · Bogor
                  </span>
                </div>

                <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl lg:text-6xl">
                  Temukan hunian
                  <span className="block text-orange-600">yang tepat</span>
                  di Bogor.
                </h1>

                <p className="mt-6 max-w-lg text-lg leading-relaxed text-neutral-600">
                  Platform untuk mencari kosan maupun kontrakan di Bogor dengan
                  proses yang lebih mudah, transparan, dan nyaman bagi penyewa
                  maupun pemilik properti.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Link
                    href="/properti"
                    className="rounded-xl bg-orange-600 px-6 py-3 font-medium text-white transition hover:bg-orange-700"
                  >
                    Cari Properti
                  </Link>
                  <Link
                    href="/dashboard"
                    className="rounded-xl border border-neutral-300 bg-white/80 px-6 py-3 font-medium text-neutral-700 transition hover:bg-white"
                  >
                    Saya Pemilik
                  </Link>
                </div>

                <div className="mt-10 flex flex-wrap justify-center gap-2">
                  {[
                    "Kosan",
                    "Kontrakan",
                    "Bogor",
                    "Sewa Bulanan",
                    "Tanpa Ribet",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-neutral-200 bg-white/80 px-3 py-1.5 text-sm text-neutral-600 shadow-sm backdrop-blur"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* RIGHT */}
              <div className="relative">
                <div className="overflow-hidden rounded-[32px] border border-neutral-200/80 bg-white shadow-xl">
                  <div className="relative h-[400px] md:h-[500px]">
                    <Image
                      src="/images/hero-image.png"
                      alt="Kosan dan kontrakan di Bogor"
                      fill
                      priority
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur-md">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-neutral-400">
                          Tipe
                        </p>
                        <p className="mt-1 text-sm font-semibold text-neutral-900">
                          Kosan & Kontrakan
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-neutral-400">
                          Lokasi
                        </p>
                        <p className="mt-1 text-sm font-semibold text-neutral-900">
                          Bogor, Jawa Barat
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-neutral-400">
                          Status
                        </p>
                        <p className="mt-1 text-sm font-semibold text-green-600">
                          Tersedia
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-5 left-6 hidden rounded-2xl border border-neutral-200 bg-white px-5 py-4 shadow-xl lg:block">
                  <p className="text-xs text-neutral-500">Mulai dari</p>
                  <p className="mt-1 text-xl font-bold text-neutral-900">
                    Rp 2,5 jt
                    <span className="ml-1 text-sm font-medium text-neutral-400">
                      / 2 bulan
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ABOUT ================= */}
        <section className="relative border-t border-white/60">
          <div className="mx-auto max-w-7xl px-4 py-24 md:px-8 lg:px-12 lg:py-28">
            <div className="grid items-center gap-20 lg:grid-cols-2">
              {/* LEFT */}
              <div className="max-w-xl">
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
                  Tentang Nginapin
                </span>

                <h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl">
                  Platform hunian yang memudahkan semua pihak.
                </h2>

                <p className="mt-6 text-lg leading-relaxed text-neutral-600">
                  Nginapin membantu penyewa menemukan kosan maupun kontrakan di
                  Bogor sekaligus membantu pemilik mengelola properti mereka
                  dalam satu platform yang sederhana, transparan, dan mudah
                  digunakan.
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  {features.map((item) => (
                    <div
                      key={item.num}
                      className="rounded-2xl border border-neutral-200 bg-white/90 p-5 shadow-sm transition hover:shadow-md"
                    >
                      <p className="text-xs font-semibold text-neutral-400">
                        {item.num}
                      </p>

                      <h3 className="mt-2 font-semibold text-neutral-900">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex justify-center">
                <div className="rounded-[32px] border border-neutral-200 bg-white p-6 shadow-lg">
                  <Image
                    src="/right-image.png"
                    alt="Ilustrasi Properti"
                    width={560}
                    height={650}
                    className="w-full max-w-md object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <Footer /> */}
        <footer className="relative border-t border-white/60">
          <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 lg:px-12">
            <p className="text-center text-sm text-neutral-500">
              © {new Date().getFullYear()} Nginapin. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </MainRootTagPage>
  );
}
