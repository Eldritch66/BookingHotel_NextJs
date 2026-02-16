"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { IoIosArrowDown } from "react-icons/io";

import { useMemo, useState } from "react";

type DropDownProps = {
  icon: React.ReactNode;
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
        <Button className="capitalize flex flex-row" variant="bordered">
          {icon}
          {selectedValue}
          <IoIosArrowDown className="ml-2 flex flex-end" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="Multiple selection example"
        closeOnSelect={false}
        selectedKeys={selectedKeys}
        selectionMode="single"
        variant="flat"
        onSelectionChange={setSelectedKeys}
        className="flex flex-col border text-black rounded-md shadow-md px-10 py-2 hover:bg-gray-100 text-sm"
      >
        {options.map((option) => (
          <DropdownItem key={option}>{option}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

export default DropDown;
