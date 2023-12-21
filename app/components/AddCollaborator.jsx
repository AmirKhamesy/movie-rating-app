import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AddCollaborator = ({ listId }) => {
  const [colabEmail, setColabEmail] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleAddClick = async () => {
    if (isValidEmail) {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/api/colab`,
          {
            email: colabEmail,
            listId: listId,
          }
        );

        console.log(response);

        setIsAdded(true);
        toast.success("Collaborator added successfully!");

        setTimeout(() => {
          setIsAdded(false);
        }, 1500);
      } catch (error) {
        if (error.response) {
          //TODO: better error handling
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

  const inputClasses = `flex-grow bg-${
    isAdded ? "green-100" : ""
  } border py-1 px-4 w-100% focus:outline-none focus:shadow-outline ${
    isAdded ? "border-green-500 text-green-700 green-100" : ""
  }`;

  const buttonClasses = `ml-1 flex-shrink-0 bg-${
    isAdded || !isValidEmail ? "blue-300" : isAdded ? "green-600" : "blue-500"
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
            if (e.key === "Enter") {
              handleAddClick();
            }
          }}
          readOnly={isAdded}
        />
        <button
          onClick={handleAddClick}
          type="button"
          className={buttonClasses}
          disabled={isAdded || !isValidEmail}
        >
          {isAdded ? "Added" : "Add"}
        </button>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AddCollaborator;
