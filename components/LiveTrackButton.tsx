"use client";

import React, { useState } from "react";

interface LiveTrackButtonProps {
  trainNumber: number;
}

const LiveTrackButton: React.FC<any> = ({ trainNumber }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={openModal}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded cursor-pointer"
      >
        Live Track
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Live Train Tracking</h2>
            <p className="mb-4">
              To track this train, send an SMS with the following command:
            </p>
            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <code className="text-sm">Type: TR {trainNumber}</code>
              <br />
              <code className="text-sm">Send to: 16318</code>
            </div>
            <button
              onClick={closeModal}
              className="bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveTrackButton;
