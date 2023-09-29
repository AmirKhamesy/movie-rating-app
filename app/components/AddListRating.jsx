"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";
import axios from "axios";
import Autocomplete from "./Autocomplete";
import debounce from "lodash/debounce";

const AddListRating = ({ listName }) => {
  const [inputs, setInputs] = useState({
    title: "",
    scary: 0,
    story: 0,
    acting: 0,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [movieValid, setMovieValid] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);

  useEffect(() => {
    setInputs({
      title: "",
      scary: 0,
      story: 0,
      acting: 0,
    });
  }, [modalOpen]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value =
      name === "title" ? e.target.value : parseFloat(e.target.value);

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Cancel the previous debounce and start a new one
    if (name === "title") {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      const newDebounceTimer = setTimeout(() => {
        checkMovieValidDebounced(value);
      }, 250);
      setDebounceTimer(newDebounceTimer);
    }
  };

  const checkMovieValidDebounced = debounce(async (title) => {
    if (title) {
      try {
        const res = await axios.post("/api/movieValid", { title, listName });
        if (res.data.error) {
          setMovieValid(false);
        } else {
          setMovieValid(true);
        }
      } catch (err) {
        if (
          err.response.data.error === "No title provided" ||
          err.response.data.error === "Movie not found in TMDB"
        ) {
          setMovieValid(false);
        }
      }
    }
  }, 250); // Wait for 250ms before executing

  const handleSubmit = (e) => {
    e.preventDefault();
    const apiUrl = `/api/lists/${listName}`;
    console.log(apiUrl);

    axios
      .post(apiUrl, inputs)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
      .finally(() => {
        setInputs({
          title: "",
          scary: 0,
          story: 0,
          acting: 0,
        });
        setModalOpen(false);
        window.location.reload();
      });
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
          <div className="flex justify-between items-center  mb-3">
            <h1 className="text-2xl">New Rating</h1>
          </div>
          <Autocomplete value={inputs.title} handleChange={handleChange} />
          <label htmlFor="scary" className="block my-2 text-lg font-medium">
            Scary {inputs.scary !== undefined && `(${inputs.scary})`}
          </label>
          <input
            id="scary"
            type="range"
            name="scary"
            min="0"
            max="10"
            step="0.5"
            className="Slider"
            value={inputs.scary}
            onChange={handleChange}
          />

          <label htmlFor="story" className="block my-2 text-lg font-medium">
            Story {inputs.story !== undefined && `(${inputs.story})`}
          </label>
          <input
            id="story"
            type="range"
            name="story"
            min="0"
            max="10"
            step="0.5"
            className="Slider"
            value={inputs.story}
            onChange={handleChange}
          />

          <label htmlFor="acting" className="block my-2 text-lg font-medium">
            Acting {inputs.acting !== undefined && `(${inputs.acting})`}{" "}
          </label>
          <input
            id="acting"
            type="range"
            name="acting"
            min="0"
            max="10"
            step="0.5"
            className="Slider"
            value={inputs.acting}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="bg-blue-700 text-white px-5 py-2 mt-2 disabled:bg-blue-300"
            disabled={inputs.title === "" || !movieValid}
          >
            Submit
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AddListRating;
