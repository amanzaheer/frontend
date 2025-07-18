import React from "react";

const ErrorPopup = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-green-900">Error</h2>
        <p className="mb-4 text-gray-700">{message}</p>
        <button
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-red-700 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorPopup; 