"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { useMemo, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

type DropDownProps = {
  label: string;
  options: string[];
  icon?: React.ReactNode;
};

export default function FilterDropdown({
  label,
  options,
  icon,
}: DropDownProps) {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const selectedValue = useMemo(() => {
    if (selectedKeys.size === 0) return label;
    return Array.from(selectedKeys).join(", ");
  }, [selectedKeys, label]);

  return (
    <Dropdown>
      <DropdownTrigger>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 shadow-sm rounded-xl bg-white hover:bg-gray-50 text-sm cursor-pointer">
          {icon && icon}
          <span className="text-gray-600">{selectedValue || label}</span>
          <IoIosArrowDown size={14} />
        </button>
      </DropdownTrigger>

      <DropdownMenu
        // disallowEmptySelection
        aria-label={label}
        selectedKeys={selectedKeys}
        selectionMode="single"
        onSelectionChange={(keys) =>
          keys !== "all" && setSelectedKeys(keys as Set<string>)
        }
        className="p-2 rounded-xl shadow-lg border border-gray-200 bg-white min-w-45"
      >
        {options.map((option) => (
          <DropdownItem
            key={option}
            className="px-3 py-2 text-sm rounded-lg hover:bg-gray-100"
          >
            {option}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
