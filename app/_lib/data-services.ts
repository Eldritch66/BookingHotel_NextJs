import { supabase } from "./supabase";
import { Room } from "./type";

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

export const properties = async function () {
  const { data, error } = await supabase
    .from("properties")
    .select(
      `id, title, type, price_per_night, city, province, address, rating, review_count,created_at,description,
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
};

export async function getPropertyLocationTypePrice(
  location: string,
  type: string,
  price: number,
) {
  const { data, error } = await supabase
    .from("properties")
    .select(
      `
      city, province, type, rooms (
       name
       )
    `,
    )
    .eq("city", location)
    .eq("type", type);

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function getRooms(propertyId: string) {
  const { data, error } = await supabase
    .from("rooms")

    .select(
      `id, property_id, name, price_per_night, bed_type, quantity,created_at, description_full, size,properties(id,title,city, rating, review_count , province, property_images(
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
