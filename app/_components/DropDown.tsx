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

type DropDownProps = {
  icon?: React.ReactNode;
  options: string[];
};
function DropDown({ icon, options }: DropDownProps) {
  const [selectedKeys, setSelectedKeys] = useState(new Set([options[0]]));

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys],
  );

  return (
    <Dropdown>
      <DropdownTrigger className="h-12 px-12 rounded-md bg-white shadow-md cursor-pointer">
        <Button className="capitalize flex flex-row w-full" variant="bordered">
          {/* === LOCATION === */}
          <span className="text-gray-500">{icon}</span>
          {selectedValue}
          {/* <IoIosArrowDown className="ml-2 flex flex-end" /> */}
          <IoIosArrowDown className="ml-auto" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="Location selection"
        closeOnSelect={true}
        selectedKeys={selectedKeys}
        selectionMode="single"
        onSelectionChange={(keys) =>
          keys !== "all" && setSelectedKeys(keys as Set<string>)
        }
        className="p-2 rounded-xl shadow-lg border border-gray-200 bg-white min-w-55"
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

export default DropDown;
