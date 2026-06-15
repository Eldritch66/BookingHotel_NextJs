import Link from "next/link";
import { FiShield, FiLock, FiMessageCircle } from "react-icons/fi";
import RegisterForm from "@/app/_components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="relative min-h-screen grid grid-rows-[1fr_auto]">
        <section className="flex flex-col items-center justify-center px-6 pt-28 pb-20 lg:px-16">
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-[#3b2314] text-center leading-tight mb-4 animate-fade-up">
            Create your account
          </h1>
          <p className="text-sm font-light text-[#9b8b7a] text-center leading-relaxed max-w-xs mb-10 animate-fade-up [animation-delay:100ms]">
            Register to find and book premium stays across Indonesia.
          </p>

          <div className="bg-white rounded-3xl p-9 w-full max-w-sm shadow-[0_8px_48px_rgba(107,62,38,0.10)] flex flex-col gap-6 animate-fade-up [animation-delay:200ms]">
            <RegisterForm />

            <div className="flex items-center gap-3 text-[10px] font-medium tracking-widest text-[#9b8b7a] uppercase">
              <span className="flex-1 h-px bg-[#e8e1d9]" />
              Secure Registration
              <span className="flex-1 h-px bg-[#e8e1d9]" />
            </div>

            <div className="flex gap-2">
              <TrustBadge
                icon={<FiShield className="w-5 h-5" />}
                label="Trusted"
              />
              <TrustBadge
                icon={<FiLock className="w-5 h-5" />}
                label="Secure"
              />
              <TrustBadge
                icon={<FiMessageCircle className="w-5 h-5" />}
                label="24/7 Care"
              />
            </div>
          </div>

          <p className="mt-6 text-sm text-[#9b8b7a] animate-fade-up [animation-delay:300ms]">
            Already have an account?
            <Link
              href="/login"
              className="text-[#8b5e3c] font-medium border-b border-transparent hover:border-[#8b5e3c] transition-all duration-200"
            >
              Sign in
            </Link>
          </p>
        </section>

        <footer className="col-span-full flex flex-col sm:flex-row items-center justify-between px-12 py-5 text-[10px] tracking-widest uppercase text-[#9b8b7a] gap-3">
          <span>© 2026 Nginapin. Digital Concierge Experience.</span>
          <div className="flex gap-8">
            {["Privacy", "Terms", "Contact"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="hover:text-[#8b5e3c] transition-colors duration-200"
              >
                {item}
              </Link>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}

function TrustBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex-1 flex flex-col items-center gap-2 py-3.5 px-2 bg-[#f5f0ea] rounded-xl text-[10px] font-medium tracking-widest uppercase text-[#9b8b7a]">
      <span className="text-[#8b5e3c]">{icon}</span>
      {label}
    </div>
  );
}
