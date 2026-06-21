import { supabase } from "./supabase";
import { Room, BookingWithPayment } from "./type";

export async function getGuest(email: string) {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("email", email)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows found, not a real error
    console.error(error);
    throw new Error("Guest could not be loaded");
  }

  return data;
}

export async function createGuest(guestData: { email: string }) {
  const { data, error } = await supabase.from("guests").insert([guestData]);
  // .select()
  // .single();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }

  return data;
}

export async function properties() {
  const { data, error } = await supabase
    .from("properties")
    .select(
      `id, title, type, price_per_night, city, province, address, created_at, description,
        property_images (
          id,
          image_url
        ),
        rooms (
        id,
        name
        )
      `,
    )

    .order("title");
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}
export async function getBookings(guestId: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
    id,
    guest_id,
    room_id,
    start_date,
    end_date,
    num_nights,
    num_guests,
    total_price,
    status,
    rooms (
      id,
      name,
      properties (
        id,
        title,
        city,
        province,
        property_images (
          id,
          image_url
        )
      )
    )
  `, // ✅ removed created_at
    )
    .eq("guest_id", guestId)
    .order("start_date", { ascending: false });
  if (error) {
    console.error("Supabase error details:", JSON.stringify(error)); // ✅ shows full error
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

export async function getFilteredProperties({
  location,
  type,
  price,
}: {
  location?: string;
  type?: string;
  price?: string;
}) {
  let query = supabase
    .from("properties")
    .select(
      `
      id,
      title,
      type,
      price_per_night,
      city,
      province,
      address,
      created_at,
      description,
      property_images (
        id,
        image_url
      ),
      rooms (
        id,
        name
      )
    `,
    )
    .order("title");
  if (location && location !== "Semua") {
    query = query.eq("city", location);
  }

  if (type && type !== "Semua") {
    query = query.eq("type", type.toLowerCase());
  }

  if (price && price !== "Semua") {
    if (price === "Ekonomis") {
      query = query.lte("price_per_night", 500000);
    } else if (price === "Menengah") {
      query = query
        .gte("price_per_night", 500000)
        .lte("price_per_night", 1500000);
    } else if (price === "Mewah") {
      query = query.gte("price_per_night", 1500000);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error("Properties could not be loaded");
  }

  return data;
}

export async function getRooms(propertyId: string) {
  const { data, error } = await supabase
    .from("rooms")

    .select(
      `id, property_id, name, price_per_night, bed_type, quantity,created_at, description_full, size,properties(id,title,city, province, property_images(
          id,
          image_url
        ) )`,
    )
    .eq("property_id", propertyId)
    // .single();
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data as unknown as Room[];
}

export async function getBookingWithDetails(bookingId: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      id,
      guest_id,
      room_id,
      start_date,
      end_date,
      num_nights,
      num_guests,
      total_price,
      status,
      rooms (
        id,
        name,
        price_per_night,
        properties (
          id,
          title,
          city,
          province,
          property_images (
            id,
            image_url
          )
        )
      ),
      payments (
        id,
        amount,
        status,
        payment_method,
        transaction_id,
        paid_at,
        created_at
      )
    `,
    )
    .eq("id", bookingId)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be loaded");
  }

  return data as unknown as BookingWithPayment;
}

export async function getBookedRangesForRooms(roomIds: string[]) {
  if (roomIds.length === 0) return [];

  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("bookings")
    .select("room_id, start_date, end_date")
    .in("room_id", roomIds)
    .in("status", ["confirmed", "pending"])
    .lte("start_date", today)
    .gte("end_date", today);

  if (error) {
    console.error(error);
    throw new Error("Booking data could not be loaded");
  }

  return data as { room_id: string; start_date: string; end_date: string }[];
}

export async function getBookedDatesForRoom(roomId: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("start_date, end_date")
    .eq("room_id", roomId)
    .in("status", ["confirmed", "pending"])
    .gte("end_date", new Date().toISOString().split("T")[0]);

  if (error) {
    console.error(error);
    throw new Error("Booking dates could not be loaded");
  }

  return data as { start_date: string; end_date: string }[];
}

export async function getPaymentByBookingId(bookingId: string) {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("booking_id", bookingId)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("Payment could not be loaded");
  }

  return data;
}
