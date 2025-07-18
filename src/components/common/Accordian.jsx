import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Container from "./Container";
import Title from "../Title";

export default function Accordian({ options }) {
  return (
    <Container className="text-gray-900 mt-10 mx-auto max-w-[1300px]">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <Title text1={"Frequently Asked"} text2={"Questions"} />
        <p className="mt-4 text-green-700 text-lg font-medium">
          Everything you need to know about Amana Organics – our organic food, skincare products, and your shopping experience.
        </p>
      </div>
      <div className="flex flex-col items-center w-full mt-5">
        {options.map((item, key) => {
          return (
            <Menu
              key={key}
              as="div"
              className="relative inline-block text-left w-full max-w-3xl mb-4"
            >
              <div>
                <Menu.Button className="w-full flex justify-between items-center rounded-xl bg-green-50 border border-green-200 text-left p-4 px-6 font-semibold text-green-900 shadow-sm hover:bg-green-100 transition-all">
                  <span>{item.question}</span>
                  <ChevronDownIcon className="h-5 w-5 ml-5 text-green-600" />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-300"
                enterFrom="transform opacity-0 -translate-y-2"
                enterTo="transform opacity-100 translate-y-0"
                leave="transition ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Menu.Items className="bg-white border border-green-100 rounded-b-xl shadow-lg">
                  <div className="flex flex-col items-center h-full">
                    <div className="w-full p-6 text-gray-700 text-base">
                      {item.answer}
                    </div>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          );
        })}
      </div>
    </Container>
  );
}
