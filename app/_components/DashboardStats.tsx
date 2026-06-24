"use client";

import { FiHome, FiDollarSign, FiCalendar, FiMapPin } from "react-icons/fi";
import { formatRupiah } from "../_lib/currency";

type Stats = {
  totalBookings: number;
  totalSpending: number;
  upcomingCount: number;
  uniqueProperties: number;
};

export default function DashboardStats({ stats }: { stats: Stats }) {
  const cards = [
    {
      label: "Total Booking",
      value: stats.totalBookings,
      icon: FiHome,
      color: "bg-blue-50 text-blue-600",
      delay: 0,
    },
    {
      label: "Total Pengeluaran",
      value: formatRupiah(stats.totalSpending),
      icon: FiDollarSign,
      color: "bg-green-50 text-green-600",
      delay: 100,
    },
    {
      label: "Akan Datang",
      value: stats.upcomingCount,
      icon: FiCalendar,
      color: "bg-purple-50 text-purple-600",
      delay: 200,
    },
    {
      label: "Properti Dikunjungi",
      value: stats.uniqueProperties,
      icon: FiMapPin,
      color: "bg-orange-50 text-orange-600",
      delay: 300,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="animate-fade-up rounded-xl border border-gray-200 bg-white p-4 sm:p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
          style={{ animationDelay: `${card.delay}ms` }}
        >
          <div className={`inline-flex rounded-lg p-2 sm:p-2.5 ${card.color} mb-3`}>
            <card.icon size={18} />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">
            {card.value}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
