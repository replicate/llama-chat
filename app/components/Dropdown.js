import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid";

export default function Dropdown({ models, selectedModel, setModel }) {
  return (
    <Menu as="div" className="relative inline-flex text-left">
      <div className="text-xl items-center">
        <Menu.Button className="inline-flex items-center w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          {selectedModel.name}
          {selectedModel.new && (
            <span className="ml-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-800 ring-1 ring-inset ring-blue-600/20">
              NEW
            </span>
          )}

          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 z-10 mt-2 w-72 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {models.map((model) => (
              <Menu.Item key={model.id}>
                <button
                  className={`text-left text-gray-700 block w-full px-4 py-2 text-sm hover:bg-gray-100`}
                  onClick={() => setModel(model)}
                >
                  <div className="flex justify-between">
                    <div>
                      <p className={""}>
                        {model.emoji} {model.name}{" "}
                        {model.new && (
                          <span className="ml-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-800 ring-1 ring-inset ring-blue-600/20">
                            NEW
                          </span>
                        )}
                      </p>
                      <p className="text-xs pt-1 font-light text-gray-500">
                        {model.description}
                      </p>
                    </div>

                    {selectedModel.id === model.id && (
                      <div className="flex items-center">
                        <CheckIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                  </div>
                </button>
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
