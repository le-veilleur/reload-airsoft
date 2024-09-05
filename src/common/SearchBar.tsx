// src/components/SearchBar.tsx

import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (searchParams: {
    date?: string;
    time?: string;
    location?: string;
  }) => Promise<void>;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    // Appel à la fonction onSearch passée en props
    await onSearch({ date, time, location });
  };

  return (
    <div className="flex justify-center pt-2">
      <div className="p-4 shadow-xl rounded-lg border w-full max-w-4xl border-none bg-white">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[150px]">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 "
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label
              htmlFor="time"
              className="block text-sm font-medium text-gray-700"
            >
              Heure
            </label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 "
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Lieu
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Rechercher un lieu"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2"
            />
          </div>
          <button
            type="submit"
            className="self-end px-4 py-2 bg-indigo-900 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2"
          >
            Rechercher
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
