"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FiUser, FiMail, FiLock, FiAlertCircle } from "react-icons/fi";
import { registerUser } from "../_lib/action";

export default function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!fullName || fullName.length < 2) {
      setError("Nama lengkap minimal 2 karakter");
      return;
    }

    if (!email || !email.includes("@")) {
      setError("Email tidak valid");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password minimal 8 karakter");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    setIsPending(true);

    try {
      const formData = new FormData();
      formData.append("full_name", fullName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);

      await registerUser(formData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi.",
      );
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          <FiAlertCircle className="shrink-0 w-4 h-4" />
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label
          htmlFor="full_name"
          className="text-xs font-medium tracking-widest uppercase text-[#9b8b7a]"
        >
          Nama Lengkap
        </label>
        <div className="relative">
          <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9b8b7a]" />
          <Input
            id="full_name"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="pl-10 h-11 rounded-xl border-[#e8e1d9] bg-white text-sm text-[#3b2314] placeholder:text-[#c8b8a8] focus-visible:border-[#8b5e3c] focus-visible:ring-[#8b5e3c]/20"
            disabled={isPending}
            autoComplete="name"
          />
        </div>
      </div>

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
            placeholder="Min. 8 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 h-11 rounded-xl border-[#e8e1d9] bg-white text-sm text-[#3b2314] placeholder:text-[#c8b8a8] focus-visible:border-[#8b5e3c] focus-visible:ring-[#8b5e3c]/20"
            disabled={isPending}
            autoComplete="new-password"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="confirmPassword"
          className="text-xs font-medium tracking-widest uppercase text-[#9b8b7a]"
        >
          Konfirmasi Password
        </label>
        <div className="relative">
          <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9b8b7a]" />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Ulangi password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-10 h-11 rounded-xl border-[#e8e1d9] bg-white text-sm text-[#3b2314] placeholder:text-[#c8b8a8] focus-visible:border-[#8b5e3c] focus-visible:ring-[#8b5e3c]/20"
            disabled={isPending}
            autoComplete="new-password"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-11 rounded-xl bg-[#8b5e3c] text-white text-sm font-medium hover:bg-[#7a5234] active:bg-[#6a462c] transition-all duration-200 cursor-pointer disabled:opacity-50"
      >
        {isPending ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}
