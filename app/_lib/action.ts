"use server";

import { signOut } from "./auth";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import { supabase } from "./supabase";
import { getBookings, getGuest } from "./data-services";
import { revalidatePath } from "next/cache";

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
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
  const num_guests = 1;
  const price_per_night = Number(formData.get("price_per_night"));

  const service = 25000;
  const tax = price_per_night * 0.1;
  const total_price = num_nights * price_per_night + service + tax;

  const { data: existing } = await supabase
    .from("bookings")
    .select("id")
    .eq("room_id", room_id)
    .in("status", ["confirmed", "pending"])
    .lte("start_date", end_date)
    .gte("end_date", start_date);

  if (existing && existing.length > 0) {
    throw new Error("Kamar sudah dibooking untuk tanggal tersebut");
  }

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      guest_id: guest.guest_id,
      room_id,
      start_date,
      end_date,
      num_nights,
      num_guests,
      total_price,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  await createPaymentRecord(booking.id, total_price);

  redirect(`/payment/${booking.id}`);
}

export async function createPaymentRecord(bookingId: string, amount: number) {
  const { error } = await supabase.from("payments").insert({
    booking_id: bookingId,
    amount,
    status: "menunggu",
  });

  if (error) {
    console.error(error);
    throw new Error("Payment record could not be created");
  }
}

export async function simulatePayment(
  bookingId: string,
  paymentMethod: string,
) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const transactionId = `SIM-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const { error } = await supabase
    .from("payments")
    .update({
      status: "berhasil",
      payment_method: paymentMethod,
      transaction_id: transactionId,
      paid_at: new Date().toISOString(),
    })
    .eq("booking_id", bookingId);

  if (error) {
    console.error(error);
    throw new Error("Payment could not be processed");
  }

  await supabase
    .from("bookings")
    .update({ status: "confirmed" })
    .eq("id", bookingId);

  revalidatePath(`/payment/${bookingId}`);

  redirect(`/account/thankyou?payment=success`);
}

export async function deleteBooking(bookingId: string) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
  if (!session?.user?.email) redirect("/login");

  const guest = await getGuest(session.user.email);
  if (!guest) throw new Error("Guest record not found");

  const guestBookings = await getBookings(guest.guest_id);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be deleted");

  revalidatePath("/account/reservations");
}
