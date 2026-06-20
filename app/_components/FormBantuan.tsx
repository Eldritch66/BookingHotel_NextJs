"use client";

import { useActionState } from "react";
import { kirimTiketBantuan } from "../_lib/action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  CheckCircle2,
  Send,
  Sparkles,
} from "lucide-react";

const kategoriList = [
  { value: "teknis", label: "Teknis" },
  { value: "properti", label: "Properti" },
  { value: "pembayaran", label: "Pembayaran" },
  { value: "akun", label: "Akun" },
  { value: "lainnya", label: "Lainnya" },
];

export default function FormBantuan() {
  const [state, formAction, isPending] = useActionState(
    kirimTiketBantuan,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {/* Judul */}
      <div className="space-y-1.5">
        <Label
          htmlFor="judul"
          className="text-sm font-bold uppercase tracking-wide text-neutral-800"
        >
          Judul
        </Label>
        <Input
          id="judul"
          name="judul"
          type="text"
          placeholder="Misal: Kendala saat booking properti"
          className="h-11 border-2 border-neutral-900 bg-white px-4 text-neutral-900 shadow-[3px_3px_0px_#292524] transition-all placeholder:text-neutral-400 focus-visible:shadow-[5px_5px_0px_#292524] focus-visible:border-orange-500 rounded-lg"
          required
        />
      </div>

      {/* Kategori */}
      <div className="space-y-1.5">
        <Label className="text-sm font-bold uppercase tracking-wide text-neutral-800">
          Kategori
        </Label>
        <Select name="kategori" required>
          <SelectTrigger className="h-11 w-full border-2 border-neutral-900 bg-white px-4 text-neutral-900 shadow-[3px_3px_0px_#292524] transition-all focus-visible:shadow-[5px_5px_0px_#292524] focus-visible:border-orange-500 rounded-lg data-placeholder:text-neutral-400">
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
          <SelectContent className="border-2 border-neutral-900 shadow-[4px_4px_0px_#292524] rounded-lg">
            {kategoriList.map((k) => (
              <SelectItem
                key={k.value}
                value={k.value}
                className="cursor-pointer font-medium"
              >
                {k.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pesan */}
      <div className="space-y-1.5">
        <Label
          htmlFor="pesan"
          className="text-sm font-bold uppercase tracking-wide text-neutral-800"
        >
          Pesan
        </Label>
        <Textarea
          id="pesan"
          name="pesan"
          placeholder="Jelaskan keluhan atau pertanyaanmu secara detail..."
          className="min-h-[120px] border-2 border-neutral-900 bg-white px-4 py-3 text-neutral-900 shadow-[3px_3px_0px_#292524] transition-all placeholder:text-neutral-400 focus-visible:shadow-[5px_5px_0px_#292524] focus-visible:border-orange-500 rounded-lg resize-y"
          required
        />
      </div>

      {/* Error */}
      {state?.error && (
        <div className="flex items-center gap-2 rounded-lg border-2 border-red-500 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 shadow-[2px_2px_0px_#dc2626]">
          <AlertCircle size={16} className="shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Success */}
      {state?.success && (
        <div className="flex items-center gap-2 rounded-lg border-2 border-emerald-500 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600 shadow-[2px_2px_0px_#059669]">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>Tiket berhasil dikirim! Tim kami akan menghubungi kamu segera.</span>
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isPending}
        className="group relative h-12 w-full overflow-hidden rounded-lg border-2 border-neutral-900 bg-orange-500 font-bold uppercase tracking-wider text-white shadow-[4px_4px_0px_#292524] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#292524] active:translate-y-0.5 active:shadow-[2px_2px_0px_#292524] disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_#292524] cursor-pointer"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Mengirim...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send size={16} className="transition-transform group-hover:rotate-12" />
            Kirim Tiket Bantuan
            <Sparkles size={16} className="opacity-70" />
          </span>
        )}
      </Button>
    </form>
  );
}
