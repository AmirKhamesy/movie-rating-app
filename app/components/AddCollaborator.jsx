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

  const containerClasses = "flex items-center";

  const inputClasses = `flex-grow  border py-1 px-4 w-100% focus:outline-none focus:shadow-outline `;

  const buttonClasses = `ml-1 flex-shrink-0 bg-${
    addButtonDisabled ? "blue-300" : "blue-500"
  } text-white py-2 px-4 focus:outline-none focus:shadow-outline h-full`;

  return (
    <div className={containerClasses}>
      <div className="flex flex-row justify w-full">
        <input
          id="colab"
          name="colab"
          placeholder="user@email.com"
          className={inputClasses}
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
          className={buttonClasses}
          disabled={addButtonDisabled}
        >
          Add
        </button>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AddCollaborator;
