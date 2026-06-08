import { supabaseAdmin } from "./supabase";
import type { Property, PropertiRaw, Sewa } from "./type";

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
  const { error } = await supabaseAdmin
    .from("properti")
    .delete()
    .eq("id", propertiId);

  if (error) {
    console.error(error);
    throw new Error("Properti could not be deleted");
  }
}

export async function createFotoProperti(data: {
  url: string;
  properti_id: string;
}) {
  const { error } = await supabaseAdmin
    .from("foto_properti")
    .insert([data]);

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
      tanggal_mulai,
      tanggal_selesai,
      durasi_bulan,
      total_harga,
      catatan,
      disetujui_pada,
      created_at,
      pembayaran (
        id,
        jumlah,
        metode,
        bukti_url,
        dibayar_pada
      )
    `,
    )
    .eq("penyewa_id", penyewaId)
    .order("tanggal_mulai", { ascending: false });

  if (error) {
    console.error(JSON.stringify(error, null, 2));
    throw new Error("Sewa could not be loaded");
  }

  const raw = data ?? [];

  const propertiIds = [
    ...new Set(
      raw
        .map((s) => s.catatan?.match(/properti_id:([^|]+)/)?.[1])
        .filter(Boolean) as string[],
    ),
  ];

  const imageMap: Record<string, string> = {};
  if (propertiIds.length > 0) {
    const { data: props } = await supabaseAdmin
      .from("properti")
      .select("id, foto_properti ( url )")
      .in("id", propertiIds);

    if (props) {
      for (const p of props) {
        const fp = (p as Record<string, unknown>)
          .foto_properti as { url: string }[] | undefined;
        imageMap[p.id] = fp?.[0]?.url ?? "";
      }
    }
  }

  return raw.map((s) => ({
    id: s.id,
    penyewa_id: s.penyewa_id,
    tanggal_mulai: s.tanggal_mulai,
    tanggal_selesai: s.tanggal_selesai,
    durasi_bulan: s.durasi_bulan,
    total_harga: s.total_harga,
    catatan: s.catatan,
    status: s.catatan === "CANCELLED" ? "cancelled" : "confirmed",
    properti_id: s.catatan?.match(/properti_id:([^|]+)/)?.[1] ?? "",
    properti_title: s.catatan?.match(/properti_title:([^|]+)/)?.[1] ?? "",
    properti_image: imageMap[s.catatan?.match(/properti_id:([^|]+)/)?.[1] ?? ""] ?? "",
  }));
}

export async function getSewaById(sewaId: string) {
  const { data, error } = await supabaseAdmin
    .from("sewa")
    .select(
      `
      id,
      penyewa_id,
      tanggal_mulai,
      tanggal_selesai,
      durasi_bulan,
      total_harga,
      catatan,
      disetujui_pada,
      created_at,
      pembayaran (
        id,
        jumlah,
        metode,
        bukti_url,
        dibayar_pada
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
  tanggal_mulai: string;
  tanggal_selesai: string;
  durasi_bulan: number;
  total_harga: number;
  catatan?: string;
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
  const { error } = await supabaseAdmin
    .from("sewa")
    .delete()
    .eq("id", sewaId);

  if (error) {
    console.error(error);
    throw new Error("Sewa could not be deleted");
  }
}

export async function getSewaByIdWithProperti(sewaId: string, penyewaId: string): Promise<Sewa | null> {
  const all = await getSewa(penyewaId);
  return all.find((s) => s.id === sewaId) ?? null;
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
    property_images: (p.foto_properti ?? []).map((f) => ({
      id: f.id,
      image_url: f.url,
    })),
  };
}


