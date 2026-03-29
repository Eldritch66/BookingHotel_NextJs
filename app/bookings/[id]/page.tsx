import DetailRoom from "@/app/_components/Room";
import { getRooms } from "@/app/_lib/data-services";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const rooms = await getRooms(Number(id));

  return (
    <div className="flex items-center justify-center h-screen text-4xl">
      <DetailRoom rooms={rooms} />
    </div>
  );
}
