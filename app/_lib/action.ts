"use server";

import { auth, signOut } from "./auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "./supabase";
import {
  getPenyewa,
  createPenyewa,
  getPemilik,
  getSewa,
  createSewa,
  deleteSewa,
  createProperti,
  deleteProperti,
  createFotoProperti,
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
// ─── Pemesanan (Penyewa) ─────────────────────────────────────────────

export async function buatPemesanan(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const penyewa = await getPenyewa(session.user.email);
  if (!penyewa) redirect("/role?alert=harus-penyewa");

  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;
  const durasi_bulan = Number(formData.get("num_months"));
  const price_per_two_months = Number(formData.get("price_per_two_months"));
  const properti_id = formData.get("properti_id") as string;
  const properti_title = formData.get("properti_title") as string;
  const num_guests = 1;

  const service = 25000;
  const tax = price_per_two_months * 0.1;
  const blocks = Math.ceil(durasi_bulan / 2);
  const total_harga = blocks * price_per_two_months + service + tax;

  const sewa = await createSewa({
    penyewa_id: penyewa.id,
    tanggal_mulai: start_date,
    tanggal_selesai: end_date,
    durasi_bulan,
    total_harga,
    catatan: `properti_id:${properti_id}|properti_title:${properti_title}|${num_guests} guest(s)`,
  });

  redirect(`/pembayaran/${sewa.id}`);
}

export async function simulasiPembayaran(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const sewaId = formData.get("sewa_id") as string;
  const metode = formData.get("metode") as string;

  await supabaseAdmin.from("pembayaran").insert({
    sewa_id: sewaId,
    jumlah: 0,
    metode,
    status: "simulated",
    dibayar_pada: new Date().toISOString(),
  });

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
      .from("foto_properti")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error(uploadError);
      throw new Error("Foto could not be uploaded");
    }

    const { data: publicUrl } = supabaseAdmin.storage
      .from("foto_properti")
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

  await deleteSewa(sewaId);
  revalidatePath("/account/sewa");
}
