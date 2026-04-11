import DetailRoom from "@/app/_components/Room";
import { getRooms, properties } from "@/app/_lib/data-services";

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

  return (
    <div className="flex items-center justify-center h-screen">
      {rooms.map((room) => (
        <DetailRoom key={room.id} room={room} />
      ))}
    </div>
  );
}
