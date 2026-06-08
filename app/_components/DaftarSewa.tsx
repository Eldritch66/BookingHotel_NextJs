"use client";

import { useOptimistic } from "react";
import SewaCard from "./SewaCard";
import { batalkanSewa } from "../_lib/action";
import { Sewa } from "../_lib/type";

function DaftarSewa({ sewaList }: { sewaList: Sewa[] }) {
  const [optimisticSewa, optimisticDelete] = useOptimistic(
    sewaList,
    (curSewa, sewaId) => {
      return curSewa.filter((sewa) => sewa.id !== sewaId);
    },
  );

  async function handleDelete(sewaId: string) {
    optimisticDelete(sewaId);
    await batalkanSewa(sewaId);
  }

  return (
    <ul className="space-y-6">
      {optimisticSewa.map((sewa) => (
        <SewaCard
          sewa={sewa}
          key={sewa.id}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
}

export default DaftarSewa;
