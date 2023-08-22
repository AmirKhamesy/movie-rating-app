"use client";

import { useState } from "react";
import Modal from "./Modal";
import axios from "axios";
import { useRouter } from "next/navigation";

const AddRating = () => {
  const [inputs, setInputs] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/ratings", inputs)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
      .finally(() => {
        setInputs({});
        setModalOpen(false);
        router.refresh();
      });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value =
      name === "title" ? e.target.value : parseFloat(e.target.value);

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  return (
    <div>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-green-700 text-white p-3 cursor-pointer"
      >
        + New Rating
      </button>
      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <form className="w-full" onSubmit={handleSubmit}>
          <h1 className="text-2xl pb-3">New Rating</h1>
          <input
            type="text"
            placeholder="Title"
            name="title"
            className="w-full p-2"
            value={inputs.title || ""}
            onChange={handleChange}
          />

          <label htmlFor="scary" className="block my-2 text-lg font-medium ">
            Scary
          </label>
          <input
            id="scary"
            type="range"
            name="scary"
            min="0"
            max="10"
            step="0.5"
            className="w-full h-1 bg-white rounded-lg  cursor-pointer p-2"
            value={inputs.scary || 5}
            onChange={handleChange}
          />

          <label htmlFor="story" className="block my-2 text-lg font-medium ">
            Story
          </label>
          <input
            id="story"
            type="range"
            name="story"
            min="0"
            max="10"
            step="0.5"
            className="w-full h-1 bg-white rounded-lg  cursor-pointer p-2"
            value={inputs.story || 5}
            onChange={handleChange}
          />

          <label htmlFor="acting" className="block my-2 text-lg font-medium ">
            Acting
          </label>
          <input
            id="acting"
            type="range"
            name="acting"
            min="0"
            max="10"
            step="0.5"
            className="w-full h-1 bg-white rounded-lg  cursor-pointer p-2"
            value={inputs.acting || 5}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="bg-blue-700 text-white px-5 py-2 mt-2"
          >
            Submit
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AddRating;
