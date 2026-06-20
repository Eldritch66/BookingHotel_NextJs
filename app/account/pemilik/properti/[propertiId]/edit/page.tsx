import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/app/_lib/auth";
import { getUserByEmail, getPropertiById } from "@/app/_lib/data-services";
import { editProperti } from "@/app/_lib/action";
import { ArrowLeft } from "lucide-react";
import FormEditProperti from "@/app/_components/FormEditProperti";

export default async function EditPropertiPage({
  params,
}: {
  params: Promise<{ propertiId: string }>;
}) {
  const { propertiId } = await params;
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await getUserByEmail(session.user.email);
  if (!user || user.role !== "pemilik") redirect("/role?alert=harus-pemilik");

  let properti;
  try {
    properti = await getPropertiById(propertiId);
  } catch {
    notFound();
  }

  return (
    <div>
      <Link
        href={`/account/pemilik/properti/${propertiId}`}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 mb-6 transition"
      >
        <ArrowLeft size={16} />
        Kembali
      </Link>

      <h2 className="font-semibold text-2xl text-stone-900 mb-6">Edit Properti</h2>

      <FormEditProperti properti={properti} editProperti={editProperti} />
    </div>
  );
}
