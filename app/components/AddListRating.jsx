"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";
import axios from "axios";
import Autocomplete from "./Autocomplete";
import debounce from "lodash/debounce";
import moment from "moment";
import { useRouter } from "next/navigation";

const AddListRating = ({ listName, setRating, userId }) => {
  const [inputs, setInputs] = useState({
    title: "",
    scary: 0,
    story: 0,
    acting: 0,
    tmdbId: 0,
  });

  const [editing, setEditing] = useState({
    id: "",
    title: "",
    scary: 0,
    story: 0,
    acting: 0,
    createdAt: "",
    updatedAt: "",
    tmdbId: 0,
  });

  const [initialEditingState, setInitialEditingState] = useState({
    id: "",
    title: "",
    scary: 0,
    story: 0,
    acting: 0,
    createdAt: "",
    updatedAt: "",
    tmdbId: 0,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [movieValid, setMovieValid] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setInputs({
      title: "",
      scary: 0,
      story: 0,
      acting: 0,
      tmdbId: 0,
    });
    setEditing({
      id: "",
      title: "",
      scary: 0,
      story: 0,
      acting: 0,
      createdAt: "",
      updatedAt: "",
      tmdbId: 0,
    });
    setInitialEditingState({
      id: "",
      title: "",
      scary: 0,
      story: 0,
      acting: 0,
      createdAt: "",
      updatedAt: "",
      tmdbId: 0,
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
    }
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Cancel the previous debounce and start a new one
    if (name === "title") {
      setEditing({
        id: "",
        title: "",
        scary: 0,
        story: 0,
        acting: 0,
        createdAt: "",
        updatedAt: "",
        tmdbId: 0,
      });
      setInitialEditingState({
        id: "",
        title: "",
        scary: 0,
        story: 0,
        acting: 0,
        createdAt: "",
        updatedAt: "",
        tmdbId: 0,
      });
    }
  };

  // Create a debounced function to check movie validity
  const checkMovieValidDebounced = async (id) => {
    if (id) {
      try {
        const res = await axios.post("/api/movieValid", {
          id,
          listName,
          userId,
        });

        if (res.data.error) {
          setMovieValid(false);

          if (res.data.error === "Movie already exists") {
            if (!editing.id) {
              setMovieValid(true);
              delete res.data.error;
              setEditing(res.data);
              setInitialEditingState(res.data);
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
            tmdbId: 0,
          });
          setInitialEditingState({
            id: "",
            title: "",
            scary: 0,
            story: 0,
            acting: 0,
            createdAt: "",
            updatedAt: "",
            tmdbId: 0,
          });
        }
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const apiUrl = editing.id
      ? userId
        ? `/api/colab/${userId}/${listName}/${editing.id}`
        : `/api/ratings/${editing.id}`
      : userId
      ? `/api/colab/${userId}/${listName}`
      : `/api/lists/${listName}`;

    const axiosMethod = editing.id ? axios.patch : axios.post;

    axiosMethod(apiUrl, editing.id ? editing : inputs)
      .then((res) => {
        setRating(res.data, null);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setInputs({
          title: "",
          scary: 0,
          story: 0,
          acting: 0,
          tmdbId: 0,
        });
        setEditing({
          id: "",
          title: "",
          scary: 0,
          story: 0,
          acting: 0,
          createdAt: "",
          updatedAt: "",
          tmdbId: 0,
        });
        setInitialEditingState({
          id: "",
          title: "",
          scary: 0,
          story: 0,
          acting: 0,
          createdAt: "",
          updatedAt: "",
          tmdbId: 0,
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
              {editing.id ? "Updating" : "New"} Rating
            </h1>{" "}
            {editing.id && (
              <p className="text-sm text-gray-500">
                Updated {moment(editing.updatedAt).fromNow()}
              </p>
            )}{" "}
          </div>
          <Autocomplete
            value={editing.id ? editing.title : inputs.title}
            handleChange={handleChange}
            edit={false}
            checkMovieValid={checkMovieValidDebounced}
          />
          <label htmlFor="scary" className="block my-4 text-lg font-medium">
            Scary{" "}
            {(editing.id ? editing.scary : inputs.scary) !== undefined &&
              `(${editing.id ? editing.scary : inputs.scary})`}{" "}
          </label>
          <input
            id="scary"
            type="range"
            name="scary"
            min="0"
            max="10"
            step="0.5"
            className="slider"
            value={editing.id ? editing.scary : inputs.scary}
            onChange={handleChange}
          />

          <label htmlFor="story" className="block my-4 text-lg font-medium">
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
            className="slider"
            value={editing.id ? editing.story : inputs.story}
            onChange={handleChange}
          />

          <label htmlFor="acting" className="block my-4 text-lg font-medium">
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
            className="slider"
            value={editing.id ? editing.acting : inputs.acting}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="bg-blue-700 text-white px-5 py-2 mt-4 disabled:bg-blue-300"
            disabled={
              (!editing.id &&
                (inputs.story === undefined ||
                  inputs.scary === undefined ||
                  inputs.acting === undefined ||
                  inputs.title === undefined ||
                  inputs.tmdbId === 0 ||
                  !movieValid)) ||
              // if editing, disable submit button if no changes have been made
              (editing.id
                ? editing.scary === initialEditingState.scary &&
                  editing.story === initialEditingState.story &&
                  editing.acting === initialEditingState.acting
                : false)
            }
          >
            Submit
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AddListRating;
