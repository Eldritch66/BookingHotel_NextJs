import NavigationProfile from "../_components/NavigationProfile";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-180 w-full mt-10 px-4 py-4">
      <section className="w-full max-w-[1750px] mx-auto grid grid-cols-[350px_1fr] gap-10 h-180">
        <NavigationProfile />
        {children}
      </section>
    </main>
  );
}
