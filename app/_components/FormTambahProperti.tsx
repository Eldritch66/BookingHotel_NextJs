"use client";

import { useFormStatus } from "react-dom";
import { useRef, useState } from "react";
import { Upload } from "lucide-react";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 bg-[#a67f71] text-white px-5 py-2.5 rounded-2xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
    >
      {pending ? "Menyimpan..." : "Simpan Properti"}
    </button>
  );
}

export default function FormTambahProperti({
  tambahProperti,
}: {
  tambahProperti: (formData: FormData) => Promise<void>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("Tidak ada file dipilih");
  const [fileError, setFileError] = useState("");

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
        await tambahProperti(formData);
        formRef.current?.reset();
        if (fileRef.current) fileRef.current.value = "";
        setFileName("Tidak ada file dipilih");
      }}
      className="rounded-[28px] border border-stone-200 bg-white p-6 sm:p-8 space-y-5 max-w-lg"
    >
      {/* Nama Properti */}
      <div>
        <label
          htmlFor="nama_properti"
          className="block text-sm font-medium text-stone-700 mb-1"
        >
          Nama Properti
        </label>
        <input
          id="nama_properti"
          name="nama_properti"
          required
          className="w-full rounded-2xl border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#a67f71]/40"
          placeholder="Kost Mawar Indah"
        />
      </div>

      {/* Tipe */}
      <div>
        <label
          htmlFor="tipe"
          className="block text-sm font-medium text-stone-700 mb-1"
        >
          Tipe Properti
        </label>
        <select
          id="tipe"
          name="tipe"
          required
          className="w-full rounded-2xl border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#a67f71]/40"
        >
          <option value="">Pilih tipe...</option>
          <option value="kost">Kost</option>
          <option value="kontrakan">Kontrakan</option>
        </select>
      </div>

      {/* Alamat */}
      <div>
        <label
          htmlFor="alamat"
          className="block text-sm font-medium text-stone-700 mb-1"
        >
          Alamat
        </label>
        <textarea
          id="alamat"
          name="alamat"
          required
          rows={3}
          className="w-full rounded-2xl border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#a67f71]/40 resize-none"
          placeholder="Jl. Contoh No. 123, Bogor"
        />
      </div>

      {/* Harga per Bulan */}
      <div>
        <label
          htmlFor="harga_per_bulan"
          className="block text-sm font-medium text-stone-700 mb-1"
        >
          Harga per Bulan (Rp)
        </label>
        <input
          id="harga_per_bulan"
          name="harga_per_bulan"
          type="number"
          min={0}
          required
          className="w-full rounded-2xl border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#a67f71]/40"
          placeholder="500000"
        />
      </div>

      {/* Foto */}
      <div>
        <label
          htmlFor="foto"
          className="block text-sm font-medium text-stone-700 mb-1"
        >
          Foto Properti
        </label>
        <div className="flex items-center gap-3">
          <input
            ref={fileRef}
            id="foto"
            name="foto"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 rounded-2xl border border-stone-300 px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 transition"
          >
            <Upload size={16} />
            Pilih File
          </button>
          <span className="text-sm text-stone-400 truncate max-w-[180px]">
            {fileName}
          </span>
        </div>
        {fileError && (
          <p className="text-xs text-red-500 mt-1.5">{fileError}</p>
        )}
      </div>

      {/* Submit */}
      <div className="pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
