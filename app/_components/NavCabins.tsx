"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { useMemo, useState } from "react";
import { IoLocationOutline } from "react-icons/io5";

type DropDownProps = {
  label: string;
  options: string[];
  isLast?: boolean;
};

export default function NavCabins({ label, options, isLast }: DropDownProps) {
  const [selectedKeys, setSelectedKeys] = useState(new Set([options[0]]));

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys],
  );

  return (
    <Dropdown>
      <DropdownTrigger>
        <div
          className={`flex flex-col cursor-pointer hover:bg-gray-200 px-6 py-2 w-full ${
            !isLast ? "border-r" : ""
          }`}
        >
          <span className="text-xs text-gray-400 uppercase">{label}</span>

          <div className="flex items-center gap-2 text-sm text-gray-70">
            {selectedValue}
          </div>
        </div>
      </DropdownTrigger>

      <DropdownMenu
        disallowEmptySelection
        aria-label="selection"
        selectedKeys={selectedKeys}
        selectionMode="single"
        onSelectionChange={setSelectedKeys}
        className="p-2 rounded-xl shadow-lg border border-gray-200 bg-white w-[150px] sm:w-[200px] md:w-[300px]"
      >
        {options.map((option) => (
          <DropdownItem
            key={option}
            className="px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            {option}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
