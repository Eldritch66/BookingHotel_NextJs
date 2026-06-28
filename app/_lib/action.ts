"use server";

import bcrypt from "bcryptjs";
import { auth, signOut } from "./auth";
import { redirect } from "next/navigation";
import { supabase } from "./supabase";
import {
  getBookings,
  getGuest,
  getGuestByEmail,
  createGuestWithPassword,
  updateGuest,
} from "./data-services";
import { revalidatePath } from "next/cache";

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function registerUser(formData: FormData) {
  const full_name = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!full_name || full_name.length < 2) {
    throw new Error("Nama lengkap minimal 2 karakter");
  }

  if (!email || !email.includes("@")) {
    throw new Error("Email tidak valid");
  }

  if (!password || password.length < 8) {
    throw new Error("Password minimal 8 karakter");
  }

  if (password !== confirmPassword) {
    throw new Error("Konfirmasi password tidak cocok");
  }

  const existingGuest = await getGuestByEmail(email);
  if (existingGuest) {
    throw new Error("Email sudah terdaftar");
  }

  const password_hash = await bcrypt.hash(password, 12);

  await createGuestWithPassword({ email, full_name, password_hash });

  redirect("/login?registered=true");
}

export async function createBooking(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const guest = await getGuest(session.user.email);
  if (!guest) redirect("/login");

  const room_id = formData.get("room_id") as string;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;
  const num_nights = Number(formData.get("num_nights"));
  const price_per_night = Number(formData.get("price_per_night"));

  if (!room_id || !start_date || !end_date || !num_nights) {
    throw new Error("Data booking tidak lengkap");
  }

  const { data: existing } = await supabase
    .from("bookings")
    .select("id")
    .eq("room_id", room_id)
    .neq("status", "cancelled")
    .lte("start_date", end_date)
    .gte("end_date", start_date);

  if (existing && existing.length > 0) {
    throw new Error("Kamar sudah dibooking untuk tanggal tersebut");
  }

  const service = 25000;
  const tax = price_per_night * 0.1;
  const total_price = num_nights * price_per_night + service + tax;

  const params = new URLSearchParams({
    room_id,
    start_date,
    end_date,
    num_nights: String(num_nights),
    total_price: String(total_price),
  });

  redirect(`/payment?${params.toString()}`);
}

export async function simulatePayment(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const guest = await getGuest(session.user.email);
  if (!guest) redirect("/login");

  const room_id = formData.get("room_id") as string;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;
  const num_nights = Number(formData.get("num_nights"));
  const total_price = Number(formData.get("total_price"));
  const payment_method = formData.get("payment_method") as string;

  if (!room_id || !start_date || !end_date || !payment_method) {
    throw new Error("Data pembayaran tidak lengkap");
  }

  const { data: existing } = await supabase
    .from("bookings")
    .select("id")
    .eq("room_id", room_id)
    .neq("status", "cancelled")
    .lte("start_date", end_date)
    .gte("end_date", start_date);

  if (existing && existing.length > 0) {
    throw new Error("Kamar sudah dibooking untuk tanggal tersebut");
  }

  const transactionId = `SIM-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      guest_id: guest.guest_id,
      room_id,
      start_date,
      end_date,
      num_nights,
      num_guests: 1,
      total_price,
      status: "confirmed",
    })
    .select("id")
    .single();

  if (bookingError) {
    console.error(bookingError);
    throw new Error("Booking could not be created");
  }

  const { error: paymentError } = await supabase.from("payments").insert({
    booking_id: booking.id,
    amount: total_price,
    status: "berhasil",
    payment_method,
    transaction_id: transactionId,
    paid_at: new Date().toISOString(),
  });

  if (paymentError) {
    console.error(paymentError);
    throw new Error("Payment record could not be created");
  }

  redirect(`/account/thankyou?booking_id=${booking.id}`);
}

export async function updateProfileAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Anda harus login");

  const full_name = formData.get("full_name") as string;
  const no_telp = formData.get("no_telp") as string;

  if (!full_name || full_name.trim().length < 2) {
    throw new Error("Nama lengkap minimal 2 karakter");
  }

  if (no_telp && !/^\+?\d{6,15}$/.test(no_telp.trim())) {
    throw new Error("Nomor telepon tidak valid (min 6 digit, maks 15 digit)");
  }

  await updateGuest(session.user.email, { full_name, no_telp });

  revalidatePath("/account");
}

export async function deleteBooking(bookingId: string) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
  if (!session?.user?.email) redirect("/login");

  const guest = await getGuest(session.user.email);
  if (!guest) throw new Error("Guest record not found");

  const guestBookings = await getBookings(guest.guest_id);
  const guestBookingIds = guestBookings.map((b) => b.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");

  const booking = guestBookings.find((b) => b.id === bookingId);
  if (!booking) throw new Error("Booking not found");

  const now = new Date();
  const start = new Date(booking.start_date);
  const end = new Date(booking.end_date);
  const dbStatus = booking.status;
  const isCancelled = dbStatus === "dibatalkan" || dbStatus === "cancelled";
  const isPast = now > end;
  const isPending = !isCancelled && !isPast && now < start;

  if (!isPast && !isCancelled) {
    throw new Error("Booking cannot be deleted");
  }

  const { error } = await supabase.from("bookings").delete().eq("id", bookingId);

  if (error) throw new Error("Booking could not be deleted");

  revalidatePath("/account/reservation");
}

export async function cancelBooking(bookingId: string) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
  if (!session?.user?.email) redirect("/login");

  const guest = await getGuest(session.user.email);
  if (!guest) throw new Error("Guest record not found");

  const guestBookings = await getBookings(guest.guest_id);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to cancel this booking");

  const { error } = await supabase
    .from("bookings")
    .update({ status: "dibatalkan" })
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be cancelled");

  revalidatePath("/account/reservation");
}
