import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_KEY;

const fetchMovieSuggestions = async (query) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`
  );
  const data = await response.json();
  return data.results;
};

const Autocomplete = ({ value, handleChange }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const autocompleteRef = useRef(null); // Ref for autocomplete element

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isTyping) {
        const fetchSuggestions = async () => {
          if (inputValue) {
            const movies = await fetchMovieSuggestions(inputValue);
            setSuggestions(movies);
          } else {
            setSuggestions([]);
          }
        };
        fetchSuggestions();
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [inputValue, isTyping]);

  const handleBlur = () => {
    setInputValueInParent(inputValue);
    setIsTyping(false);
  };

  const handleFocus = () => {
    setIsTyping(true);
  };

  const setInputValueInParent = (title) => {
    handleChange({
      target: {
        name: "title",
        value: title,
      },
    });
  };

  const selectMovieSuggestion = (title) => {
    setInputValue(title);
    setInputValueInParent(title);
    setSuggestions([]);
  };

  // Handle click outside of autocomplete
  const handleClickOutside = (event) => {
    if (
      autocompleteRef.current &&
      !autocompleteRef.current.contains(event.target)
    ) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full relative" ref={autocompleteRef}>
      <input
        type="text"
        name="title"
        className="border rounded p-2 w-full"
        placeholder="Search for a movie..."
        value={inputValue || value}
        onChange={(e) => selectMovieSuggestion(e.target.value)}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      {suggestions?.length > 0 && (
        <ul className="absolute left-0 mt-2 w-full bg-white border rounded shadow max-h-64 overflow-y-scroll">
          {suggestions.map((movie) => (
            <li
              key={movie.id}
              className="flex items-center gap-2 p-1 hover:bg-blue-300 cursor-pointer"
              onClick={() => selectMovieSuggestion(movie.title)}
            >
              <Image
                src={`https://image.tmdb.org/t/p/w92/${movie.poster_path}`}
                alt={`${movie.title} Poster`}
                width="100"
                height="200"
                className="w-12"
              />
              <div className="flex flex-col  justify-between">
                <span className="font-semibold text-md">{movie.title}</span>
                <span className="text-xs text-gray-600">
                  {new Date(movie.release_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
