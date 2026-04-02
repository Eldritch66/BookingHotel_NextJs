import DetailRoom from "@/app/_components/Room";
import { getRooms } from "@/app/_lib/data-services";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log("ID dari URL:", id);

  const rooms = await getRooms(id);
  console.log(JSON.stringify(rooms, null, 2));

  return (
    <div className="flex items-center justify-center h-screen text-4xl">
      {rooms.map((room) => (
        <DetailRoom key={room.id} room={room} />
      ))}{" "}
    </div>
  );
}
