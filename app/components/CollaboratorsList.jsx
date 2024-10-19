import React from "react";
import axios from "axios";

const CollaboratorsList = ({ collaborators, setCollaborators, setLoading }) => {
  const handleRemoveCollaborator = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${process.env.NEXT_PUBLIC_API}/api/colab/${id}`);
      setCollaborators(collaborators.filter((colab) => colab.id !== id));
      setLoading(false);
    } catch (error) {
      console.error("Error removing collaborator:", error);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Collaborators</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {collaborators.map((collaborator) => (
          <div
            key={collaborator.id}
            className="bg-white shadow-md rounded-lg p-3 flex items-center justify-between transition-all hover:shadow-lg"
          >
            <div className="flex items-center min-w-0 flex-grow">
              <div className="w-10 h-10 bg-indigo-500 rounded-full flex-shrink-0 flex items-center justify-center text-white font-semibold text-lg mr-3">
                {collaborator.user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-grow">
                <p className="font-semibold text-sm sm:text-base truncate">
                  {collaborator.user.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 truncate">
                  {collaborator.user.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleRemoveCollaborator(collaborator.id)}
              className="text-red-500 hover:text-red-700 transition-colors focus:outline-none flex-shrink-0 ml-2"
              aria-label="Remove collaborator"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollaboratorsList;
