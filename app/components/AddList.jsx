"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";
import axios from "axios";
import { useRouter } from "next/navigation";

const AddList = () => {
  const [title, setTitle] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setTitle("");
  }, [modalOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/lists", { title })
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
      .finally(() => {
        setTitle("");
        setModalOpen(false);
        router.refresh();
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && title !== "") {
      handleSubmit(e);
    }
  };

  return (
    <div>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-green-700 text-white p-3 cursor-pointer"
      >
        + New List
      </button>
      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl">New List</h1>

            <input
              type="text"
              name="title"
              className="border rounded p-2 w-full"
              placeholder="List name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={handleKeyPress}
            />

            <button
              type="submit"
              className="bg-blue-700 text-white px-5 py-2 mt-2 disabled:bg-blue-300"
              disabled={title === ""}
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddList;
