"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FiMail, FiLock, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

type LoginFormProps = {
  registered?: boolean;
};

export default function LoginForm({ registered }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan password harus diisi");
      return;
    }

    setIsPending(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email atau password salah");
        setIsPending(false);
        return;
      }

      router.push("/bookings");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {registered && (
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm">
          <FiCheckCircle className="shrink-0 w-4 h-4" />
          Registrasi berhasil! Silakan masuk dengan akun Anda.
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          <FiAlertCircle className="shrink-0 w-4 h-4" />
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="text-xs font-medium tracking-widest uppercase text-[#9b8b7a]"
        >
          Email
        </label>
        <div className="relative">
          <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9b8b7a]" />
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 h-11 rounded-xl border-[#e8e1d9] bg-white text-sm text-[#3b2314] placeholder:text-[#c8b8a8] focus-visible:border-[#8b5e3c] focus-visible:ring-[#8b5e3c]/20"
            disabled={isPending}
            autoComplete="email"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="text-xs font-medium tracking-widest uppercase text-[#9b8b7a]"
        >
          Password
        </label>
        <div className="relative">
          <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9b8b7a]" />
          <Input
            id="password"
            type="password"
            placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 h-11 rounded-xl border-[#e8e1d9] bg-white text-sm text-[#3b2314] placeholder:text-[#c8b8a8] focus-visible:border-[#8b5e3c] focus-visible:ring-[#8b5e3c]/20"
            disabled={isPending}
            autoComplete="current-password"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-11 rounded-xl bg-[#8b5e3c] text-white text-sm font-medium hover:bg-[#7a5234] active:bg-[#6a462c] transition-all duration-200 cursor-pointer disabled:opacity-50"
      >
        {isPending ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
