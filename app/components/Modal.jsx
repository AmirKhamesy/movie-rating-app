import React, { useEffect, useRef } from "react";

const Modal = ({ children, modalOpen, setModalOpen }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleCloseModal = (event) => {
      if (event.key === "Escape") {
        setModalOpen(false);
      }
    };

    // const handleClickOutsideModal = (event) => {  //TODO: Click on suggestions registers as clicking outsid
    //   if (
    //     modalRef.current &&
    //     !modalRef.current.contains(event.target) &&
    //     !event.target.closest(".modal-content")
    //   ) {
    //     setModalOpen(false);
    //   }
    // };

    if (modalOpen) {
      document.addEventListener("keydown", handleCloseModal);
      // document.addEventListener("click", handleClickOutsideModal);
    }

    return () => {
      document.removeEventListener("keydown", handleCloseModal);
      // document.removeEventListener("click", handleClickOutsideModal);
    };
  }, [modalOpen, setModalOpen]);

  return (
    <>
      {modalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-10">
          <div ref={modalRef} className="w-1/2 bg-slate-300 p-5 modal-content">
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
