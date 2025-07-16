"use client";

import { Dialog } from "@headlessui/react";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
      />
      <Dialog.Panel className="bg-white p-6 rounded-xl shadow-xl z-10 max-w-md w-full">
        <Dialog.Title className="text-lg font-bold text-gray-900">
          {title || "Confirm"}
        </Dialog.Title>
        <Dialog.Description className="mt-2 text-gray-700">
          {message || "Are you sure?"}
        </Dialog.Description>

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default ConfirmModal;
