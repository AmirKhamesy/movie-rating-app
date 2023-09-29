"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";
import axios from "axios";
import { useRouter } from "next/navigation";
import Autocomplete from "./Autocomplete";
import debounce from "lodash/debounce";
import moment from "moment";

const AddRating = ({ listName }) => {
  const [inputs, setInputs] = useState({
    title: "",
    scary: 0,
    story: 0,
    acting: 0,
  });
  const [editing, setEditing] = useState({
    id: "",
    title: "",
    scary: 0,
    story: 0,
    acting: 0,
    createdAt: "",
    updatedAt: "",
  });
  const [movieValid, setMovieValid] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);

  const router = useRouter();

  useEffect(() => {
    setInputs({
      title: "",
      scary: 0,
      story: 0,
      acting: 0,
    });
    setEditing({
      id: "",
      title: "",
      scary: 0,
      story: 0,
      acting: 0,
      createdAt: "",
      updatedAt: "",
    });
  }, [modalOpen]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value =
      name === "title" ? e.target.value : parseFloat(e.target.value);

    if (editing.id) {
      setEditing((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setInputs((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }

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

  // Create a debounced function to check movie validity
  const checkMovieValidDebounced = debounce(async (title) => {
    if (title) {
      try {
        const res = await axios.post("/api/movieValid", { title, listName });
        if (res.data.error) {
          setMovieValid(false);
          if (!editing.id) {
            setEditing({
              id: "",
              title: "",
              scary: 0,
              story: 0,
              acting: 0,
              createdAt: "",
              updatedAt: "",
            });
          }
          if (res.data.error === "Movie already exists") {
            if (!editing.id) {
              // Handle editing existing movie
              delete res.data.error;
              setEditing(res.data);
            }
          }
        } else {
          setMovieValid(true);
        }
      } catch (err) {
        if (
          err.response.data.error === "No title provided" ||
          err.response.data.error === "Movie not found in TMDB"
        ) {
          setMovieValid(false);
          setEditing({
            id: "",
            title: "",
            scary: 0,
            story: 0,
            acting: 0,
            createdAt: "",
            updatedAt: "",
          });
        }
      }
    }
  }, 250); // Wait for 250ms before executing

  const handleSubmit = (e) => {
    e.preventDefault();
    const apiUrl = editing.id ? `/api/ratings/${editing.id}` : "/api/ratings";

    const axiosMethod = editing.id ? axios.patch : axios.post;

    axiosMethod(apiUrl, editing.id ? editing : inputs)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
      .finally(() => {
        setInputs({
          title: "",
          scary: 0,
          story: 0,
          acting: 0,
        });
        setEditing({
          id: "",
          title: "",
          scary: 0,
          story: 0,
          acting: 0,
          createdAt: "",
          updatedAt: "",
        });
        setModalOpen(false);
        router.refresh();
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
            <h1 className="text-2xl">
              {editing.id ? "Editing" : "New"} Rating
            </h1>
            {editing.id && (
              <p className="text-sm text-gray-500">
                Updated {moment(editing.updatedAt).fromNow()}
              </p>
            )}{" "}
          </div>
          <Autocomplete
            value={editing.id ? editing.title : inputs.title}
            handleChange={handleChange}
          />
          <label htmlFor="scary" className="block my-2 text-lg font-medium">
            Scary{" "}
            {(editing.id ? editing.scary : inputs.scary) !== undefined &&
              `(${editing.id ? editing.scary : inputs.scary})`}
          </label>
          <input
            id="scary"
            type="range"
            name="scary"
            min="0"
            max="10"
            step="0.5"
            className="Slider"
            value={editing.id ? editing.scary : inputs.scary}
            onChange={handleChange}
          />

          <label htmlFor="story" className="block my-2 text-lg font-medium">
            Story{" "}
            {(editing.id ? editing.story : inputs.story) !== undefined &&
              `(${editing.id ? editing.story : inputs.story})`}
          </label>
          <input
            id="story"
            type="range"
            name="story"
            min="0"
            max="10"
            step="0.5"
            className="Slider"
            value={editing.id ? editing.story : inputs.story}
            onChange={handleChange}
          />

          <label htmlFor="acting" className="block my-2 text-lg font-medium">
            Acting{" "}
            {(editing.id ? editing.acting : inputs.acting) !== undefined &&
              `(${editing.id ? editing.acting : inputs.acting})`}{" "}
          </label>
          <input
            id="acting"
            type="range"
            name="acting"
            min="0"
            max="10"
            step="0.5"
            className="Slider"
            value={editing.id ? editing.acting : inputs.acting}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="bg-blue-700 text-white px-5 py-2 mt-2 disabled:bg-blue-300"
            disabled={
              !editing.id &&
              (inputs.story === undefined ||
                inputs.scary === undefined ||
                inputs.acting === undefined ||
                inputs.title === undefined ||
                !movieValid)
            }
          >
            Submit
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AddRating;
