"use server";

import bcrypt from "bcryptjs";
import { auth, signOut } from "./auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "./supabase";
import {
  getPenyewa,
  createPenyewa,
  getPemilik,
  getUserByEmail,
  createUser,
  getSewa,
  getSewaById,
  getPropertiById,
  createSewa,
  deleteSewa,
  createProperti,
  deleteProperti,
  createFotoProperti,
  isPropertiTersedia,
} from "./data-services";

// ─── Auth ────────────────────────────────────────────────────────────

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

// ─── Role Registration ───────────────────────────────────────────────

export async function registerAsPenyewa() {
  const session = await auth();
  if (!session?.user?.email) return;

  const existing = await getPenyewa(session.user.email);
  if (!existing) {
    await createPenyewa({
      user_id: session.user.id ?? "",
      nama_penyewa: session.user.name ?? "",
      email: session.user.email,
      no_hp: "",
    });
  }
}

export async function registerAsPemilik() {
  const session = await auth();
  if (!session?.user?.email || !session.user.id) return;

  const { error } = await supabaseAdmin.from("pemilik").insert({
    user_id: session.user.id,
    nama_pemilik: session.user.name ?? "",
    email: session.user.email,
    no_hp: "",
  });

  if (error) {
    console.error(error);
    throw new Error("Pemilik could not be created");
  }
}

// ─── Credentials Registration ─────────────────────────────────────────

export async function registerUser(
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const nama = formData.get("nama") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!nama || !email || !password || !confirmPassword) {
    return { error: "Semua field harus diisi" };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Format email tidak valid" };
  }

  if (password.length < 6) {
    return { error: "Password minimal 6 karakter" };
  }

  if (password !== confirmPassword) {
    return { error: "Password dan konfirmasi password tidak cocok" };
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "Email sudah terdaftar" };
  }

  const existingPenyewa = await getPenyewa(email);
  const existingPemilik = await getPemilik(email);
  if (existingPenyewa || existingPemilik) {
    return { error: "Email sudah terdaftar menggunakan Google. Silakan login dengan Google." };
  }

  const id = crypto.randomUUID();
  const password_digest = await bcrypt.hash(password, 10);

  const created = await createUser({ id, email, name: nama, password_digest });
  if (!created) {
    return { error: "Registrasi gagal. Silakan coba lagi." };
  }

  return { success: true };
}

// ─── Pemesanan (Penyewa) ─────────────────────────────────────────────

export async function buatPemesanan(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const penyewa = await getPenyewa(session.user.email);
  if (!penyewa) redirect("/role?alert=harus-penyewa");

  const pemilik = await getPemilik(session.user.email);
  const properti = await getPropertiById(formData.get("properti_id") as string);
  if (pemilik && properti.pemilik_id === pemilik.id) {
    throw new Error("Anda tidak dapat menyewa properti milik sendiri");
  }

  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;
  const durasi_bulan = Number(formData.get("num_months"));
  const price_per_two_months = Number(formData.get("price_per_two_months"));
  const price_per_month = Number(formData.get("price_per_month"));
  const properti_id = formData.get("properti_id") as string;
  const tersedia = await isPropertiTersedia(properti_id);
  if (!tersedia) {
    throw new Error("Properti ini sudah disewa oleh penyewa lain");
  }

  const extraMonths = Math.max(0, durasi_bulan - 2);
  const total_harga = price_per_two_months + extraMonths * price_per_month;

  const sewa = await createSewa({
    penyewa_id: penyewa.id,
    properti_id,
    tanggal_mulai: start_date,
    tanggal_selesai: end_date,
    durasi_bulan,
    total_harga,
    status_sewa: "pending",
  });

  redirect(`/pembayaran/${sewa.id}`);
}

const metodeMap: Record<string, string> = {
  QRIS: "qris",
  "Transfer BCA": "virtual_account",
  PayPal: "lainnya",
};

export async function simulasiPembayaran(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const sewaId = formData.get("sewa_id") as string;
  const metode = formData.get("metode") as string;

  const sewa = await getSewaById(sewaId);

  const jumlah = sewa ? sewa.total_harga + 25000 + Math.ceil(sewa.total_harga * 0.1) : 0;

  const { error } = await supabaseAdmin.from("pembayaran").insert({
    sewa_id: sewaId,
    jumlah,
    metode: metodeMap[metode] ?? "lainnya",
    status: "berhasil",
    dibayar_pada: new Date().toISOString(),
  });

  if (error) {
    console.error("Insert pembayaran gagal:", error);
    throw new Error("Pembayaran gagal dicatat");
  }

  revalidatePath("/account/sewa");
  redirect(`/account/thankyou?metode=${encodeURIComponent(metode)}`);
}

// ─── Properti (Pemilik) ──────────────────────────────────────────

export async function tambahProperti(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const pemilik = await getPemilik(session.user.email);
  if (!pemilik) redirect("/role?alert=harus-penyewa");

  const nama_properti = formData.get("nama_properti") as string;
  const tipe = formData.get("tipe") as string;
  const alamat = formData.get("alamat") as string;
  const harga_per_bulan = Number(formData.get("harga_per_bulan"));
  const harga_per_dua_bulan = harga_per_bulan * 2;

  const properti = await createProperti({
    nama_properti,
    tipe,
    kota: "Bogor",
    alamat,
    pemilik_id: pemilik.id,
    harga_per_bulan,
    harga_per_dua_bulan,
  });

  const file = formData.get("foto") as File | null;
  if (file && file.size > 0) {
    if (file.size > 1 * 1024 * 1024) {
      throw new Error("Ukuran file maksimal 1MB");
    }
    const ext = file.name.split(".").pop() ?? "jpg";
    const filePath = `${properti.id}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("properties-sewa")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error(uploadError);
      throw new Error("Foto could not be uploaded");
    }

    const { data: publicUrl } = supabaseAdmin.storage
      .from("properties-sewa")
      .getPublicUrl(filePath);

    await createFotoProperti({
      url: publicUrl.publicUrl,
      properti_id: properti.id,
    });
  }

  revalidatePath("/account/pemilik/properti");
  redirect("/account/pemilik/properti");
}

export async function hapusProperti(propertiId: string) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const pemilik = await getPemilik(session.user.email);
  if (!pemilik) throw new Error("Pemilik record not found");

  await deleteProperti(propertiId);
  revalidatePath("/account/pemilik/properti");
}

export async function batalkanSewa(sewaId: string) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const penyewa = await getPenyewa(session.user.email);
  if (!penyewa) throw new Error("Penyewa record not found");

  const allSewa = await getSewa(penyewa.id);
  const sewaIds = allSewa.map((s) => s.id);

  if (!sewaIds.includes(sewaId))
    throw new Error("You are not allowed to cancel this sewa");

  try {
    await deleteSewa(sewaId);
    revalidatePath("/account/sewa");
  } catch (e) {
    console.error("Gagal batalkan sewa:", e);
    throw new Error("Gagal membatalkan sewa");
  }
}
