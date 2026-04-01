import DetailRoom from "@/app/_components/Room";
import { getRooms } from "@/app/_lib/data-services";
import { Room } from "@/app/_lib/type";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log("ID dari URL:", id);

  const rooms: Room = await getRooms(id);

  return (
    <div className="flex items-center justify-center h-screen text-4xl">
      <DetailRoom room={rooms} />
    </div>
  );
}
