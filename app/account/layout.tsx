import NavigationProfile from "../_components/NavigationProfile";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-180 w-full mt-10 px-4 py-4">
      <section className="w-full max-w-[1750px] mx-auto flex flex-col sm:grid sm:grid-cols-[350px_1fr] sm:gap-10 sm:h-180">
        <NavigationProfile />
        <div className="flex-1 py-4 sm:py-0">{children}</div>
      </section>
    </main>
  );
}
