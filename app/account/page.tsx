import { auth } from "../_lib/auth";
import NavigationProfile from "../_components/NavigationProfile";

export const metadata = {
  title: "Guest area",
};

export default async function Page() {
  const session = await auth();
  console.log("Guest area session:", session);
  const firstName = session?.user?.name?.split(" ")[0] || "Guest";
  return (
    <main className="min-h-180 w-full mt-10 px-4 py-4">
      <section className="w-full max-w-[1750px] mx-auto grid grid-cols-[350px_1fr] gap-10 h-180">
        <NavigationProfile />
        <h2 className="font-semibold text-2xl text-accent-400 mb-7">
          Welcome, {firstName}!
        </h2>
      </section>
    </main>
  );
}
