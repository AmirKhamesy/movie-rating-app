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
        className="bg-cinema-gold text-cinema-blue px-4 py-2 rounded-md hover:bg-cinema-gold-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cinema-gold"
        onClick={() => setModalOpen(true)}
      >
        Filters
      </button>

      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-cinema-gold mb-6">
            Filter Ratings
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-white"
              >
                Search
              </label>
              <input
                type="text"
                id="search"
                name="search"
                value={localFilters.search}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-600 rounded-md shadow-sm focus:ring-cinema-gold focus:border-cinema-gold sm:text-sm bg-cinema-blue-light text-white"
                placeholder="Search by title"
              />
            </div>
            {["scary", "story", "acting"].map((filter) => (
              <div key={filter}>
                <label
                  htmlFor={filter}
                  className="block text-sm font-medium text-white"
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
                  className="mt-1 block w-full accent-cinema-gold"
                />
              </div>
            ))}
            <div>
              <label
                htmlFor="sort"
                className="block text-sm font-medium text-white"
              >
                Sort By
              </label>
              <select
                id="sort"
                name="sort"
                value={localFilters.sort}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-cinema-gold focus:border-cinema-gold sm:text-sm rounded-md bg-cinema-blue-light text-white"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-white hover:bg-cinema-blue-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cinema-gold"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-white hover:bg-cinema-blue-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cinema-gold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-cinema-blue bg-cinema-gold hover:bg-cinema-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cinema-gold"
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
