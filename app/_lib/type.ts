export type Property = {
  id: number;
  title: string;
  type: string;
  price_per_night: number;
  city: string;
  province: string;
  address: string;
  isAvailable: string;
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
  description_full: string;
  properties: {
    id: string;
    title: string;
    city: string;
    province: string;
    isAvailable: string;
    property_images: {
      id: string;
      image_url: string;
    }[];
  };
};

// app/_lib/types.ts

export type Roomm = {
  id: string;
  name: string;
  properties: Property;
};

export type Booking = {
  id: string;
  guest_id: string;
  room_id: string;
  start_date: string;
  end_date: string;
  num_nights: number;
  num_guests: number;
  total_price: number;
  status: string;
  rooms: Room;
};
