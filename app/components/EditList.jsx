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

  const handleOpenPublicList = () => {
    window.open(publicListURL, "_blank");
  };

  return (
    <div>
      <button
        className="bg-cinema-gold text-cinema-blue px-4 py-2 rounded-md hover:bg-cinema-gold-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cinema-gold"
        onClick={() => setModalOpen(true)}
      >
        Edit List
      </button>

      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <div className="w-full max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Edit List</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">
                Public List
              </span>
              <button
                onClick={handlePublicToggle}
                className={`${
                  listPublic ? "bg-cinema-gold" : "bg-gray-600"
                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cinema-gold`}
              >
                <span
                  className={`${
                    listPublic ? "translate-x-5" : "translate-x-0"
                  } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                />
              </button>
            </div>

            {listPublic && (
              <div>
                <label
                  htmlFor="publicUrl"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Public List URL
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <div className="relative flex items-stretch flex-grow focus-within:z-10">
                    <input
                      type="text"
                      name="publicUrl"
                      id="publicUrl"
                      className="block w-full rounded-none rounded-l-md border-gray-600 bg-cinema-blue-light text-white pl-3 pr-12 focus:border-cinema-gold focus:ring-cinema-gold sm:text-sm"
                      value={publicListURL}
                      readOnly
                    />
                    <CopyToClipboardButton textToCopy={publicListURL} />
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenPublicList}
                    className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-600 bg-cinema-blue px-4 py-2 text-sm font-medium text-white hover:bg-cinema-blue-light focus:border-cinema-gold focus:outline-none focus:ring-1 focus:ring-cinema-gold"
                  >
                    Open
                  </button>
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-white"
              >
                List Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="mt-1 focus:ring-cinema-gold focus:border-cinema-gold block w-full shadow-sm sm:text-sm border-gray-600 rounded-md bg-cinema-blue-light text-white"
                value={listTitle}
                onChange={(e) => setListTitle(e.target.value)}
              />
            </div>

            <div>
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

            <div className="flex justify-between pt-4 border-t border-gray-700">
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
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-cinema-blue bg-cinema-gold hover:bg-cinema-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cinema-gold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal modalOpen={modalDeleteOpen} setModalOpen={setModalDeleteOpen}>
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Delete List</h2>
          <p className="text-sm text-gray-300 mb-4">
            Are you sure you want to delete "{listName}"? This action cannot be
            undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setModalDeleteOpen(false)}
              className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-white hover:bg-cinema-blue-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cinema-gold"
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
