import React, { useState } from "react";
import copy from "clipboard-copy";

const CopyToClipboardButton = ({ textToCopy }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = async () => {
    try {
      await copy(textToCopy);
      setIsCopied(true);

      // Reset isCopied after 1.5 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const containerClasses = "flex items-center";

  const inputClasses = `flex-grow bg-${
    isCopied ? "green-100" : ""
  } border py-2 px-4 rounded-md focus:outline-none focus:shadow-outline ${
    isCopied ? "border-green-500 text-green-700 green-100" : ""
  } cursor-pointer`;

  const buttonClasses = `ml-1 flex-shrink-0 bg-${
    isCopied ? "green-500" : "blue-500"
  } text-white py-2 px-4 rounded-md focus:outline-none focus:shadow-outline h-full`;

  const CopyClipboardIcon = ({ isCopied }) =>
    isCopied ? (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 13l4 4L19 7"
        />
      </svg>
    ) : (
      <svg
        fill="currentColor"
        className="w-6 h-6"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 442 442"
        xmlSpace="preserve"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <g>
            <polygon points="291,0 51,0 51,332 121,332 121,80 291,80 "></polygon>
            <polygon points="306,125 306,195 376,195 "></polygon>
            <polygon points="276,225 276,110 151,110 151,442 391,442 391,225 "></polygon>
          </g>
        </g>
      </svg>
    );

  return (
    <div className={containerClasses}>
      <input
        type="text"
        value={isCopied ? "Copied" : textToCopy}
        readOnly
        className={inputClasses}
        onClick={() => {
          if (!isCopied) {
            handleCopyClick();
          }
        }}
      />
      <button onClick={handleCopyClick} type="button" className={buttonClasses}>
        <CopyClipboardIcon isCopied={isCopied} />
      </button>
    </div>
  );
};

export default CopyToClipboardButton;
