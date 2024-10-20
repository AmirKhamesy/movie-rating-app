import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCollaborator = ({ listId, setCollaborators, setLoading }) => {
  const [colabEmail, setColabEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const addButtonDisabled = colabEmail === "" || !isValidEmail;

  const handleAddClick = async () => {
    if (isValidEmail) {
      setLoading(true);

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/api/colab`,
          {
            email: colabEmail,
            listId: listId,
          }
        );

        setCollaborators((prev) => [...prev, response.data]);
        setColabEmail("");
        setLoading(false);
        toast.success("Collaborator added successfully");
      } catch (error) {
        setLoading(false);
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data.error;

          if (status === 400 && message === "Collaboration already exists.") {
            toast.warning("Collaborator already part of the list");
          } else if (
            status === 404 &&
            message === "No user found with that email."
          ) {
            toast.warning("No user found with that email");
          } else if (
            status === 400 &&
            message ===
              "Cannot add yourself as a collaborator, please try again."
          ) {
            toast.warning(
              "Cannot add yourself as a collaborator, please try again."
            );
          } else {
            toast.error(
              "An unexpected error occurred. Please try again later."
            );
          }
        } else {
          toast.error("An unexpected error occurred. Please try again later.");
        }
      }
    }
  };

  const validateEmail = (email) => {
    setIsValidEmail(emailRegex.test(email));
  };

  return (
    <div className="mb-4">
      <label
        htmlFor="colab"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Add Collaborator
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <input
          id="colab"
          name="colab"
          type="email"
          placeholder="user@email.com"
          className="flex-grow focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-none rounded-l-md sm:text-sm border-gray-300"
          value={colabEmail}
          onChange={(e) => {
            setColabEmail(e.target.value);
            validateEmail(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !addButtonDisabled) {
              handleAddClick();
            }
          }}
        />
        <button
          onClick={handleAddClick}
          type="button"
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white ${
            addButtonDisabled
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          disabled={addButtonDisabled}
        >
          Add
        </button>
      </div>
      {!isValidEmail && colabEmail !== "" && (
        <p className="mt-1 text-sm text-red-600">
          Please enter a valid email address.
        </p>
      )}
      <ToastContainer />
    </div>
  );
};

export default AddCollaborator;
