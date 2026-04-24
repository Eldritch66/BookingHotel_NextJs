export default function MainRootTagPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen h-auto w-full md:max-w-[1500px] lg:max-w-[1750px] mx-auto text-center relative overflow-x-hidden">
      {children}
    </main>
  );
}
