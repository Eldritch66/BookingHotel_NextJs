import DetailRoom from "@/app/_components/Room";
import {
  getRooms,
  properties,
  getBookedDatesForRoom,
} from "@/app/_lib/data-services";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const rooms = await getRooms(id);
  const name = rooms?.[0]?.name ?? "Room";
  return { title: `Room ${name}` };
}

export async function generateStaticParams() {
  const propertie = await properties();

  return propertie.map((prop) => ({
    id: prop.id.toString(),
  }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log("ID dari URL:", id);

  const rooms = await getRooms(id);

  const roomsWithAvailability = await Promise.all(
    rooms.map(async (room) => {
      const bookedRanges = await getBookedDatesForRoom(room.id);
      return { ...room, bookedRanges };
    }),
  );

  return (
    <div className="">
      {roomsWithAvailability.map((room) => (
        <DetailRoom key={room.id} room={room} />
      ))}
    </div>
  );
}
