"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";
import axios from "axios";

const AddList = () => {
  const [title, setTitle] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [debouncedTitle, setDebouncedTitle] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(null);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Cancel the debounce timer if a submit is triggered
    clearTimeout(debounceTimer);
    axios
      .post("/api/lists", { title })
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
      .finally(() => {
        setTitle("");
        setModalOpen(false);
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && title !== "" && !listExists) {
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    setListExists(true);
    const newTitle = e.target.value;
    setTitle(newTitle);
    // Cancel the previous debounce and start a new one
    clearTimeout(debounceTimer);
    const newDebounceTimer = setTimeout(() => {
      setDebouncedTitle(newTitle);
    }, 250);
    setDebounceTimer(newDebounceTimer);
  };

  return (
    <div>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-green-700 text-white p-3 cursor-pointer"
      >
        + New List
      </button>
      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl">New List</h1>

            <input
              type="text"
              name="title"
              className="border rounded p-2 w-full"
              placeholder="List name"
              value={title}
              onChange={handleInputChange}
              onKeyUp={handleKeyPress}
            />

            <button
              type="submit"
              className="bg-blue-700 text-white px-5 py-2 mt-2 disabled:bg-blue-300"
              disabled={listExists || title === ""}
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddList;
