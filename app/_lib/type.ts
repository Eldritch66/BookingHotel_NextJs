export type Property = {
  id: number;
  title: string;
  type: string;
  price_per_night: number;
  city: string;
  province: string;
  address: string;
  created_at: string;
  description: string;
  property_images: {
    id: number;
    image_url: string;
  }[];
  rooms: {
    id: number;
    name: string;
    price_per_night?: number;
  }[];
  isBooked?: boolean;
  bookedUntil?: string;
  facilities?: string[];
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
    address: string;
    property_images: {
      id: string;
      image_url: string;
    }[];
    facilities?: string[];
  };
  bookedRanges?: { start_date: string; end_date: string }[];
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
  refund_amount?: number | null;
  rooms: Room;
};

export type Guest = {
  guest_id: string;
  email: string;
  full_name?: string;
  password_hash?: string | null;
  no_telp?: string;
};

export type Payment = {
  id: string;
  booking_id: string;
  amount: number;
  status: "menunggu" | "berhasil" | "gagal" | "dibatalkan";
  payment_method: string | null;
  transaction_id: string | null;
  paid_at: string | null;
  created_at: string;
};

export type BookingWithPayment = Booking & {
  payments: Payment[];
};
