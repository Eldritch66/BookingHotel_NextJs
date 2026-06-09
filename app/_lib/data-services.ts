import { supabaseAdmin } from "./supabase";
import type { Property, PropertiDetailPemilik, PropertiPemilik, PropertiPemilikRaw, PropertiRaw, Sewa, SewaRiwayat } from "./type";

// ================================
// PENYEWA
// ================================

export async function getPenyewa(email: string) {
  const { data, error } = await supabaseAdmin
    .from("penyewa")
    .select("*")
    .eq("email", email)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error(error);
    throw new Error("Penyewa could not be loaded");
  }

  return data;
}

export async function getPemilik(email: string) {
  const { data, error } = await supabaseAdmin
    .from("pemilik")
    .select("*")
    .eq("email", email)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error(error);
    throw new Error("Pemilik could not be loaded");
  }

  return data ?? null;
}

export async function createPenyewa(penyewaData: {
  user_id: string;
  nama_penyewa: string;
  email: string;
  no_hp?: string;
}) {
  const { data, error } = await supabaseAdmin
    .from("penyewa")
    .insert([penyewaData])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Penyewa could not be created");
  }

  return data;
}

export async function updatePenyewa(
  penyewaId: string,
  updates: Partial<{ nama_penyewa: string; no_hp: string }>,
) {
  const { data, error } = await supabaseAdmin
    .from("penyewa")
    .update(updates)
    .eq("id", penyewaId)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Penyewa could not be updated");
  }

  return data;
}

// ================================
// PROPERTI
// ================================

export async function getProperti() {
  const { data, error } = await supabaseAdmin
    .from("properti")
    .select(
      `
      id, nama_properti, tipe, kota, alamat, pemilik_id, harga_per_bulan, harga_per_dua_bulan,
      foto_properti ( id, url )
    `,
    )
    .order("nama_properti");

  if (error) {
    console.error(error);
    throw new Error("Properti could not be loaded");
  }

  return data;
}

export async function getPropertiById(propertiId: string) {
  const { data, error } = await supabaseAdmin
    .from("properti")
    .select(
      `
      id, nama_properti, tipe, kota, alamat, pemilik_id, harga_per_bulan, harga_per_dua_bulan,
      foto_properti ( id, url ),
      pemilik ( id, nama_pemilik, email ),
      unit (
        id,
        luas_bangunan,
        jumlah_kamar_tidur,
        jumlah_kamar_mandi,
        kapasitas_penghuni,
        lantai,
        keterangan,
        ketersediaan
      )
    `,
    )
    .eq("id", propertiId)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Properti could not be loaded");
  }

  return data;
}

export async function getFilteredProperti({
  location,
  type,
  price,
}: {
  location?: string;
  type?: string;
  price?: string;
}) {
  let query = supabaseAdmin
    .from("properti")
    .select(
      `
      id, nama_properti, tipe, kota, alamat, harga_per_bulan, harga_per_dua_bulan,
      foto_properti ( id, url )
    `,
    )
    .order("nama_properti");

  if (location && location !== "All") query = query.eq("kota", location);

  if (type && type !== "All") query = query.eq("tipe", type.toLowerCase());

  if (price && price !== "All") {
    if (price === "Budget") query = query.lte("harga_per_dua_bulan", 500000);
    else if (price === "Mid-range")
      query = query
        .gt("harga_per_dua_bulan", 500000)
        .lte("harga_per_dua_bulan", 1500000);
    else if (price === "Luxury")
      query = query.gt("harga_per_dua_bulan", 1500000);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error("Properti could not be loaded");
  }

  return data;
}

export async function getPropertiByPemilik(pemilikId: string) {
  const { data, error } = await supabaseAdmin
    .from("properti")
    .select(
      `
      id, nama_properti, tipe, kota, alamat, pemilik_id, harga_per_bulan, harga_per_dua_bulan,
      foto_properti ( id, url )
    `,
    )
    .eq("pemilik_id", pemilikId)
    .order("nama_properti");

  if (error) {
    console.error(error);
    throw new Error("Properti could not be loaded");
  }

  return data;
}

export async function createProperti(data: {
  nama_properti: string;
  tipe: string;
  kota: string;
  alamat: string;
  pemilik_id: string;
  harga_per_bulan: number;
  harga_per_dua_bulan: number;
}) {
  const { data: newProperti, error } = await supabaseAdmin
    .from("properti")
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Properti could not be created");
  }

  return newProperti;
}

export async function deleteProperti(propertiId: string) {
  const { error: errFoto } = await supabaseAdmin
    .from("foto_properti")
    .delete()
    .eq("properti_id", propertiId);

  if (errFoto) {
    console.error(errFoto);
    throw new Error("Foto terkait gagal dihapus");
  }

  const { error } = await supabaseAdmin
    .from("properti")
    .delete()
    .eq("id", propertiId);

  if (error) {
    console.error(error);
    throw new Error("Properti could not be deleted");
  }
}

export async function getPropertiPemilik(
  pemilikId: string,
): Promise<PropertiPemilik[]> {
  const { data, error } = await supabaseAdmin
    .from("properti")
    .select(
      `
      id, nama_properti, tipe, kota, alamat, harga_per_bulan, harga_per_dua_bulan,
      foto_properti ( url ),
      sewa (
        id, penyewa_id, tanggal_mulai, tanggal_selesai, durasi_bulan, total_harga, status_sewa,
        penyewa ( nama_penyewa, email )
      )
    `,
    )
    .eq("pemilik_id", pemilikId)
    .order("nama_properti");

  if (error) {
    console.error(error);
    throw new Error("Properti could not be loaded");
  }

  return ((data ?? []) as unknown as PropertiPemilikRaw[]).map(mapToPropertiPemilik);
}

function mapToPropertiPemilik(raw: PropertiPemilikRaw): PropertiPemilik {
  const aktifSewa = (raw.sewa ?? []).find(
    (s) => s.status_sewa === "aktif" || s.status_sewa === "pending",
  );

  const penyewa = aktifSewa?.penyewa
    ? (Array.isArray(aktifSewa.penyewa) ? aktifSewa.penyewa[0] : aktifSewa.penyewa)
    : null;

  return {
    id: raw.id,
    nama_properti: raw.nama_properti,
    tipe: raw.tipe,
    kota: raw.kota,
    harga_per_bulan: raw.harga_per_bulan,
    harga_per_dua_bulan: raw.harga_per_dua_bulan,
    foto_url: raw.foto_properti?.[0]?.url ?? "",
    status: aktifSewa ? "aktif" : "kosong",
    penyewa_nama: penyewa?.nama_penyewa,
    penyewa_email: penyewa?.email,
    tanggal_mulai: aktifSewa?.tanggal_mulai,
    tanggal_selesai: aktifSewa?.tanggal_selesai,
    durasi_bulan: aktifSewa?.durasi_bulan,
    total_harga: aktifSewa?.total_harga,
    sewa_id: aktifSewa?.id,
  };
}

export async function getPropertiDetailPemilik(
  propertiId: string,
): Promise<PropertiDetailPemilik> {
  const { data, error } = await supabaseAdmin
    .from("properti")
    .select(
      `
      id, nama_properti, tipe, kota, alamat, harga_per_bulan, harga_per_dua_bulan,
      foto_properti ( url ),
      sewa (
        id, penyewa_id, tanggal_mulai, tanggal_selesai, durasi_bulan, total_harga, status_sewa,
        penyewa ( nama_penyewa, email )
      )
    `,
    )
    .eq("id", propertiId)
    .single();

  if (error || !data) {
    console.error(error);
    throw new Error("Properti could not be loaded");
  }

  const raw = data as unknown as PropertiPemilikRaw;
  const pemilikView = mapToPropertiPemilik(raw);

  const riwayatSewa: SewaRiwayat[] = (raw.sewa ?? []).map((s) => {
    const p = s.penyewa
      ? (Array.isArray(s.penyewa) ? s.penyewa[0] : s.penyewa)
      : null;
    return {
      id: s.id,
      penyewa_nama: p?.nama_penyewa ?? "—",
      penyewa_email: p?.email ?? "—",
      tanggal_mulai: s.tanggal_mulai,
      tanggal_selesai: s.tanggal_selesai,
      durasi_bulan: s.durasi_bulan,
      total_harga: s.total_harga,
      status: s.status_sewa ?? "—",
    };
  });

  return {
    ...pemilikView,
    alamat: raw.alamat,
    foto_urls: raw.foto_properti?.map((f) => f.url) ?? [],
    riwayat_sewa: riwayatSewa,
  };
}

export async function createFotoProperti(data: {
  url: string;
  properti_id: string;
}) {
  const { error } = await supabaseAdmin.from("foto_properti").insert([data]);

  if (error) {
    console.error(error);
    throw new Error("Foto could not be created");
  }
}

// ================================
// SEWA
// ================================

export async function getSewa(penyewaId: string): Promise<Sewa[]> {
  const { data, error } = await supabaseAdmin
    .from("sewa")
    .select(
      `
      id,
      penyewa_id,
      properti_id,
      tanggal_mulai,
      tanggal_selesai,
      durasi_bulan,
      total_harga,
      status_sewa,
      disetujui_pada,
      created_at,
      properti (
        id,
        nama_properti,
        foto_properti ( url )
      ),
      pembayaran (
        id,
        jumlah,
        metode,
        bukti_url,
        status,
        dibayar_pada
      )
    `,
    )
    .eq("penyewa_id", penyewaId)
    .order("tanggal_mulai", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Sewa could not be loaded");
  }

  return (data ?? []).map((s) => ({
    id: s.id,
    penyewa_id: s.penyewa_id,
    properti_id: s.properti_id,
    tanggal_mulai: s.tanggal_mulai,
    tanggal_selesai: s.tanggal_selesai,
    durasi_bulan: s.durasi_bulan,
    total_harga: s.total_harga,
    status: s.status_sewa ?? "aktif",
    properti_title:
      (Array.isArray(s.properti) ? s.properti[0] : s.properti)?.nama_properti ??
      "",
    properti_image:
      (Array.isArray(s.properti) ? s.properti[0] : s.properti)
        ?.foto_properti?.[0]?.url ?? "",
  }));
}

export async function getSewaById(sewaId: string) {
  const { data, error } = await supabaseAdmin
    .from("sewa")
    .select(
      `
      id,
      penyewa_id,
      properti_id,
      tanggal_mulai,
      tanggal_selesai,
      durasi_bulan,
      total_harga,
      status_sewa,
      disetujui_pada,
      created_at,
      properti (
        id,
        nama_properti,
        alamat,
        foto_properti ( url )
      ),
      pembayaran (
        id,
        jumlah,
        metode,
        bukti_url,
        status,
        dibayar_pada,
        nomor_referensi
      )
    `,
    )
    .eq("id", sewaId)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Sewa could not be loaded");
  }
  return data;
}

export async function createSewa(sewaData: {
  penyewa_id: string;
  properti_id: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  durasi_bulan: number;
  total_harga: number;
  status_sewa?: string;
}) {
  const { data, error } = await supabaseAdmin
    .from("sewa")
    .insert([sewaData])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Sewa could not be created");
  }

  return data;
}

export async function deleteSewa(sewaId: string) {
  const { error: errPembayaran } = await supabaseAdmin
    .from("pembayaran")
    .delete()
    .eq("sewa_id", sewaId);

  if (errPembayaran) {
    console.error(errPembayaran);
    throw new Error("Pembayaran terkait gagal dihapus");
  }

  const { error } = await supabaseAdmin.from("sewa").delete().eq("id", sewaId);

  if (error) {
    console.error(error);
    throw new Error("Sewa could not be deleted");
  }
}

export async function getSewaByIdWithProperti(
  sewaId: string,
  penyewaId: string,
): Promise<Sewa | null> {
  const all = await getSewa(penyewaId);
  return all.find((s) => s.id === sewaId) ?? null;
}

// ================================
// Availability
// ================================

export async function getActiveSewaPropertiIds(): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from("sewa")
    .select("properti_id")
    .in("status_sewa", ["aktif", "pending"]);

  if (error) {
    console.error(error);
    throw new Error("Active sewa could not be loaded");
  }

  return (data ?? []).map((s) => s.properti_id);
}

export async function isPropertiTersedia(propertiId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("sewa")
    .select("id")
    .eq("properti_id", propertiId)
    .in("status_sewa", ["aktif", "pending"])
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("Sewa could not be checked");
  }

  return !data;
}

// ================================
// Mapper: DB → Frontend types
// ================================

export function mapPropertiToProperty(p: PropertiRaw): Property {
  return {
    id: p.id,
    title: p.nama_properti,
    type: p.tipe,
    price_per_month: p.harga_per_bulan,
    price_per_two_months: p.harga_per_dua_bulan,
    city: p.kota,
    province: "Jawa Barat",
    address: p.alamat,
    created_at: new Date().toISOString(),
    owner_name: (Array.isArray(p.pemilik) ? p.pemilik[0] : p.pemilik)?.nama_pemilik ?? "",
    property_images: (p.foto_properti ?? []).map((f) => ({
      id: f.id,
      image_url: f.url,
    })),
  };
}
