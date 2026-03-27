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
  created_at: string;
  description: string;
  property_images: {
    id: number;
    image_url: string;
  }[];
  rooms: {
    id: number;
    name: string;
  }[];
};
