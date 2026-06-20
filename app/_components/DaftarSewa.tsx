"use client";

import SewaCard from "./SewaCard";
import { Sewa } from "../_lib/type";

export default function DaftarSewa({ sewaList }: { sewaList: Sewa[] }) {
  return (
    <ul className="space-y-6">
      {sewaList.map((sewa) => (
        <SewaCard sewa={sewa} key={sewa.id} />
      ))}
    </ul>
  );
}
