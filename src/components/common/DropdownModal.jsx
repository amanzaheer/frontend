import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Checkbox from "./Checkbox";

const DropdownModal = ({
  title,
  Icon,
  className = "",
  children,
  modalStyle = "",
  checkbox,
  dropdown,
  iconValue,
  showValue,
}) => {
  return (
    <Menu as="div" className="relative">
      <Menu.Button
        className={`flex items-center justify-between gap-2 ${className}`}
      >
        <div className="flex items-center">
          {dropdown && <ChevronDownIcon className="w-4 mr-2" />}
          {Icon && (
            <div className="relative">
              <Icon className="w-6" />
              {showValue && (
                <span className="p-2 rounded-full bg-red-500 absolute top-0 right-0 -mt-3 -mr-3 text-white text-xs w-5 h-5 flex items-center justify-center">
                  {iconValue}
                </span>
              )}
            </div>
          )}{" "}
          {title && title}
        </div>
        {checkbox && <Checkbox />}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`absolute right-0 top-0 mt-7 bg-white p-5 z-20 shadow-lg shadow-black/15 rounded-lg w-72 ${modalStyle}`}
        >
          <Menu.Item>{children}</Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default DropdownModal;
