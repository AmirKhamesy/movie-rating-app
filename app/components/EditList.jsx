import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import axios from "axios";
import CopyToClipboardButton from "./CopyToClipboard";
import AddCollaborator from "./AddCollaborator";

const EditList = ({ listName, publicHash, listPublic, listId, setList }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [listTitle, setListTitle] = useState(listName);

  useEffect(() => {
    setModalDeleteOpen(false);
    setListTitle(listName);
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

  const handlePublicToggle = () => {
    axios
      .put("/api/toggleListPublic", { listId })
      .then((res) => {
        setList(res.data.updatedList);
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const apiUrl = `/api/lists/${listName}`;
    const body = {
      newName: listTitle,
    };
    axios
      .patch(apiUrl, body)
      .then((res) => (window.location.href = encodeURI(res.data.name))) //TODO: remove old list name from browser history, so is user presses back they dont end up at the old list that no longer exists
      .catch((err) => console.log(err))
      .finally(() => {
        setListTitle(listName);
        setModalOpen(false);
      });
  };

  const publicListURL = `${process.env.NEXT_PUBLIC_API}/public-list/${publicHash}`;

  return (
    <div>
      <button
        className="bg-blue-500 text-white p-3 cursor-pointer"
        onClick={() => setModalOpen(true)}
      >
        Edit
      </button>

      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center mb-1">
            <h1 className="text-2xl font-semibold">Editing List</h1>
            <div className="flex flex-row gap-1">
              <button
                className="bg-purple-500 text-white p-3 cursor-pointer"
                onClick={() => handlePublicToggle()}
              >
                Make list {listPublic ? "Private" : "Public"}
              </button>
              <button
                className="bg-red-500 text-white p-3 cursor-pointer"
                onClick={() => setModalDeleteOpen(true)}
              >
                Delete
              </button>
            </div>
          </div>

          {listPublic && publicHash && (
            <>
              <label
                htmlFor="title"
                className="block my-2 text-lg font-medium "
              >
                Public List URL
              </label>
              <CopyToClipboardButton textToCopy={publicListURL} />
            </>
          )}
          <label htmlFor="colab" className="block my-2 text-lg font-medium ">
            Add Collaborator
          </label>
          <AddCollaborator listId={listId} />
          <form className="w-full" onSubmit={handleSubmit}>
            <label htmlFor="title" className="block my-2 text-lg font-medium ">
              Title
            </label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="Movie list title"
              className="w-full"
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              autoFocus
            />

            <button
              type="submit"
              className="bg-blue-700 text-white px-5 py-2 mt-2 disabled:bg-blue-300"
              disabled={listTitle === "" || listName === listTitle}
            >
              Submit
            </button>
          </form>
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
