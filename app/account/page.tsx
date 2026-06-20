import { auth } from "../_lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Guest area",
};

export default async function Page() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const role = session?.user?.role;

  if (role === "pemilik") {
    redirect("/account/pemilik");
  }

  const firstName = session?.user?.name?.split(" ")[0] || "Guest";
  return (
    <h2 className="font-semibold text-2xl text-accent-400 mb-7">
      Welcome, {firstName}!
    </h2>
  );
}
