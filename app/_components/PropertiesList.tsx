import { Property } from "../_lib/type";
import LandingCard from "./LandingCard";
export default function PropertiesList({
  properties,
}: {
  properties: Property[];
}) {
  return (
    <>
      {properties.map((properti) => (
        <LandingCard property={properti} key={properti.id} />
      ))}
    </>
  );
}
