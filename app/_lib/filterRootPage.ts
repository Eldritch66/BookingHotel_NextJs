import { supabase } from "./supabase";
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
      rating,
      review_count,
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

  if (location && location !== "All") {
    query = query.eq("city", location);
  }

  if (type && type !== "All") {
    query = query.eq("type", type);
  }

  if (price && price !== "All") {
    if (price === "Budget") {
      query = query.lte("price_per_night", 500000);
    } else if (price === "Mid-range") {
      query = query
        .gte("price_per_night", 500000)
        .lte("price_per_night", 1500000);
    } else if (price === "Luxury") {
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
