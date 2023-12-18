"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import ProgressBar from "./ProgressBar";

const PublicRating = ({ rating }) => {
  const [movieDetails, setMovieDetails] = useState({});

  const fetchMovieDetails = async (title) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie`,
        {
          params: {
            api_key: process.env.NEXT_PUBLIC_TMDB_KEY,
            query: title,
          },
        }
      );

      if (response.data.results && response.data.results.length > 0) {
        const movie = response.data.results[0];
        setMovieDetails(movie);
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  useEffect(() => {
    fetchMovieDetails(rating.title);
  }, [rating]);

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
    </li>
  );
};

export default PublicRating;
