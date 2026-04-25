"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";

type NavCabinsProps = {
  label: string;
  options: readonly string[];
  paramKey: "location" | "type" | "price";
  isLast?: boolean;
};

export default function NavCabins2({
  label,
  options,
  paramKey,
  isLast,
}: NavCabinsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentValue = searchParams.get(paramKey) ?? "All";
  const selectedKeys = useMemo(() => new Set([currentValue]), [currentValue]);

  const updateUrl = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "All") {
      params.delete(paramKey);
    } else {
      params.set(paramKey, value);
    }

    router.push(`/bookings?${params.toString()}`);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <div
          className={`flex flex-col cursor-pointer hover:bg-gray-200 px-6 py-2 w-full ${
            !isLast ? "border-r" : ""
          }`}
        >
          <span className="text-xs text-gray-400 uppercase">{label}</span>

          <div className="flex items-center mt-2 text-xs sm:text-sm text-gray-700">
            {currentValue}
          </div>
        </div>
      </DropdownTrigger>

      <DropdownMenu
        disallowEmptySelection
        aria-label="selection"
        selectedKeys={selectedKeys}
        selectionMode="single"
        onSelectionChange={(keys) => {
          if (keys === "all") return;
          const nextValue = Array.from(keys as Set<string>)[0];
          updateUrl(nextValue);
        }}
        className="p-2 rounded-xl shadow-lg border border-gray-200 bg-white w-[100px] sm:w-[200px] md:w-[300px]"
      >
        {options.map((option) => (
          <DropdownItem
            key={option}
            className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer border-b border-black/10 last:border-0"
          >
            {option}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
