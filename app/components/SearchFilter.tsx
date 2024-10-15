import { useState, useRef, useEffect } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
interface SearchFilterProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}
// Custom hook to handle click outside to close the dropdown
const useOutsideClick = (ref: any, handler: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, handler]);
};

const SearchFilter: React.FC<SearchFilterProps> = ({ searchQuery, setSearchQuery }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filterOption, setFilterOption] = useState<string>("all");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(dropdownRef, () => setIsDropdownOpen(false));

  const handleSubmitFilter = () => {
    alert(`Filter applied: ${filterOption}`);
    setIsDropdownOpen(false);
  };

  const handleResetFilter = () => {
    setFilterOption("all");
    alert("Filters reset.");
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full">
      {/* Sign In Button */}
      <button className="mb-2 md:mb-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Sign in to book
      </button>

      {/* Search Input and Button */}
      <div className="flex items-center w-full md:max-w-md rounded-full border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 mb-2 md:mb-0">
        {/* Search Icon */}
        <span className="pl-4 text-gray-400">
          <FaSearch />
        </span>
        {/* Search Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search profiles..."
          className="w-full px-4 py-2 rounded-full focus:outline-none"
        />
        {/* Search Button */}
        <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 focus:outline-none">
          Search
        </button>
      </div>

      {/* Filter Button with Dropdown */}
      <div className="relative">
        <button
          className="flex items-center px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 focus:outline-none"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <FaFilter className="mr-2" />
          Filters
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-300 z-10"
          >
            <div className="p-4">
              {/* Select Menu */}
              <label htmlFor="filter" className="block text-sm font-medium text-gray-700">
                Select Filter
              </label>
              <select
                id="filter"
                value={filterOption}
                onChange={(e) => setFilterOption(e.target.value)}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All</option>
                <option value="category1">Category 1</option>
                <option value="category2">Category 2</option>
                <option value="category3">Category 3</option>
              </select>

              {/* Submit and Reset Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={handleResetFilter}
                  className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleSubmitFilter}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
