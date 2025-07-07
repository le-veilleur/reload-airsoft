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
    await onSearch({ date, time, location });
  };

  return (
    <div className="w-full">
      <div className="p-2 shadow-sm rounded-md border bg-white">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-2"
        >
          <div className="w-full">
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ville, région, département..."
              className="block w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-1">
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
            />
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="block w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
            />
          </div>
          <button
            type="submit"
            className="w-full px-3 py-1.5 bg-blue-600 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs hover:bg-blue-700 transition-colors"
          >
            Rechercher
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
