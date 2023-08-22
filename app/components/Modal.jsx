import React, { useEffect } from "react";

const Modal = ({ children, modalOpen, setModalOpen }) => {
  useEffect(() => {
    const handleCloseModal = (event) => {
      if (event.key === "Escape") {
        setModalOpen(false);
      }
    };

    const handleClickOutsideModal = (event) => {
      if (!event.target.closest(".modal-content")) {
        setModalOpen(false);
      }
    };

    if (modalOpen) {
      document.addEventListener("keydown", handleCloseModal);
      document.addEventListener("click", handleClickOutsideModal);
    }

    return () => {
      document.removeEventListener("keydown", handleCloseModal);
      document.removeEventListener("click", handleClickOutsideModal);
    };
  }, [modalOpen, setModalOpen]);

  return (
    <>
      {modalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50">
          <div className="w-1/2 bg-slate-300 p-5 modal-content">
            <button
              onClick={() => setModalOpen(false)}
              className="text-2xl mb-3"
            >
              &times; {/* Close Icon */}
            </button>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
