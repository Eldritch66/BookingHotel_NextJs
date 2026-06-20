"use client";

import { useFormStatus } from "react-dom";
import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import Image from "next/image";
import type { PropertiRaw } from "@/app/_lib/type";

const MAX_FILE_SIZE = 1 * 1024 * 1024;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 bg-[#a67f71] text-white px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
    >
      {pending ? "Menyimpan..." : "Simpan Perubahan"}
    </button>
  );
}

export default function FormEditProperti({
  properti,
  editProperti,
}: {
  properti: PropertiRaw;
  editProperti: (formData: FormData) => Promise<void>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("Tidak ada file dipilih");
  const [fileError, setFileError] = useState("");
  const unit = Array.isArray(properti.unit) ? properti.unit[0] : properti.unit;
  const existingFoto = properti.foto_properti?.[0]?.url ?? "";

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setFileName("Tidak ada file dipilih");
      setFileError("");
      return;
    }
    setFileName(file.name);
    if (file.size > MAX_FILE_SIZE) {
      setFileError("Ukuran file maksimal 1MB");
    } else {
      setFileError("");
    }
  }

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        const file = formData.get("foto") as File | null;
        if (file && file.size > MAX_FILE_SIZE) {
          setFileError("Ukuran file maksimal 1MB");
          return;
        }
        await editProperti(formData);
      }}
      className="border border-stone-200 bg-white p-6 sm:p-8 space-y-5 max-w-lg"
    >
      <input type="hidden" name="properti_id" value={properti.id} />

      <div>
        <label htmlFor="nama_properti" className="block text-sm font-medium text-stone-700 mb-1">Nama Properti</label>
        <input id="nama_properti" name="nama_properti" required defaultValue={properti.nama_properti}
          className="w-full border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#a67f71]/40" placeholder="Kost Mawar Indah" />
      </div>

      <div>
        <label htmlFor="tipe" className="block text-sm font-medium text-stone-700 mb-1">Tipe Properti</label>
        <select id="tipe" name="tipe" required defaultValue={properti.tipe}
          className="w-full border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#a67f71]/40">
          <option value="kost">Kost</option>
          <option value="kontrakan">Kontrakan</option>
        </select>
      </div>

      <div>
        <label htmlFor="alamat" className="block text-sm font-medium text-stone-700 mb-1">Alamat</label>
        <textarea id="alamat" name="alamat" required rows={3} defaultValue={properti.alamat}
          className="w-full border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#a67f71]/40 resize-none" placeholder="Jl. Contoh No. 123, Bogor" />
      </div>

      <div>
        <label htmlFor="harga_per_bulan" className="block text-sm font-medium text-stone-700 mb-1">Harga per Bulan (Rp)</label>
        <input id="harga_per_bulan" name="harga_per_bulan" type="number" min={0} required defaultValue={properti.harga_per_bulan}
          className="w-full border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#a67f71]/40" placeholder="500000" />
      </div>

      <div>
        <label htmlFor="luas_bangunan" className="block text-sm font-medium text-stone-700 mb-1">Luas Bangunan (m²)</label>
        <input id="luas_bangunan" name="luas_bangunan" type="number" min={0} defaultValue={unit?.luas_bangunan ?? ""}
          className="w-full border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#a67f71]/40" placeholder="60" />
      </div>

      <div>
        <label htmlFor="jumlah_kamar_tidur" className="block text-sm font-medium text-stone-700 mb-1">Jumlah Kamar Tidur</label>
        <input id="jumlah_kamar_tidur" name="jumlah_kamar_tidur" type="number" min={1} required defaultValue={unit?.jumlah_kamar_tidur ?? 1}
          className="w-full border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#a67f71]/40" />
      </div>

      <div>
        <label htmlFor="jumlah_kamar_mandi" className="block text-sm font-medium text-stone-700 mb-1">Jumlah Kamar Mandi</label>
        <input id="jumlah_kamar_mandi" name="jumlah_kamar_mandi" type="number" min={1} required defaultValue={unit?.jumlah_kamar_mandi ?? 1}
          className="w-full border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#a67f71]/40" />
      </div>

      <div>
        <label htmlFor="kapasitas_penghuni" className="block text-sm font-medium text-stone-700 mb-1">Kapasitas Penghuni</label>
        <input id="kapasitas_penghuni" name="kapasitas_penghuni" type="number" min={1} required defaultValue={unit?.kapasitas_penghuni ?? 1}
          className="w-full border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#a67f71]/40" />
      </div>

      <div>
        <label htmlFor="lantai" className="block text-sm font-medium text-stone-700 mb-1">Lantai</label>
        <input id="lantai" name="lantai" type="number" min={1} required defaultValue={unit?.lantai ?? 1}
          className="w-full border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#a67f71]/40" />
      </div>

      <div>
        <label htmlFor="keterangan" className="block text-sm font-medium text-stone-700 mb-1">Keterangan Unit</label>
        <textarea id="keterangan" name="keterangan" rows={2} defaultValue={unit?.keterangan ?? ""}
          className="w-full border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#a67f71]/40 resize-none" placeholder="Fasilitas dalam unit, dll." />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Foto Properti</label>
        {existingFoto && (
          <div className="relative w-full h-32 mb-3 bg-stone-100">
            <Image src={existingFoto} alt="Foto saat ini" fill className="object-cover" sizes="400px" />
          </div>
        )}
        <div className="flex items-center gap-3">
          <input ref={fileRef} id="foto" name="foto" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          <button type="button" onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 border border-stone-300 px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 transition">
            <Upload size={16} />
            {existingFoto ? "Ganti Foto" : "Pilih File"}
          </button>
          <span className="text-sm text-stone-400 truncate max-w-[180px]">{fileName}</span>
        </div>
        {fileError && <p className="text-xs text-red-500 mt-1.5">{fileError}</p>}
      </div>

      <div className="pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
