"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FaStar, FaInfoCircle, FaTimes, FaCalendar } from "react-icons/fa";

const MovieCard = React.memo(({ movie, onClick }) => (
  <motion.div
    layout
    className="relative aspect-[2/3] shadow-lg cursor-pointer overflow-hidden"
    onClick={() => onClick(movie)}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Image
      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
      alt={movie.title}
      fill
      style={{ objectFit: "cover" }}
      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
    />
  </motion.div>
));

const MovieModal = ({ movie, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
    onClick={onClose}
  >
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg shadow-lg "
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="absolute inset-0 bg-cover bg-center rounded-lg"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`,
          filter: "blur(5px) brightness(0.3)",
        }}
      ></div>

      <div className="relative p-6 text-white">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-gray-300 focus:outline-none"
          aria-label="Close"
        >
          <FaTimes size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4">{movie.title}</h2>

        <div className="flex items-center mb-4">
          <FaStar className="text-yellow-400 mr-2" />
          <span className="font-semibold">
            {movie.vote_average.toFixed(1)}/10
          </span>
        </div>

        <div className="flex items-center mb-4">
          <FaCalendar className="mr-2" />
          <span>{movie.release_date}</span>
        </div>

        {movie.genres && (
          <div className="mb-4">
            <p className="font-semibold mb-2">Genres:</p>
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre, index) => (
                <span
                  key={index}
                  className="bg-indigo-600 px-2 py-1 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="text-sm mb-4">{movie.overview}</p>

        <a
          href={`https://www.themoviedb.org/movie/${movie.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200"
        >
          View on TMDB
        </a>
      </div>
    </motion.div>
  </motion.div>
);

const WatchPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [baseMovie, setBaseMovie] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notEnoughRatings, setNotEnoughRatings] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const fetchRecommendations = useCallback(async () => {
    try {
      const response = await fetch("/api/watch");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.notEnoughRatings) {
        setNotEnoughRatings(true);
      } else {
        setRecommendations(data.recommendations);
        setBaseMovie(data.baseMovie);
      }
    } catch (e) {
      console.error("Failed to fetch recommendations:", e);
      setError("Failed to load recommendations. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const handleMovieClick = useCallback((movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 text-center text-gray-800"
        >
          Movie Recommendations
        </motion.h1>

        {isLoading ? (
          <div
            className="flex flex-col items-center justify-center h-64"
            aria-live="polite"
          >
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-lg text-gray-600">
              Loading recommendations...
            </p>
          </div>
        ) : notEnoughRatings ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-lg text-gray-600"
          >
            <p>
              Please rate at least 10 movies before we can provide personalized
              recommendations.
            </p>
          </motion.div>
        ) : (
          <>
            {baseMovie && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8 text-center"
              >
                <p className="text-xl text-gray-700">
                  Based on your enjoyment of <strong>{baseMovie.title}</strong>,
                  we recommend:
                </p>
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
              <AnimatePresence>
                {recommendations.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={handleMovieClick}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <button
            onClick={fetchRecommendations}
            className="bg-indigo-600 text-white font-semibold py-2 px-4 border border-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
          >
            Get New Recommendations
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-8 text-center text-sm text-gray-600"
        >
          <FaInfoCircle className="inline mr-1" aria-hidden="true" />
          <span>
            Recommendations are personalized based on your viewing history and
            ratings.
          </span>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedMovie && (
          <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default WatchPage;
