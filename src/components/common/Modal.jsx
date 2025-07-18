import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowLeftCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
export default function Modal({
  title,
  open,
  cancelButtonRef,
  handleModal,
  isLoading,
  children,
  handleModalSubmit,
  className,
  modalType,
  modalFormStep,
  setModalFormStep,
  HeaderButton,
  disabled,
}) {
  return (
    <Transition.Root show={!open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={handleModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-400 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={`relative transform overflow-hidden rounded-lg bg-white dark:bg-blue text-left shadow-xl transition-all my-8 w-full ${className}`}
              >
                <form onSubmit={handleModalSubmit} className="w-full p-7">
                  {title && (
                    <div className="w-full flex flex-col md:flex-row items-center gap-5 justify-between mb-4">
                      <h2 className="elementHeading4 capitalize">{title}</h2>
                      <div className="flex items-center justify-end w-full md:w-auto">
                        {modalFormStep === 1 && (
                          <>{HeaderButton && <HeaderButton />}</>
                        )}
                        <div className="flex items-center end">
                          {modalFormStep > 1 && (
                            <ArrowLeftCircleIcon
                              onClick={() =>
                                setModalFormStep(modalFormStep - 1)
                              }
                              className="w-7 cursor-pointer mr-1"
                            />
                          )}
                          <XCircleIcon
                            className="text-red-400 w-7 cursor-pointer"
                            onClick={() => {
                              handleModal();
                              if (modalFormStep > 1) {
                                setModalFormStep(1);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {children}
                  {modalType && (
                    <>
                      {modalType === "delete" ? (
                        <div className="flex items-cente justify-end mt-4 space-x-2 text-white">
                          <button
                            type="button"
                            className="btnPrimarySmall "
                            onClick={handleModal}
                          >
                            Cancel
                          </button>

                          {isLoading ? (
                            <div className="bg-blue/10 flex items-center justify-center rounded-md py-2 w-48">
                              <Image
                                height="200"
                                width="500"
                                src="/img/loading.gif"
                                className="w-7"
                                alt=""
                              />
                            </div>
                          ) : (
                            <button
                              type="submit"
                              className="btnPrimarySmall bg-red-600"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-cente justify-end mt-6 space-x-2 text-white">
                          <button
                            type="button"
                            className="btnPrimarySmall bg-red-500"
                            onClick={handleModal}
                          >
                            Cancel
                          </button>
                          {isLoading ? (
                            <div className="bg-blue/10 flex items-center justify-center rounded-md py-2 w-48">
                              <Image
                                src="/img/loading.gif"
                                height="200"
                                width="500"
                                className="w-7"
                                alt="Imge"
                              />
                            </div>
                          ) : (
                            <button
                              type="submit"
                              title={
                                disabled &&
                                "Please select a tag to update value"
                              }
                              disabled={disabled}
                              className="btnPrimarySmall bg-green-600 disabled:cursor-not-allowed"
                            >
                              Save and Update
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
