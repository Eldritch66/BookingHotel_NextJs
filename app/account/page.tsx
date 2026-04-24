import { signOut } from "next-auth/react";
import { auth } from "../_lib/auth";
import SignOutButton from "../_components/SignOutButton";

export const metadata = {
  title: "Guest area",
};

export default async function Page() {
  const session = await auth();
  console.log("Guest area session:", session);
  const firstName = session?.user?.name?.split(" ")[0] || "Guest";
  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Welcome, {firstName}!
      </h2>

      <SignOutButton />
    </div>
  );
}
