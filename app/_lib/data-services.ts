import { supabaseAdmin } from "./supabase";
import type { Property, PropertiDetailPemilik, PropertiPemilik, PropertiPemilikRaw, PropertiRaw, Sewa, SewaRiwayat } from "./type";

// ================================
// USERS (credentials auth)
// ================================

export async function getUserByEmail(email: string) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("getUserByEmail error:", error);
  }

  return data ?? null;
}

export async function getUserById(id: string) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("getUserById error:", error);
  }

  return data ?? null;
}

export async function createUser(userData: {
  email: string;
  name: string;
  password_digest?: string;
  provider_id?: string;
  avatar_url?: string;
  role?: string;
}) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .insert([userData])
    .select()
    .single();

  if (error) {
    console.error("createUser error:", error);
    return null;
  }

  return data;
}

export async function updateUserRole(userId: string, role: string) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .update({ role })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("updateUserRole error:", error);
    throw new Error("User role could not be updated");
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
      users!properti_pemilik_id_fkey ( id, name, email ),
      unit (
        id,
        luas_bangunan,
        jumlah_kamar_tidur,
        jumlah_kamar_mandi,
        kapasitas_penghuni,
        lantai,
        keterangan
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
        users!sewa_penyewa_id_fkey ( name, email )
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
    (s) => s.status_sewa === "aktif",
  );
  const pendingSewa = (raw.sewa ?? []).find(
    (s) => s.status_sewa === "pending",
  );

  const currentSewa = aktifSewa ?? pendingSewa;
  const penyewa = currentSewa?.users
    ? (Array.isArray(currentSewa.users) ? currentSewa.users[0] : currentSewa.users)
    : null;

  return {
    id: raw.id,
    nama_properti: raw.nama_properti,
    tipe: raw.tipe,
    kota: raw.kota,
    harga_per_bulan: raw.harga_per_bulan,
    harga_per_dua_bulan: raw.harga_per_dua_bulan,
    foto_url: raw.foto_properti?.[0]?.url ?? "",
    status: aktifSewa ? "aktif" : pendingSewa ? "pending" : "kosong",
    penyewa_nama: penyewa?.name,
    penyewa_email: penyewa?.email,
    tanggal_mulai: currentSewa?.tanggal_mulai,
    tanggal_selesai: currentSewa?.tanggal_selesai,
    durasi_bulan: currentSewa?.durasi_bulan,
    total_harga: currentSewa?.total_harga,
    sewa_id: currentSewa?.id,
  };
}

export async function getOwnerStats(pemilikId: string) {
  const properti = await getPropertiPemilik(pemilikId);

  const aktif = properti.filter((p) => p.status === "aktif");
  const pending = properti.filter((p) => p.status === "pending");

  return {
    total: properti.length,
    aktif: aktif.length,
    pending: pending.length,
    kosong: properti.filter((p) => p.status === "kosong").length,
    pendapatanAktif: aktif.reduce(
      (sum, p) => sum + (p.total_harga ?? 0),
      0,
    ),
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
        users!sewa_penyewa_id_fkey ( name, email )
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
    const p = s.users
      ? (Array.isArray(s.users) ? s.users[0] : s.users)
      : null;
    return {
      id: s.id,
      penyewa_nama: p?.name ?? "—",
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

export async function updateProperti(
  propertiId: string,
  data: {
    nama_properti: string;
    tipe: string;
    alamat: string;
    harga_per_bulan: number;
    harga_per_dua_bulan: number;
  },
) {
  const { error } = await supabaseAdmin
    .from("properti")
    .update(data)
    .eq("id", propertiId);

  if (error) {
    console.error(error);
    throw new Error("Properti could not be updated");
  }
}

export async function getUnitByPropertiId(propertiId: string) {
  const { data, error } = await supabaseAdmin
    .from("unit")
    .select(
      "id, luas_bangunan, jumlah_kamar_tidur, jumlah_kamar_mandi, kapasitas_penghuni, lantai, keterangan",
    )
    .eq("properti_id", propertiId)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("Unit could not be loaded");
  }

  return data;
}

export async function updateUnitByPropertiId(
  propertiId: string,
  data: {
    luas_bangunan: number | null;
    jumlah_kamar_tidur: number;
    jumlah_kamar_mandi: number;
    kapasitas_penghuni: number;
    lantai: number;
    keterangan: string | null;
  },
) {
  const { error } = await supabaseAdmin
    .from("unit")
    .update(data)
    .eq("properti_id", propertiId);

  if (error) {
    console.error(error);
    throw new Error("Unit could not be updated");
  }
}

export async function getFotoByPropertiId(propertiId: string) {
  const { data, error } = await supabaseAdmin
    .from("foto_properti")
    .select("id, url")
    .eq("properti_id", propertiId);

  if (error) {
    console.error(error);
    throw new Error("Foto could not be loaded");
  }

  return data ?? [];
}

export async function deleteFotoByPropertiId(propertiId: string) {
  const { error } = await supabaseAdmin
    .from("foto_properti")
    .delete()
    .eq("properti_id", propertiId);

  if (error) {
    console.error(error);
    throw new Error("Foto could not be deleted");
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
        status,
        dibayar_pada,
        periode_bulan
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
    status: s.status_sewa ?? "pending",
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
        status,
        dibayar_pada,
        periode_bulan
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

export async function updateSewaStatus(
  sewaId: string,
  data: {
    status_sewa: string;
    disetujui_pada?: string;
    tanggal_mulai?: string;
    tanggal_selesai?: string;
  },
) {
  const { error } = await supabaseAdmin
    .from("sewa")
    .update(data)
    .eq("id", sewaId);

  if (error) {
    console.error(error);
    throw new Error("Status sewa could not be updated");
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

export async function createUnit(data: {
  properti_id: string;
  luas_bangunan: number | null;
  jumlah_kamar_tidur: number;
  jumlah_kamar_mandi: number;
  kapasitas_penghuni: number;
  lantai: number;
  keterangan: string | null;
}) {
  const { error } = await supabaseAdmin.from("unit").insert([data]);

  if (error) {
    console.error(error);
    throw new Error("Unit could not be created");
  }
}

// ================================
// TIKET BANTUAN
// ================================

export async function createTiketBantuan(data: {
  user_id: string;
  judul: string;
  pesan: string;
  kategori: string;
}) {
  const { data: ticket, error } = await supabaseAdmin
    .from("tiket_bantuan")
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Tiket bantuan gagal dikirim");
  }

  return ticket;
}

// ================================
// Mapper: DB → Frontend types
// ================================

export function mapPropertiToProperty(p: PropertiRaw): Property {
  const rawhUnit = Array.isArray(p.unit) ? p.unit[0] : p.unit;
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
    owner_name: (Array.isArray(p.users) ? p.users[0] : p.users)?.name ?? "",
    property_images: (p.foto_properti ?? []).map((f) => ({
      id: f.id,
      image_url: f.url,
    })),
    unit: rawhUnit
      ? {
          id: rawhUnit.id,
          luas_bangunan: rawhUnit.luas_bangunan,
          jumlah_kamar_tidur: rawhUnit.jumlah_kamar_tidur,
          jumlah_kamar_mandi: rawhUnit.jumlah_kamar_mandi,
          kapasitas_penghuni: rawhUnit.kapasitas_penghuni,
          lantai: rawhUnit.lantai,
          keterangan: rawhUnit.keterangan,
        }
      : null,
  };
}
