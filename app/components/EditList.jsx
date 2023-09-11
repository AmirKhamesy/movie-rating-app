import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import axios from "axios";

const EditList = ({ listName }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);

  useEffect(() => {
    setModalDeleteOpen(false);
  }, [modalOpen]);

  const handleDeleteListing = () => {
    axios
      .delete(`/api/lists/${listName}`)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
      .finally(() => {
        setModalDeleteOpen(false);
        setModalOpen(false);
        window.location.href = "/rate";
      });
  };

  return (
    <div>
      <button
        className="bg-blue-500 text-white p-3 cursor-pointer"
        onClick={() => setModalOpen(true)}
      >
        Edit
      </button>

      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <div className="flex justify-between items-center  mb-3">
          <h1 className="text-2xl">Editing List</h1>
          <button
            className="bg-red-500 text-white p-3 cursor-pointer"
            onClick={() => setModalDeleteOpen(true)}
          >
            Delete
          </button>
          <Modal modalOpen={modalDeleteOpen} setModalOpen={setModalDeleteOpen}>
            <div className="flex justify-between items-center  mb-3">
              <h1 className="text-2xl">
                Are you sure you want to delete{" "}
                <span className="font-bold">"{listName}"</span> ?
                <br />
                <span className="text-sm">
                  This action will also delete ratings from this list and you
                  wont be able to undo it.
                </span>
              </h1>
            </div>
            <div>
              <button
                onClick={() => handleDeleteListing()}
                className="text-red-700 font-bold mr-5"
              >
                YES
              </button>
              <button
                onClick={() => setModalDeleteOpen(false)}
                className="text-blue-700 font-bold mr-5"
              >
                NO
              </button>
            </div>
          </Modal>
        </div>
      </Modal>
    </div>
  );
};

export default EditList;
