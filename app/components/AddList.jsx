"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";
import axios from "axios";
import debounce from "lodash/debounce";

const AddList = () => {
  const [title, setTitle] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [debouncedTitle, setDebouncedTitle] = useState("");
  const [listExists, setListExists] = useState(true);

  useEffect(() => {
    setTitle("");
  }, [modalOpen]);

  useEffect(() => {
    setListExists(true);
    if (debouncedTitle !== "") {
      axios
        .post("/api/listValid", { name: debouncedTitle })
        .then((res) => setListExists(!!res.data.listExists?.id))
        .catch((err) => console.log(err));
    }
  }, [debouncedTitle]);

  const debouncedInputChange = debounce((newTitle) => {
    setDebouncedTitle(newTitle);
  }, 250);

  const handleSubmit = (e) => {
    e.preventDefault();
    debouncedInputChange.cancel();
    axios
      .post("/api/lists", { title })
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
      .finally(() => {
        setTitle("");
        setModalOpen(false);
        window.location.reload();
      });
  };

  const handleInputChange = (e) => {
    setListExists(true);
    const newTitle = e.target.value;
    setTitle(newTitle);
    debouncedInputChange(newTitle);
  };

  return (
    <div>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-cinema-gold text-cinema-blue px-4 py-2 rounded-md hover:bg-cinema-gold-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cinema-gold"
      >
        + New List
      </button>
      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-cinema-gold mb-6">
            Create New List
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-white"
              >
                List Name
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="mt-1 block w-full border-gray-600 rounded-md shadow-sm focus:ring-cinema-gold focus:border-cinema-gold sm:text-sm bg-cinema-blue-light text-white"
                placeholder="Enter list name"
                value={title}
                onChange={handleInputChange}
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-white hover:bg-cinema-blue-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cinema-gold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-cinema-blue bg-cinema-gold hover:bg-cinema-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cinema-gold disabled:bg-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed"
                disabled={listExists || title === ""}
              >
                Create List
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default AddList;
