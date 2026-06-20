import PropertiesList from "../_components/PropertiesList";
import PaginationProperti from "../_components/PaginationProperti";
import FooterProperti from "../_components/FooterProperti";
import { auth } from "../_lib/auth";
import {
  getProperti,
  getUserByEmail,
  getActiveSewaPropertiIds,
  mapPropertiToProperty,
} from "../_lib/data-services";

export const metadata = {
  title: "Properti",
  description:
    "Temukan kosan dan kontrakan terbaik di Bogor dengan harga bersahabat.",
};

const perPage = 6;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Number(page ?? 1);

  const session = await auth();
  let pemilikId: string | null = null;
  if (session?.user?.email) {
    const user = await getUserByEmail(session.user.email);
    if (user?.role === "pemilik") pemilikId = user.id;
  }

  const raw = (await getProperti()) ?? [];
  const filtered = pemilikId
    ? raw.filter((p) => p.pemilik_id !== pemilikId)
    : raw;
  const occupiedIds = new Set(await getActiveSewaPropertiIds());
  const properties = filtered.map((p) => ({
    ...mapPropertiToProperty(p),
    isOccupied: occupiedIds.has(p.id),
  }));
  const totalPages = Math.max(1, Math.ceil(properties.length / perPage));
  const paginatedProperties = properties.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  return (
    <main className="min-h-screen w-full bg-[#fafafa]">
      <section className="w-full lg:max-w-[1750px] mx-auto px-4 pt-6">
        <div className="rounded-[28px] border border-orange-100 bg-gradient-to-b from-orange-50/70 to-white px-6 py-12 shadow-[0_8px_30px_rgba(15,23,42,0.05)] sm:px-10 sm:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center rounded-full border border-orange-200 bg-white px-4 py-1 text-xs font-medium tracking-[0.22em] text-orange-600 shadow-sm">
              NGINAPIN
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
              Temukan hunian yang tepat di Bogor.
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
              Platform pencarian kosan dan kontrakan yang sederhana, transparan,
              dan nyaman digunakan.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full lg:max-w-[1750px] mx-auto mt-10 mb-16 px-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <PropertiesList properties={paginatedProperties} />
        </div>
      </section>

      <PaginationProperti currentPage={currentPage} totalPages={totalPages} />
      <FooterProperti />
    </main>
  );
}
