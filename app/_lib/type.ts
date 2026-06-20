// ================================
// Frontend types (used by components)
// ================================

export type Unit = {
  id: string;
  luas_bangunan: number | null;
  jumlah_kamar_tidur: number;
  jumlah_kamar_mandi: number;
  kapasitas_penghuni: number;
  lantai: number;
  keterangan: string | null;
};

export type Property = {
  id: string;
  title: string;
  type: string;
  price_per_month: number;
  price_per_two_months: number;
  city: string;
  province: string;
  address: string;
  created_at: string;
  owner_name: string;
  property_images: {
    id: string;
    image_url: string;
  }[];
  isOccupied?: boolean;
  unit: Unit | null;
};

export type Sewa = {
  id: string;
  penyewa_id: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  durasi_bulan: number;
  total_harga: number;
  status: string;
  properti_id: string;
  properti_title: string;
  properti_image: string;
};

// ================================
// DB-native types (matching Supabase schema)
// ================================

export type FotoProperti = {
  id: string;
  url: string;
};

export type PropertiRaw = {
  id: string;
  nama_properti: string;
  tipe: string;
  kota: string;
  alamat: string;
  pemilik_id?: string;
  harga_per_bulan: number;
  harga_per_dua_bulan: number;
  foto_properti: FotoProperti[];
  users?: { id?: string; name: string; email?: string }[];
  unit?: {
    id: string;
    luas_bangunan: number | null;
    jumlah_kamar_tidur: number;
    jumlah_kamar_mandi: number;
    kapasitas_penghuni: number;
    lantai: number;
    keterangan: string | null;
  }[] | null;
};

export type PropertiBrief = {
  id: string;
  nama_properti: string;
  kota: string;
  alamat?: string;
  harga_per_bulan?: number;
  harga_per_dua_bulan?: number;
  foto_properti: FotoProperti[];
};

export type PembayaranRaw = {
  id: string;
  sewa_id: string;
  jumlah: number;
  metode: string | null;
  bukti_url: string | null;
  status: string;
  nomor_referensi: string | null;
  periode_bulan: number | null;
  dikonfirmasi_oleh: string | null;
  dikonfirmasi_pada: string | null;
  dibayar_pada: string | null;
  created_at: string;
};

export type PropertiPemilik = {
  id: string;
  nama_properti: string;
  tipe: string;
  kota: string;
  harga_per_bulan: number;
  harga_per_dua_bulan: number;
  foto_url: string;
  status: "aktif" | "pending" | "kosong";
  penyewa_nama?: string;
  penyewa_email?: string;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  durasi_bulan?: number;
  total_harga?: number;
  sewa_id?: string;
};

export type PropertiPemilikRaw = {
  id: string;
  nama_properti: string;
  tipe: string;
  kota: string;
  alamat: string;
  harga_per_bulan: number;
  harga_per_dua_bulan: number;
  foto_properti: { url: string }[];
  sewa: {
    id: string;
    penyewa_id: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    durasi_bulan: number;
    total_harga: number;
    status_sewa: string;
    users: { name: string; email: string }[];
  }[];
};

export type SewaRiwayat = {
  id: string;
  penyewa_nama: string;
  penyewa_email: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  durasi_bulan: number;
  total_harga: number;
  status: string;
};

export type PropertiDetailPemilik = PropertiPemilik & {
  alamat: string;
  foto_urls: string[];
  riwayat_sewa: SewaRiwayat[];
};

export type PropertiFormData = {
  nama_properti: string;
  tipe: string;
  kota: string;
  alamat: string;
  harga_per_bulan: number;
  harga_per_dua_bulan: number;
};

export type TiketBantuan = {
  id: string;
  user_id: string;
  judul: string;
  pesan: string;
  kategori: "teknis" | "properti" | "pembayaran" | "akun" | "lainnya";
  status: "open" | "diproses" | "selesai" | "ditutup";
  balasan_admin: string | null;
  dijawab_oleh: string | null;
  dijawab_pada: string | null;
  created_at: string;
};

export type SewaWithRelationsRaw = {
  id: string;
  penyewa_id: string;
  properti_id: string | null;
  tanggal_mulai: string;
  tanggal_selesai: string;
  durasi_bulan: number;
  total_harga: number;
  status_sewa: string | null;
  disetujui_pada: string | null;
  created_at: string;
  properti?: {
    id: string;
    nama_properti: string;
    alamat: string;
    foto_properti: { url: string }[];
  }[];
  pembayaran: PembayaranRaw[];
};
