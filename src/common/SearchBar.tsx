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
    <div className="flex justify-center pt-4 px-4 sm:px-6 lg:px-8">
      <div className="p-4 shadow-xl rounded-full border w-full max-w-4xl bg-white">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <div className="flex-1 w-full">
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Date"
              className="block w-full px-3 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2"
            />
          </div>
          <div className="flex-1 w-full">
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Heure"
              className="block w-full px-3 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2"
            />
          </div>
          <div className="flex-1 w-full">
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Lieu"
              className="block w-full px-3 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-indigo-900 text-white font-semibold rounded-full shadow-md focus:outline-none focus:ring-2"
          >
            Rechercher
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
