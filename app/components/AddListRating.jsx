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
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        + New Rating
      </button>
      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {editing.id ? "Update" : "New"} Rating
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Movie Title
              </label>
              <Autocomplete
                value={editing.id ? editing.title : inputs.title}
                handleChange={handleChange}
                edit={false}
                checkMovieValid={checkMovieValidDebounced}
              />
            </div>

            {["scary", "story", "acting"].map((category) => (
              <div key={category}>
                <label
                  htmlFor={category}
                  className="block text-sm font-medium text-gray-700"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)} Rating:{" "}
                  {editing.id ? editing[category] : inputs[category]}
                </label>
                <input
                  type="range"
                  id={category}
                  name={category}
                  min="0"
                  max="10"
                  step="0.5"
                  value={editing.id ? editing[category] : inputs[category]}
                  onChange={handleChange}
                  className="mt-1 block w-full"
                />
              </div>
            ))}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={
                  (!editing.id &&
                    (inputs.story === undefined ||
                      inputs.scary === undefined ||
                      inputs.acting === undefined ||
                      inputs.title === undefined ||
                      inputs.tmdbId === 0 ||
                      !movieValid)) ||
                  (editing.id
                    ? editing.scary === initialEditingState.scary &&
                      editing.story === initialEditingState.story &&
                      editing.acting === initialEditingState.acting
                    : false)
                }
              >
                {editing.id ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default AddListRating;
