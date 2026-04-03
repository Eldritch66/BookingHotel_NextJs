"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { IoIosArrowDown } from "react-icons/io";
import { useMemo, useState } from "react";

type RoomDropDownProps = {
  icon?: React.ReactNode;
  options: string[];
  onChange?: (value: number) => void;
};

function RoomDropDown({ icon, options, onChange }: RoomDropDownProps) {
  const [selectedKeys, setSelectedKeys] = useState(new Set([options[0]]));

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys],
  );

  return (
    <Dropdown>
      <DropdownTrigger className="w-full mt-3">
        <Button
          className="w-full capitalize flex flex-row justify-between px-4 py-3 h-auto rounded-xl border border-gray-300 bg-white text-left"
          variant="bordered"
        >
          <div className="flex flex-col items-start">
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              GUESTS
            </span>
            <span className="font-medium text-base">{selectedValue}</span>
          </div>
          <IoIosArrowDown className="text-gray-400" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="Guest selection"
        closeOnSelect={true}
        selectedKeys={selectedKeys}
        selectionMode="single"
        onSelectionChange={(keys) => {
          const newKeys = new Set(Array.from(keys) as string[]);
          setSelectedKeys(newKeys);
          const index = options.indexOf(Array.from(newKeys)[0]);
          onChange?.(index + 1);
        }}
        className="p-2 rounded-xl shadow-lg border border-gray-200 bg-white min-w-full"
      >
        {options.map((option: string) => (
          <DropdownItem
            key={option}
            className="px-3 py-2 text-sm text-gray-700 rounded-lg data-[hover=true]:bg-[#f5ede9] data-[selected=true]:text-[#a67f71] data-[selected=true]:font-semibold cursor-pointer"
          >
            {option}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

export default RoomDropDown;
