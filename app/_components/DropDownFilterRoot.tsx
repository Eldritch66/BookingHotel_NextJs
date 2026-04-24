"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { IoIosArrowDown } from "react-icons/io";
import { useMemo } from "react";

type DropDownProps = {
  icon?: React.ReactNode;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
};

function DropDownFilterMain({ icon, options, value, onChange }: DropDownProps) {
  const selectedKeys = useMemo(() => new Set([value]), [value]);

  return (
    <Dropdown>
      <DropdownTrigger className="h-12 px-12 rounded-md bg-white shadow-md cursor-pointer">
        <Button className="capitalize flex flex-row w-full" variant="bordered">
          <span className="text-gray-500">{icon}</span>
          {value}
          <IoIosArrowDown className="ml-auto" />
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        disallowEmptySelection
        aria-label="Single selection"
        closeOnSelect
        selectedKeys={selectedKeys}
        selectionMode="single"
        onSelectionChange={(keys) => {
          if (keys === "all") return;
          const newKeys = keys as Set<string>;
          const nextValue = Array.from(newKeys)[0];
          onChange(nextValue);
        }}
        className="p-2 rounded-xl shadow-lg border border-gray-200 bg-white min-w-[220px]"
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

export default DropDownFilterMain;
