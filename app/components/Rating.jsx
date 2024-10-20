"use client";

import React, { useState, useEffect, useMemo } from "react";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import axios from "axios";
import Autocomplete from "./Autocomplete";
import Image from "next/image";
import ProgressBar from "./ProgressBar";
import moment from "moment";
import { motion } from "framer-motion";
import { FaClock, FaCalendar, FaEdit } from "react-icons/fa";

const Rating = ({ rating, setRating, idx }) => {
  const [openModal, setOpenModal] = useState(false);
  const [ratingToEdit, setRatingToEdit] = useState(rating);
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
        setOpenModal(false);
        router.refresh();
      });
  };

  const handleDeleteRating = () => {
    axios
      .delete(`/api/ratings/${rating.id}`)
      .then(() => {
        setRating(null, idx);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setOpenModal(false);
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

  const isEdited = useMemo(() => {
    return (
      ratingToEdit.title !== rating.title ||
      ratingToEdit.scary !== rating.scary ||
      ratingToEdit.story !== rating.story ||
      ratingToEdit.acting !== rating.acting
    );
  }, [ratingToEdit, rating]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative bg-cinema-blue-lighter shadow-md rounded-lg overflow-hidden mb-4 cursor-pointer hover:shadow-lg transition-shadow duration-300 md:h-auto h-[450px]"
        onClick={() => setOpenModal(true)}
      >
        {movieDetails.poster_path && (
          <div
            className="absolute inset-0 bg-cover bg-center md:hidden opacity-30"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/w500${movieDetails.poster_path})`,
            }}
          />
        )}
        <div className="relative flex flex-col justify-between md:flex-row p-4 md:p-6 h-full">
          {movieDetails.poster_path && (
            <div className="hidden md:block md:w-1/4 lg:w-1/5 flex-shrink-0 mx-auto mb-4">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                <Image
                  src={`https://image.tmdb.org/t/p/w200${movieDetails.poster_path}`}
                  alt={rating.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>

              <div className="text-xs text-cinema-gold mt-4 flex flex-col items-center space-y-2">
                {movieDetails.runtime && (
                  <p className="flex items-center space-x-2">
                    <FaClock />
                    <span>{movieDetails.runtime} min</span>
                  </p>
                )}

                {movieDetails.release_date && (
                  <p className="flex items-center space-x-2">
                    <FaCalendar />
                    <span>
                      {new Date(movieDetails.release_date).getFullYear()}
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="flex-grow flex flex-col justify-between md:ml-4">
            <div className="flex flex-col  justify-between items-start mb-4  md:pl-1">
              <h1 className="text-2xl font-bold text-cinema-gold md:mb-1">
                {rating.title}
              </h1>
              <p className="text-xs text-cinema-gold flex items-center whitespace-nowrap">
                <FaEdit className="mr-1" />
                Updated {moment(rating.updatedAt).fromNow()}
              </p>
            </div>
            <div className="space-y-3">
              <ProgressBar
                title="Scary"
                score={rating.scary}
                mobileView={true}
              />
              <ProgressBar
                title="Story"
                score={rating.story}
                mobileView={true}
              />
              <ProgressBar
                title="Acting"
                score={rating.acting}
                mobileView={true}
              />
            </div>
          </div>
        </div>
      </motion.div>

      <Modal modalOpen={openModal} setModalOpen={setOpenModal}>
        <div className="w-full max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-cinema-gold mb-6">
            Edit Rating
          </h2>
          <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-6">
            {movieDetails.poster_path && (
              <div className="w-full md:w-1/3 mb-6 md:mb-0 flex justify-center">
                <div className="relative aspect-[2/3] max-w-[160px] rounded-lg overflow-hidden w-48 md:w-full ">
                  <Image
                    src={`https://image.tmdb.org/t/p/w300${movieDetails.poster_path}`}
                    alt={rating.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            )}
            <form
              onSubmit={handleEditSubmit}
              className="flex-grow space-y-4 w-full md:w-2/3"
            >
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-cinema-gold"
                >
                  Movie Title
                </label>
                <Autocomplete
                  value={ratingToEdit.title}
                  handleChange={handleChange}
                  edit={true}
                  checkMovieValid={() => {}}
                />
              </div>
              {["scary", "story", "acting"].map((category) => (
                <div key={category}>
                  <label
                    htmlFor={category}
                    className="block text-sm font-medium text-cinema-gold"
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}{" "}
                    Rating: {ratingToEdit[category]}
                  </label>
                  <input
                    type="range"
                    id={category}
                    name={category}
                    min="0"
                    max="10"
                    step="0.5"
                    value={ratingToEdit[category]}
                    onChange={handleChange}
                    className="mt-1 block w-full slider"
                  />
                </div>
              ))}
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 bg-cinema-blue-light text-cinema-gold rounded-md hover:bg-cinema-blue transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cinema-gold text-cinema-blue rounded-md hover:bg-cinema-gold-dark transition-colors duration-300 disabled:bg-cinema-gold-darker disabled:cursor-not-allowed"
                  disabled={!isEdited}
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={handleDeleteRating}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Rating;
