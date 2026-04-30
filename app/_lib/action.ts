"use server";

import { signOut } from "./auth"; // ✅ use your auth file's signOut
import { auth } from "./auth"; // ✅ v5 way to get session
import { redirect } from "next/navigation";
import { supabase } from "./supabase";
import { getGuest } from "./data-services";

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function createBooking(formData: FormData) {
  // 1. Get session using v5's auth()
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  // 2. Get guest record using their email
  const guest = await getGuest(session.user.email);
  if (!guest) redirect("/login");

  // 3. Parse form data
  const room_id = formData.get("room_id") as string;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;
  const num_nights = Number(formData.get("num_nights"));
  const num_guests = Number(formData.get("num_guests"));
  const price_per_night = Number(formData.get("price_per_night"));

  // 4. Calculate total
  const service = 25000;
  const tax = price_per_night * 0.1;
  const total_price = num_nights * price_per_night + service + tax;

  // 5. Insert into bookings
  const { error } = await supabase.from("bookings").insert({
    guest_id: guest.guest_id,
    room_id,
    start_date,
    end_date,
    num_nights,
    num_guests,
    total_price,
    status: "pending",
  });

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  // 6. Redirect
  redirect("/account/thankyou");
}
