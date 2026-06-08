import { auth } from "@/app/_lib/auth";
import { getPemilik } from "@/app/_lib/data-services";
import { redirect } from "next/navigation";
import { tambahProperti } from "@/app/_lib/action";
import FormTambahProperti from "@/app/_components/FormTambahProperti";
import DaftarPemilikPrompt from "@/app/_components/DaftarPemilikPrompt";

export default async function Page() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const pemilik = await getPemilik(session.user.email);
  if (!pemilik) return <DaftarPemilikPrompt />;

  return (
    <div>
      <h2 className="font-semibold text-2xl text-stone-900 mb-7">
        Tambah Properti
      </h2>
      <FormTambahProperti tambahProperti={tambahProperti} />
    </div>
  );
}
