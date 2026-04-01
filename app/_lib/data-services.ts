import { supabase } from "./supabase";

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
  await new Promise((res) => setTimeout(res, 2000));
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
};

export async function getRooms(propertyId: string) {
  const { data, error } = await supabase
    .from("rooms")
    // We actually also need data on the cabins as well. But let's ONLY take the data that we actually need, in order to reduce downloaded data.
    .select(
      "id, property_id, name, price_per_night, bed_type, quantity,created_at, size,properties(id,title,city,province)",
    )
    .eq("property_id", propertyId)
    .single();
  // .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}
