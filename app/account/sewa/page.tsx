import DaftarSewa from "@/app/_components/DaftarSewa";
import { auth } from "@/app/_lib/auth";
import { getPenyewa, getSewa } from "@/app/_lib/data-services";
import Link from "next/link";
import { redirect } from "next/navigation";
export default async function Page() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const penyewa = await getPenyewa(session.user.email);
  if (!penyewa) redirect("/");

  const sewaList = (await getSewa(penyewa.id)) ?? [];

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Properti Sewa
      </h2>

      {sewaList.length === 0 ? (
        <p className="text-lg">
          Belum ada sewa. Lihat properti{" "}
          <Link className="underline text-accent-500" href="/properti">
            yang tersedia &rarr;
          </Link>
        </p>
      ) : (
        <ul className="space-y-6">
          <DaftarSewa sewaList={sewaList} />
        </ul>
      )}
    </div>
  );
}
