"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import ProgressBar from "./ProgressBar";
import moment from "moment";
import { motion } from "framer-motion";

const PublicRating = ({ rating }) => {
  const [movieDetails, setMovieDetails] = useState({});

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative bg-white shadow-md rounded-lg overflow-hidden mb-4 md:h-auto h-[450px]"
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
          <div className="hidden md:block md:w-1/4 lg:w-1/5 flex-shrink-0 mr-6">
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
          </div>
        )}
        <div className="flex-grow flex flex-col justify-between">
          <div className="flex flex-col md:flex-row justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">
              {rating.title}
            </h1>
            <p className="text-xs text-gray-500">
              Updated {moment(rating.updatedAt).fromNow()}
            </p>
          </div>
          <div className="space-y-3">
            <ProgressBar title="Scary" score={rating.scary} mobileView={true} />
            <ProgressBar title="Story" score={rating.story} mobileView={true} />
            <ProgressBar
              title="Acting"
              score={rating.acting}
              mobileView={true}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PublicRating;
