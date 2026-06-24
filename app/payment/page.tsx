import { getRoomById } from "@/app/_lib/data-services";
import { auth } from "@/app/_lib/auth";
import { getGuest } from "@/app/_lib/data-services";
import { redirect } from "next/navigation";
import PaymentPageClient from "@/app/_components/PaymentPageClient";

export const metadata = {
  title: "Payment",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const guest = await getGuest(session.user.email);
  if (!guest) redirect("/login");

  const sp = await searchParams;
  const room_id = sp.room_id as string;
  const start_date = sp.start_date as string;
  const end_date = sp.end_date as string;
  const num_nights = Number(sp.num_nights);
  const total_price = Number(sp.total_price);

  if (!room_id || !start_date || !end_date || !num_nights || !total_price) {
    redirect("/bookings");
  }

  const room = await getRoomById(room_id);
  if (!room) redirect("/bookings");

  const prop = Array.isArray(room.properties)
    ? room.properties[0]
    : room.properties;

  const roomData = {
    id: room.id,
    name: room.name,
    price_per_night: room.price_per_night,
    properties: {
      title: prop?.title ?? "",
      city: prop?.city ?? "",
      province: prop?.province ?? "",
      property_images: prop?.property_images ?? [],
    },
  };

  return (
    <PaymentPageClient
      room={roomData}
      startDate={start_date}
      endDate={end_date}
      numNights={num_nights}
      totalPrice={total_price}
    />
  );
}
