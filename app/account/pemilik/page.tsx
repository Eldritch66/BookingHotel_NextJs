import { auth } from "@/app/_lib/auth";
import { getPemilik } from "@/app/_lib/data-services";
import DaftarPemilikPrompt from "@/app/_components/DaftarPemilikPrompt";

export default async function Page() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] || "Owner";

  const pemilik = session?.user?.email
    ? await getPemilik(session.user.email)
    : null;

  if (!pemilik) {
    return (
      <div>
        <DaftarPemilikPrompt />
      </div>
    );
  }

  return (
    <h2 className="font-semibold text-2xl text-stone-900 mb-7">
      Selamat datang, {firstName}!
    </h2>
  );
}
