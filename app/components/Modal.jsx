import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const Modal = ({ children, modalOpen, setModalOpen }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const closeOnEscapeKey = (e) =>
      e.key === "Escape" ? setModalOpen(false) : null;
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [setModalOpen]);

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [modalOpen]);

  if (!modalOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div
        className="fixed inset-0 transition-opacity bg-cinema-blue bg-opacity-75"
        aria-hidden="true"
        onClick={() => setModalOpen(false)}
      ></div>
      <div
        className="relative w-full max-w-lg mx-auto my-8 overflow-hidden transition-all transform bg-cinema-blue-light rounded-lg shadow-xl sm:w-full"
        ref={modalRef}
      >
        <div className="absolute top-0 right-0 pt-4 pr-4">
          <button
            onClick={() => setModalOpen(false)}
            className="text-cinema-gold hover:text-cinema-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cinema-gold"
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 text-white">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
