import React, { useState, useEffect } from "react";
import Modal from "./Modal";

const initialFilters = {
  scary: 0,
  story: 0,
  acting: 0,
  sort: "newest",
  search: "",
};

const FilterModal = ({ filters, setFilters }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (e) => {
    const value =
      e.target.type === "range" ? parseInt(e.target.value) : e.target.value;
    setLocalFilters({ ...localFilters, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFilters(localFilters);
    setModalOpen(false);
  };

  const handleReset = () => {
    setLocalFilters(initialFilters);
    setFilters(initialFilters);
    setModalOpen(false);
  };

  return (
    <>
      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => setModalOpen(true)}
      >
        Filters
      </button>

      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Filter Ratings
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700"
              >
                Search
              </label>
              <input
                type="text"
                id="search"
                name="search"
                value={localFilters.search}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search by title"
              />
            </div>
            {["scary", "story", "acting"].map((filter) => (
              <div key={filter}>
                <label
                  htmlFor={filter}
                  className="block text-sm font-medium text-gray-700"
                >
                  Minimum {filter.charAt(0).toUpperCase() + filter.slice(1)}{" "}
                  Rating: {localFilters[filter]}
                </label>
                <input
                  type="range"
                  id={filter}
                  name={filter}
                  min="0"
                  max="10"
                  value={localFilters[filter]}
                  onChange={handleInputChange}
                  className="mt-1 block w-full"
                />
              </div>
            ))}
            <div>
              <label
                htmlFor="sort"
                className="block text-sm font-medium text-gray-700"
              >
                Sort By
              </label>
              <select
                id="sort"
                name="sort"
                value={localFilters.sort}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default FilterModal;
