import { supabase } from "./supabase";

export const properties = async function () {
  const { data, error } = await supabase
    .from("properties")
    .select(
      `id, title, type, price_per_night, city, province, address, rating, review_count,created_at,
        property_images (
          id,
          image_url
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
