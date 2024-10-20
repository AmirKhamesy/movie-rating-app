import React, { useState } from "react";
import {
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

const CopyToClipboardButton = ({ textToCopy }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  return (
    <button
      type="button"
      className="absolute inset-y-0 right-0 px-3 flex items-center"
      onClick={handleCopyClick}
    >
      {isCopied ? (
        <ClipboardDocumentCheckIcon
          className="h-5 w-5 text-green-500"
          aria-hidden="true"
        />
      ) : (
        <ClipboardDocumentIcon
          className="h-5 w-5 text-gray-400 hover:text-gray-500"
          aria-hidden="true"
        />
      )}
      <span className="sr-only">{isCopied ? "Copied" : "Copy"}</span>
    </button>
  );
};

export default CopyToClipboardButton;
