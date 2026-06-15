"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

export default function LoginForm({ registered }: { registered?: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
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
      } else {
        window.location.href = "/properti";
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {registered && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
          <span>Registrasi berhasil! Silakan login.</span>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-[#3b2314] text-xs font-medium">
          Email
        </Label>
        <div className="relative">
          <Mail
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9b8b7a] pointer-events-none"
          />
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 pl-10 border-[#e8e1d9] bg-white text-[#3b2314] placeholder:text-[#c8b9a9] focus-visible:border-[#c8a98a] focus-visible:ring-[#c8a98a]/20 rounded-xl"
            required
            autoComplete="email"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-[#3b2314] text-xs font-medium">
          Password
        </Label>
        <div className="relative">
          <Lock
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9b8b7a] pointer-events-none"
          />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-10 pl-10 pr-10 border-[#e8e1d9] bg-white text-[#3b2314] placeholder:text-[#c8b9a9] focus-visible:border-[#c8a98a] focus-visible:ring-[#c8a98a]/20 rounded-xl"
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9b8b7a] hover:text-[#3b2314] transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          <AlertCircle size={16} className="shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-10 rounded-xl bg-[#3b2314] hover:bg-[#5c3a24] text-white text-sm font-medium transition-all cursor-pointer disabled:opacity-60"
      >
        {isPending ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
