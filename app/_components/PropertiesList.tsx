import { Property } from "../_lib/type";
import Card from "./Card";
export default function PropertiesList({
  properties,
}: {
  properties: Property[];
}) {
  return (
    <>
      {properties.map((properti) => (
        <Card property={properti} key={properti.id} />
      ))}
    </>
  );
}
