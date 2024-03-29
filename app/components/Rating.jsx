"use client";

import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import axios from "axios";
import Autocomplete from "./Autocomplete";
import Image from "next/image";
import ProgressBar from "./ProgressBar";
import moment from "moment";

const Rating = ({ rating, setRating, idx }) => {
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [ratingToEdit, setRatingToEdit] = useState(rating);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [movieDetails, setMovieDetails] = useState({});

  const router = useRouter();

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${rating.tmdbId}`,
        {
          params: {
            api_key: process.env.NEXT_PUBLIC_TMDB_KEY,
          },
        }
      );

      if (response.data) {
        const movie = response.data;
        setMovieDetails(movie);
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  useEffect(() => {
    setRatingToEdit(rating);
  }, [openModalEdit]);

  useEffect(() => {
    fetchMovieDetails();
  }, [rating]);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios
      .patch(`/api/ratings/${rating.id}`, ratingToEdit)
      .then((res) => {
        setRating(res.data, idx);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setRatingToEdit(ratingToEdit);
        setOpenModalEdit(false);
        router.refresh();
      });
  };

  const handleDeleteRating = (id) => {
    axios
      .delete(`/api/ratings/${id}`)
      .then((res) => {
        setRating(null, idx);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setRatingToEdit(ratingToEdit);
        setOpenModalDelete(false);
        router.refresh();
      });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value =
      name === "title" ? e.target.value : parseFloat(e.target.value);

    setRatingToEdit((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <li className="p-3 my-5 bg-slate-200" key={rating.id}>
      <h1 className="text-2xl font-bold">{rating.title}</h1>

      {/* Display Movie Image */}
      <div className="flex flex-row gap-3">
        {movieDetails.poster_path && (
          <div className="my-auto">
            <Image
              src={`https://image.tmdb.org/t/p/w300${movieDetails.poster_path}`}
              alt={rating.title}
              width="150"
              height="200"
            />
          </div>
        )}

        <div className="w-full">
          <ProgressBar title={"Scary"} score={rating.scary} />
          <ProgressBar title={"Story"} score={rating.story} />
          <ProgressBar title={"Acting"} score={rating.acting} />
        </div>
      </div>
      <div className="pt-3 ml-1">
        <button
          className="text-blue-700 mr-5"
          onClick={() => setOpenModalEdit(true)}
        >
          Edit
        </button>

        <Modal modalOpen={openModalEdit} setModalOpen={setOpenModalEdit}>
          <form className="w-full" onSubmit={handleEditSubmit}>
            <div className="flex justify-between items-center  mb-3">
              <h1 className="text-2xl">Edit Rating</h1>
              <p className="text-sm text-gray-500">
                Updated {moment(ratingToEdit.updatedAt).fromNow()}{" "}
              </p>
            </div>
            <Autocomplete
              value={ratingToEdit.title}
              handleChange={handleChange}
              edit={true}
            />
            <label htmlFor="scary" className="block my-4 text-lg font-medium ">
              Scary{" "}
              {ratingToEdit.scary !== undefined && `(${ratingToEdit.scary})`}
            </label>
            <input
              id="scary"
              type="range"
              name="scary"
              min="0"
              max="10"
              step="0.5"
              className="slider"
              value={ratingToEdit.scary}
              onChange={handleChange}
            />
            <label htmlFor="story" className="block my-4 text-lg font-medium ">
              Story{" "}
              {ratingToEdit.story !== undefined && `(${ratingToEdit.story})`}
            </label>
            <input
              id="story"
              type="range"
              name="story"
              min="0"
              max="10"
              step="0.5"
              className="slider"
              value={ratingToEdit.story}
              onChange={handleChange}
            />
            <label htmlFor="acting" className="block my-4 text-lg font-medium ">
              Acting{" "}
              {ratingToEdit.acting !== undefined && `(${ratingToEdit.acting})`}
            </label>
            <input
              id="acting"
              type="range"
              name="acting"
              min="0"
              max="10"
              step="0.5"
              className="slider"
              value={ratingToEdit.acting}
              onChange={handleChange}
            />
            <button
              type="submit"
              className="bg-blue-700 text-white px-5 py-2 mt-4  disabled:bg-blue-300"
              disabled={
                // Disable submit button if no changes have been made
                ratingToEdit.title === rating.title
                  ? ratingToEdit.scary === rating.scary &&
                    ratingToEdit.story === rating.story &&
                    ratingToEdit.acting === rating.acting
                  : false
              }
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
