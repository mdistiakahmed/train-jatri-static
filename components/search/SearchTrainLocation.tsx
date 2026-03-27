"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import Fuse from 'fuse.js';
import { trainDataSummary } from '@/data/trainDataSummary';

interface TrainInfo {
  name: string;
  forwardPath: string;
  forwardTrainNumber: string;
  reversePath: string;
  reverseTrainNumber: string;
}

const SearchTrainLocation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrain, setSelectedTrain] = useState<TrainInfo | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Configure Fuse.js options
  const fuseOptions = {
    keys: ['name', 'forwardPath', 'reversePath', 'forwardTrainNumber', 'reverseTrainNumber'],
    threshold: 0.3,
  };

  // Initialize Fuse with train data
  const fuse = useMemo(() => new Fuse(trainDataSummary, fuseOptions), []);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchTerm.trim() || selectedTrain) return [];
    return fuse.search(searchTerm).map(result => result.item);
  }, [searchTerm, fuse, selectedTrain]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTrainSelect = (train: TrainInfo) => {
    setSelectedTrain(train);
    setSearchTerm(train.name);
    setIsDropdownOpen(false);

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "Live Train Search", {
        event_category: "Live Train Search",
        event_label: "Train Search",
        value: train.name,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedTrain(null);
    if (e.target.value.trim()) {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  };

  const handleInputFocus = () => {
    if (searchTerm.trim() && !selectedTrain) {
      setIsDropdownOpen(true);
    }
  };

  return (
    <div className="p-4 my-10 mx-auto max-w-4xl bg-white">
      <div className="mb-8" ref={searchContainerRef}>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder="Search train name for tracking..."
            className="w-full p-3 border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {isDropdownOpen && searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((train, index) => (
                <div
                  key={`${train.name}-${index}`}
                  className="p-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleTrainSelect(train)}
                >
                  <div className="font-medium">{train.name}</div>
                  <div className="text-sm text-gray-600">
                    {train.forwardPath} / {train.reversePath}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedTrain && (
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">{selectedTrain.name}</h2>
          <div className="space-y-4">
            {selectedTrain.forwardTrainNumber && (
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="font-medium">To track <strong>{selectedTrain.forwardPath}</strong>:</p>
                <p className="text-lg font-mono bg-gray-100 p-2 rounded mt-1">
                  TR {selectedTrain.forwardTrainNumber} to 16318
                </p>
              </div>
            )}
            {selectedTrain.reverseTrainNumber && (
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="font-medium">To track <strong>{selectedTrain.reversePath}</strong>:</p>
                <p className="text-lg font-mono bg-gray-100 p-2 rounded mt-1">
                  TR {selectedTrain.reverseTrainNumber} to 16318
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchTrainLocation;
