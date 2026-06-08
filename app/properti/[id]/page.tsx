import PropertyDetail from "@/app/_components/PropertyDetail";
import { getProperti, getPropertiById, mapPropertiToProperty } from "@/app/_lib/data-services";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const properti = await getPropertiById(id);
  const name = properti?.nama_properti ?? "Property";
  return { title: `Property ${name}` };
}

export async function generateStaticParams() {
  const propertiList = await getProperti();

  return propertiList.map((prop) => ({
    id: prop.id.toString(),
  }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const raw = await getPropertiById(id);
  const property = mapPropertiToProperty(raw);

  return (
    <div className="">
      <PropertyDetail property={property} />
    </div>
  );
}
