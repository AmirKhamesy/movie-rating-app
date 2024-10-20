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
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Collaborators
      </h3>
      <ul className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
        {collaborators.map((collaborator) => (
          <li
            key={collaborator.id}
            className="flex items-center justify-between py-4 px-6 hover:bg-gray-50 transition-colors duration-150 ease-in-out"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex-shrink-0 flex items-center justify-center text-white font-semibold text-lg">
                {collaborator.user.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  {collaborator.user.name}
                </p>
                <p className="text-xs text-gray-500">
                  {collaborator.user.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleRemoveCollaborator(collaborator.id)}
              className="text-gray-400 hover:text-red-500 transition-colors duration-150 ease-in-out focus:outline-none"
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollaboratorsList;
