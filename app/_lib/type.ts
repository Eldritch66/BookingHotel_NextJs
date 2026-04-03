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

export type PropertyPreview = Pick<
  Property,
  "id" | "title" | "city" | "province"
>;

// export type Room = {
//   id: number;
//   property_id: number;
//   name: string;
//   price_per_night: number;
//   bed_type: string;
//   quantity: number;
//   created_at: string;
//   size: number;
//   properties: {
//     id: number;
//     title: string;
//     city: string;
//     province: string;
//     property_images: {
//       id: number;
//       image_url: string;
//     }[];
//   }[];
// };
export type Room = {
  id: string;
  property_id: string;
  name: string;
  price_per_night: number;
  bed_type: string;
  quantity: number;
  created_at: string;
  size: number;
  properties: {
    id: string;
    title: string;
    city: string;
    province: string;
    rating: number;
    review_count: number;
    property_images: {
      id: string;
      image_url: string;
    }[];
  };
};
