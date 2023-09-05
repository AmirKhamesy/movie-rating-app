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
  const [selectedMoviePoster, setSelectedMoviePoster] = useState("");
  const [highlightedSuggestionIndex, setHighlightedSuggestionIndex] =
    useState(-1);
  const autocompleteRef = useRef(null); // Ref for autocomplete element
  const suggestionListRef = useRef(null); // Ref for suggestion list element

  useEffect(() => {
    if (value) {
      const getMoviePoster = async () => {
        const movie_details = await fetchMovieSuggestions(value);
        setSelectedMoviePoster(movie_details[0].poster_path);
      };
      getMoviePoster();
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isTyping) {
        const fetchSuggestions = async () => {
          if (inputValue) {
            const movies = await fetchMovieSuggestions(inputValue);
            //If user has clicked on a title, dont suggest that same title to them
            if (!(movies.length === 1 && value === movies[0].title))
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

  const selectMovieSuggestion = (title, poster = "") => {
    setInputValue(title);
    setInputValueInParent(title);
    setSuggestions([]);
    setSelectedMoviePoster(poster);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab" || e.key === "ArrowDown") {
      e.preventDefault();
      if (highlightedSuggestionIndex < suggestions.length - 1) {
        setHighlightedSuggestionIndex(highlightedSuggestionIndex + 1);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (highlightedSuggestionIndex > 0) {
        setHighlightedSuggestionIndex(highlightedSuggestionIndex - 1);
      }
    } else if (e.key === "Enter" && highlightedSuggestionIndex >= 0) {
      e.preventDefault();
      const selectedSuggestion = suggestions[highlightedSuggestionIndex];
      selectMovieSuggestion(
        selectedSuggestion.title,
        selectedSuggestion.poster_path
      );
    }
    // Scroll to the selected suggestion
    if (suggestionListRef.current && highlightedSuggestionIndex >= 0) {
      const listItem =
        suggestionListRef.current.children[highlightedSuggestionIndex];
      listItem.scrollIntoView({ behavior: "smooth", block: "center" });
    }
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
      <div className="flex justify-between gap-2">
        {selectedMoviePoster && (
          <Image
            src={`https://image.tmdb.org/t/p/w92/${selectedMoviePoster}`}
            alt={`${selectedMoviePoster} Poster`}
            width="100"
            height="200"
            className="w-12"
          />
        )}
        <input
          type="text"
          name="title"
          className="border rounded p-2 w-full"
          placeholder="Search for a movie..."
          value={inputValue || value}
          onChange={(e) => selectMovieSuggestion(e.target.value)}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
        />
      </div>
      {suggestions?.length > 0 && (
        <ul
          className="absolute left-0 mt-2 w-full bg-white border rounded shadow max-h-64 overflow-y-scroll"
          ref={suggestionListRef}
        >
          {suggestions.map((movie, index) => (
            <li
              key={movie.id}
              className={`flex items-center gap-2 p-1 hover:bg-blue-300 cursor-pointer ${
                index === highlightedSuggestionIndex ? "bg-blue-300" : ""
              }`}
              onMouseEnter={() => setHighlightedSuggestionIndex(index)}
              onClick={() =>
                selectMovieSuggestion(movie.title, movie.poster_path)
              }
            >
              <Image
                src={`https://image.tmdb.org/t/p/w92/${movie.poster_path}`}
                alt={`${movie.title} Poster`}
                width="100"
                height="200"
                className="w-12"
              />
              <div className="flex flex-col justify-between">
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
