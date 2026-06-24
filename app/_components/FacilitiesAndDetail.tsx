import {
  Wifi,
  Wind,
  Car,
  UtensilsCrossed,
  ArrowUpDown,
  Clock,
  Coffee,
  Waves,
  CookingPot,
  Trees,
  Mountain,
  Eye,
  Heart,
  Umbrella,
  Bed,
  Users,
} from "lucide-react";

const facilityIconMap: Record<string, React.ReactNode> = {
  wifi: <Wifi size={14} />,
  ac: <Wind size={14} />,
  parkir: <Car size={14} />,
  restoran: <UtensilsCrossed size={14} />,
  lift: <ArrowUpDown size={14} />,
  "resepsionis 24 jam": <Clock size={14} />,
  sarapan: <Coffee size={14} />,
  "kolam renang": <Waves size={14} />,
  dapur: <CookingPot size={14} />,
  taman: <Trees size={14} />,
  "area hiking": <Mountain size={14} />,
  "pemandangan alam": <Eye size={14} />,
  spa: <Heart size={14} />,
  "pantai pribadi": <Umbrella size={14} />,
};

function getFacilityIcon(name: string): React.ReactNode | null {
  const key = name.toLowerCase().trim();
  return facilityIconMap[key] ?? null;
}

export default function FacilitiesAndDetail({
  facilities,
  bedType,
  quantity,
}: {
  facilities?: string[];
  bedType: string;
  quantity: number;
}) {
  const allItems = [
    ...(facilities ?? []).map((f) => ({
      icon: getFacilityIcon(f),
      label: f,
    })),
    {
      icon: <Bed size={14} />,
      label: bedType,
    },
    {
      icon: <Users size={14} />,
      label: `${quantity} Tamu`,
    },
  ];

  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-3 text-base">Fasilitas</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {allItems.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 px-2.5 py-2 border border-gray-200 rounded-lg bg-gray-50 text-xs text-gray-700"
          >
            <span className="text-gray-500 shrink-0">{item.icon}</span>
            <span className="capitalize truncate">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
