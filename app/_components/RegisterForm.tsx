"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../_lib/action";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(registerUser, undefined);

  useEffect(() => {
    if (state?.success) {
      router.push("/login?registered=true");
    }
  }, [state, router]);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="space-y-1.5">
        <Label htmlFor="nama" className="text-[#3b2314] text-xs font-medium">
          Nama Lengkap
        </Label>
        <div className="relative">
          <User
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9b8b7a] pointer-events-none"
          />
          <Input
            id="nama"
            name="nama"
            type="text"
            placeholder="John Doe"
            className="h-10 pl-10 border-[#e8e1d9] bg-white text-[#3b2314] placeholder:text-[#c8b9a9] focus-visible:border-[#c8a98a] focus-visible:ring-[#c8a98a]/20 rounded-xl"
            required
            autoComplete="name"
          />
        </div>
      </div>

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
            name="email"
            type="email"
            placeholder="your@email.com"
            className="h-10 pl-10 border-[#e8e1d9] bg-white text-[#3b2314] placeholder:text-[#c8b9a9] focus-visible:border-[#c8a98a] focus-visible:ring-[#c8a98a]/20 rounded-xl"
            required
            autoComplete="email"
          />
        </div>
      </div>

      <PasswordField
        id="password"
        label="Password"
        placeholder="Min. 6 karakter"
        autoComplete="new-password"
      />

      <PasswordField
        id="confirmPassword"
        label="Konfirmasi Password"
        placeholder="Ulangi password"
        autoComplete="new-password"
      />

      {state?.error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          <AlertCircle size={16} className="shrink-0 text-red-400" />
          <span>{state.error}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-10 rounded-xl bg-[#3b2314] hover:bg-[#5c3a24] text-white text-sm font-medium transition-all cursor-pointer disabled:opacity-60"
      >
        {isPending ? "Registering..." : "Create Account"}
      </Button>
    </form>
  );
}

function PasswordField({
  id,
  label,
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  placeholder: string;
  autoComplete: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-[#3b2314] text-xs font-medium">
        {label}
      </Label>
      <div className="relative">
        <Lock
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9b8b7a] pointer-events-none"
        />
        <Input
          id={id}
          name={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className="h-10 pl-10 pr-10 border-[#e8e1d9] bg-white text-[#3b2314] placeholder:text-[#c8b9a9] focus-visible:border-[#c8a98a] focus-visible:ring-[#c8a98a]/20 rounded-xl"
          required
          minLength={6}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9b8b7a] hover:text-[#3b2314] transition-colors"
          tabIndex={-1}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}
