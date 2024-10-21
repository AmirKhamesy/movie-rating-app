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
      <h3 className="text-lg text-cinema-gold mb-4">Collaborators</h3>
      <ul className="bg-cinema-blue-light rounded-lg shadow-sm divide-y divide-gray-600">
        {collaborators.map((collaborator) => (
          <li
            key={collaborator.id}
            className="flex items-center justify-between py-4 px-6 
hover:bg-cinema-blue transition-colors duration-200 ease-in-out bg-gray-700 rounded-lg
            "
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-cinema-gold to-cinema-gold-dark rounded-full flex-shrink-0 flex items-center justify-center text-cinema-blue font-semibold text-lg">
                {collaborator.user.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white">
                  {collaborator.user.name}
                </p>
                <p className="text-xs text-gray-400">
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
