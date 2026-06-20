"use server";

import bcrypt from "bcryptjs";
import { auth, signOut } from "./auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "./supabase";
import {
  getUserByEmail,
  createUser,
  updateUserRole,
  getSewa,
  getSewaById,
  getPropertiById,
  createSewa,
  deleteSewa,
  createProperti,
  deleteProperti,
  createFotoProperti,
  createUnit,
  isPropertiTersedia,
  updateProperti,
  getUnitByPropertiId,
  updateUnitByPropertiId,
  getFotoByPropertiId,
  deleteFotoByPropertiId,
  updateSewaStatus,
  createTiketBantuan,
} from "./data-services";

// ─── Auth ────────────────────────────────────────────────────────────

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

// ─── Role Registration ───────────────────────────────────────────────

export async function registerAsPenyewa() {
  const session = await auth();
  if (!session?.user?.email) return;

  const existing = await getUserByEmail(session.user.email);
  if (!existing) {
    await createUser({
      email: session.user.email,
      name: session.user.name ?? "",
      role: "penyewa",
    });
  } else if (existing.role !== "penyewa") {
    await updateUserRole(existing.id, "penyewa");
  }
}

export async function registerAsPemilik() {
  const session = await auth();
  if (!session?.user?.email) return;

  const existing = await getUserByEmail(session.user.email);
  if (!existing) {
    await createUser({
      email: session.user.email,
      name: session.user.name ?? "",
      role: "pemilik",
    });
  } else if (existing.role !== "pemilik") {
    await updateUserRole(existing.id, "pemilik");
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
    if (existingUser.provider_id) {
      return { error: "Email sudah terdaftar menggunakan Google. Silakan login dengan Google." };
    }
    return { error: "Email sudah terdaftar" };
  }

  const password_digest = await bcrypt.hash(password, 10);

  const created = await createUser({ email, name: nama, password_digest });
  if (!created) {
    return { error: "Registrasi gagal. Silakan coba lagi." };
  }

  return { success: true };
}

// ─── Pemesanan (Penyewa) ─────────────────────────────────────────────

export async function buatPemesanan(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await getUserByEmail(session.user.email!);
  if (!user || user.role !== "penyewa") redirect("/role?alert=harus-penyewa");

  const properti = await getPropertiById(formData.get("properti_id") as string);
  if (properti.pemilik_id === user.id) {
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
    penyewa_id: user.id,
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
  if (!session?.user?.id) redirect("/login");

  const user = await getUserByEmail(session.user.email!);
  if (!user || user.role !== "pemilik") redirect("/role?alert=harus-penyewa");

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
    pemilik_id: user.id,
    harga_per_bulan,
    harga_per_dua_bulan,
  });

  await createUnit({
    properti_id: properti.id,
    luas_bangunan: Number(formData.get("luas_bangunan") || null) || null,
    jumlah_kamar_tidur: Number(formData.get("jumlah_kamar_tidur")),
    jumlah_kamar_mandi: Number(formData.get("jumlah_kamar_mandi")),
    kapasitas_penghuni: Number(formData.get("kapasitas_penghuni")),
    lantai: Number(formData.get("lantai")),
    keterangan: (formData.get("keterangan") as string) || null,
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

  const user = await getUserByEmail(session.user.email);
  if (!user || user.role !== "pemilik") throw new Error("Pemilik record not found");

  const tersedia = await isPropertiTersedia(propertiId);
  if (!tersedia) {
    throw new Error("Tidak dapat menghapus properti yang sedang disewa");
  }

  await deleteProperti(propertiId);
  revalidatePath("/account/pemilik/properti");
}

export async function editProperti(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await getUserByEmail(session.user.email!);
  if (!user || user.role !== "pemilik") redirect("/role?alert=harus-pemilik");

  const propertiId = formData.get("properti_id") as string;
  const nama_properti = formData.get("nama_properti") as string;
  const tipe = formData.get("tipe") as string;
  const alamat = formData.get("alamat") as string;
  const harga_per_bulan = Number(formData.get("harga_per_bulan"));
  const harga_per_dua_bulan = harga_per_bulan * 2;

  await updateProperti(propertiId, {
    nama_properti,
    tipe,
    alamat,
    harga_per_bulan,
    harga_per_dua_bulan,
  });

  const existingUnit = await getUnitByPropertiId(propertiId);
  if (existingUnit) {
    await updateUnitByPropertiId(propertiId, {
      luas_bangunan: Number(formData.get("luas_bangunan") || null) || null,
      jumlah_kamar_tidur: Number(formData.get("jumlah_kamar_tidur")),
      jumlah_kamar_mandi: Number(formData.get("jumlah_kamar_mandi")),
      kapasitas_penghuni: Number(formData.get("kapasitas_penghuni")),
      lantai: Number(formData.get("lantai")),
      keterangan: (formData.get("keterangan") as string) || null,
    });
  }

  const file = formData.get("foto") as File | null;
  if (file && file.size > 0) {
    if (file.size > 1 * 1024 * 1024) {
      throw new Error("Ukuran file maksimal 1MB");
    }

    const oldFotos = await getFotoByPropertiId(propertiId);
    for (const foto of oldFotos) {
      const pathParts = foto.url.split("/properties-sewa/");
      if (pathParts.length > 1) {
        await supabaseAdmin.storage
          .from("properties-sewa")
          .remove([pathParts[1]]);
      }
    }
    await deleteFotoByPropertiId(propertiId);

    const ext = file.name.split(".").pop() ?? "jpg";
    const filePath = `${propertiId}/${crypto.randomUUID()}.${ext}`;

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
      properti_id: propertiId,
    });
  }

  revalidatePath("/account/pemilik/properti");
  redirect("/account/pemilik/properti");
}

export async function updateStatusSewa(sewaId: string, newStatus: string) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await getUserByEmail(session.user.email);
  if (!user || user.role !== "pemilik") throw new Error("Pemilik record not found");

  if (newStatus === "aktif") {
    const now = new Date();
    const disetujui_pada = now.toISOString();
    const tanggal_mulai = disetujui_pada.split("T")[0];

    const { data: sewa, error: sewaError } = await supabaseAdmin
      .from("sewa")
      .select("durasi_bulan")
      .eq("id", sewaId)
      .single();

    if (sewaError || !sewa) throw new Error("Sewa not found");

    const tanggalSelesai = new Date(now);
    tanggalSelesai.setMonth(tanggalSelesai.getMonth() + sewa.durasi_bulan);
    const tanggal_selesai = tanggalSelesai.toISOString().split("T")[0];

    await updateSewaStatus(sewaId, {
      status_sewa: "aktif",
      disetujui_pada,
      tanggal_mulai,
      tanggal_selesai,
    });
  } else {
    await updateSewaStatus(sewaId, { status_sewa: newStatus });
  }

  revalidatePath("/account/pemilik/properti");
}

export async function batalkanSewa(sewaId: string) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await getUserByEmail(session.user.email);
  if (!user || user.role !== "penyewa") throw new Error("Penyewa record not found");

  const allSewa = await getSewa(user.id);
  const sewaIds = allSewa.map((s) => s.id);

  if (!sewaIds.includes(sewaId))
    throw new Error("You are not allowed to cancel this sewa");

  const { data: currentSewa, error: fetchError } = await supabaseAdmin
    .from("sewa")
    .select("status_sewa")
    .eq("id", sewaId)
    .single();

  if (fetchError || !currentSewa) throw new Error("Sewa not found");

  const newStatus = currentSewa.status_sewa === "aktif" ? "pending" : "dibatalkan";

  try {
    await updateSewaStatus(sewaId, { status_sewa: newStatus });
    revalidatePath("/account/sewa");
  } catch (e) {
    console.error("Gagal batalkan sewa:", e);
    throw new Error("Gagal membatalkan sewa");
  }
}

// ─── Tiket Bantuan ─────────────────────────────────────────────────

export async function kirimTiketBantuan(
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Silakan login terlebih dahulu" };

  const judul = formData.get("judul") as string;
  const pesan = formData.get("pesan") as string;
  const kategori = formData.get("kategori") as string;

  if (!judul || judul.trim().length < 3)
    return { error: "Judul minimal 3 karakter" };
  if (!pesan || pesan.trim().length < 10)
    return { error: "Pesan minimal 10 karakter" };
  if (!kategori) return { error: "Pilih kategori" };

  try {
    await createTiketBantuan({
      user_id: session.user.id,
      judul: judul.trim(),
      pesan: pesan.trim(),
      kategori,
    });
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("Gagal kirim tiket:", e);
    return { error: "Gagal mengirim tiket. Silakan coba lagi." };
  }
}

export async function hapusSewaPenyewa(sewaId: string) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await getUserByEmail(session.user.email);
  if (!user || user.role !== "penyewa") throw new Error("Penyewa record not found");

  const allSewa = await getSewa(user.id);
  const sewaIds = allSewa.map((s) => s.id);

  if (!sewaIds.includes(sewaId))
    throw new Error("You are not allowed to delete this sewa");

  try {
    await deleteSewa(sewaId);
    revalidatePath("/account/sewa");
  } catch (e) {
    console.error("Gagal hapus sewa:", e);
    throw new Error("Gagal menghapus sewa");
  }
}
