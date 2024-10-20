import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import axios from "axios";
import CopyToClipboardButton from "./CopyToClipboard";
import AddCollaborator from "./AddCollaborator";
import CollaboratorsList from "./CollaboratorsList";

const EditList = ({
  listName,
  publicHash,
  listPublic,
  listId,
  setList,
  collaborators,
  setCollaborators,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [listTitle, setListTitle] = useState(listName);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setModalDeleteOpen(false);
    setListTitle(listName);
  }, [modalOpen]);

  const handleDeleteListing = () => {
    setModalDeleteOpen(false);
    setLoading(true);
    axios
      .delete(`/api/lists/${listName}`)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
        setModalOpen(false);
        window.location.href = "/rate";
      });
  };

  const handlePublicToggle = () => {
    setLoading(true);
    axios
      .put("/api/toggleListPublic", { listId })
      .then((res) => {
        setList(res.data.updatedList);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
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
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => setModalOpen(true)}
      >
        Edit List
      </button>

      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <div className="w-full max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit List</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Public List
              </span>
              <button
                onClick={handlePublicToggle}
                className={`${
                  listPublic ? "bg-indigo-600" : "bg-gray-200"
                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                <span
                  className={`${
                    listPublic ? "translate-x-5" : "translate-x-0"
                  } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                />
              </button>
            </div>

            {listPublic && (
              <>
                <div>
                  <label
                    htmlFor="publicUrl"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Public List URL
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="publicUrl"
                      id="publicUrl"
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                      value={publicListURL}
                      readOnly
                    />
                    <CopyToClipboardButton textToCopy={publicListURL} />
                  </div>
                </div>
              </>
            )}

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                List Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={listTitle}
                onChange={(e) => setListTitle(e.target.value)}
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Collaborators
              </h3>
              <AddCollaborator
                listId={listId}
                setCollaborators={setCollaborators}
                setLoading={setLoading}
              />
              <CollaboratorsList
                collaborators={collaborators}
                setCollaborators={setCollaborators}
                setLoading={setLoading}
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setModalDeleteOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete List
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal modalOpen={modalDeleteOpen} setModalOpen={setModalDeleteOpen}>
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Delete List</h2>
          <p className="text-sm text-gray-500 mb-4">
            Are you sure you want to delete "{listName}"? This action cannot be
            undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setModalDeleteOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteListing}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditList;
