"use client";

import React, { useState } from "react";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import axios from "axios";

const Rating = ({ rating }) => {
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [ratingtToEdit, setRatingtToEdit] = useState(rating);
  const [openModalDelete, setOpenModalDelete] = useState(false);

  const router = useRouter();

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios
      .patch(`/api/ratings/${rating.id}`, ratingtToEdit)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
      .finally(() => {
        setRatingtToEdit(ratingtToEdit);
        setOpenModalEdit(false);
        router.refresh();
      });
  };

  const handleDeleteRating = (id) => {
    axios
      .delete(`/api/ratings/${id}`)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
      .finally(() => {
        setRatingtToEdit(ratingtToEdit);
        setOpenModalEdit(false);
        router.refresh();
      });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value =
      name === "title" ? e.target.value : parseFloat(e.target.value);

    setRatingtToEdit((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <li className="p-3 my-5 bg-slate-200" key={rating.id}>
      <h1 className="text-2xl font-bold">{rating.title}</h1>
      <p>Scary: {rating.scary}</p>
      <p>Story: {rating.story}</p>
      <p>Acting: {rating.acting}</p>
      <div className="pt-5">
        <button
          className="text-blue-700 mr-3"
          onClick={() => setOpenModalEdit(true)}
        >
          Edit
        </button>

        <Modal modalOpen={openModalEdit} setModalOpen={setOpenModalEdit}>
          <form className="w-full" onSubmit={handleEditSubmit}>
            <h1 className="text-2xl pb-3">New Rating</h1>
            <input
              type="text"
              placeholder="Title"
              name="title"
              className="w-full p-2"
              value={ratingtToEdit.title || ""}
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
              value={ratingtToEdit.scary || 5}
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
              value={ratingtToEdit.story || 5}
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
              value={ratingtToEdit.acting || 5}
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

        <button
          onClick={() => setOpenModalDelete(true)}
          className="text-red-700 mr-3"
        >
          Delete
        </button>

        <Modal modalOpen={openModalDelete} setModalOpen={setOpenModalDelete}>
          <h1 className="text-2xl pb-3">
            Are you sure you want to delete this rating?
          </h1>
          <div>
            <button
              onClick={() => handleDeleteRating(rating.id)}
              className="text-red-700 font-bold mr-5"
            >
              YES
            </button>
            <button
              onClick={() => setOpenModalDelete(false)}
              className="text-blue-700 font-bold mr-5"
            >
              NO
            </button>
          </div>
        </Modal>
      </div>
    </li>
  );
};

export default Rating;
