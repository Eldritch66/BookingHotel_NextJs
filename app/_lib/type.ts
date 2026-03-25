export type Property = {
  id: number;
  title: string;
  type: string;
  price_per_night: number;
  city: string;
  province: string;
  address: string;
  rating: number;
  review_count: number;
  host_id: string;
  created_at: string;
  property_images: {
    id: number;
    image_url: string;
  }[];
};
