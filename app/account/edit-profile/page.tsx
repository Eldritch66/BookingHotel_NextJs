import { auth } from "@/app/_lib/auth";
import { getGuest } from "@/app/_lib/data-services";
import EditProfile from "@/app/_components/EditProfile";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Edit Profil",
};

export default async function Page() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const guest = await getGuest(session.user.email);

  return (
    <div className="space-y-6">
      {guest && <EditProfile guest={guest} defaultOpen />}
    </div>
  );
}
