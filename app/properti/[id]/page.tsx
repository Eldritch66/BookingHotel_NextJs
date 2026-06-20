import PropertyDetail from "@/app/_components/PropertyDetail";
import { auth } from "@/app/_lib/auth";
import {
  getProperti,
  getPropertiById,
  isPropertiTersedia,
  mapPropertiToProperty,
} from "@/app/_lib/data-services";

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
  const isTersedia = await isPropertiTersedia(id);

  const session = await auth();
  const pemilikEmail = (raw as { pemilik?: { name?: string; email?: string }[] }).pemilik?.[0]?.email;
  const isPemilik =
    !!session?.user?.email && !!pemilikEmail && session.user.email === pemilikEmail;

  return (
    <div className="">
      <PropertyDetail
        property={property}
        isTersedia={isTersedia}
        isPemilik={isPemilik}
      />
    </div>
  );
}
