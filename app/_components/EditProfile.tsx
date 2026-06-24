"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiEdit2, FiChevronDown, FiSave, FiX, FiCheck } from "react-icons/fi";
import { updateProfileAction } from "../_lib/action";
import type { Guest } from "../_lib/type";

export default function EditProfile({ guest, defaultOpen = false }: { guest: Guest; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    try {
      await updateProfileAction(formData);
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <fieldset className="border-2 border-gray-200 rounded-xl transition-all duration-300">
      <legend
        className="ml-3 px-3 cursor-pointer flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700 select-none hover:text-gray-900 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiEdit2 className="text-gray-400" size={16} />
        <span>Edit Profile</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex text-gray-400"
        >
          <FiChevronDown size={16} />
        </motion.span>
      </legend>

      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="px-5 sm:px-6 pb-6 space-y-5">
          <div className="space-y-4 bg-gray-50 rounded-lg p-4 sm:p-5 shadow-inner">
            <div>
              <label
                htmlFor="full_name"
                className="block text-sm font-medium text-gray-600 mb-1.5"
              >
                Nama Lengkap
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                defaultValue={guest?.full_name || ""}
                required
                minLength={2}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-200 placeholder:text-gray-400"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={guest?.email || ""}
                disabled
                className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Email tidak dapat diubah
              </p>
            </div>

            <div>
              <label
                htmlFor="no_telp"
                className="block text-sm font-medium text-gray-600 mb-1.5"
              >
                No. Telepon
              </label>
              <input
                id="no_telp"
                name="no_telp"
                type="tel"
                defaultValue={guest?.no_telp || ""}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-200 placeholder:text-gray-400"
                placeholder="Contoh: 081234567890"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Masukkan dengan kode negara jika perlu (contoh: +62...)
              </p>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-500 flex items-center gap-1"
            >
              <FiX size={14} /> {error}
            </motion.p>
          )}

          {success && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-green-600 flex items-center gap-1"
            >
              <FiCheck size={14} /> Profil berhasil diperbarui!
            </motion.p>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-1000 px-4 py-2 text-sm font-medium text-white transition-all hover:brightness-110 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FiSave size={15} />
              )}
              {isPending ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setError(null);
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 active:scale-[0.97]"
            >
              <FiX size={15} />
              Batal
            </button>
          </div>
        </form>
      </motion.div>
    </fieldset>
  );
}
