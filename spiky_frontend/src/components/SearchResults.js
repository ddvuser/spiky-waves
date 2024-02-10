import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import ProfileModal from "../components/ProfileModal";

function SearchResults({ searchResults, onSendMessageFromModal }) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [modalWidth, setModalWidth] = useState(
    window.innerWidth <= 768 ? "80%" : "30%"
  );

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: modalWidth,
      maxHeight: "80%",
      overflow: "auto",
    },
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setModalWidth(window.innerWidth <= 768 ? "80%" : "30%");
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ul className="list-group mt-2">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Item Modal"
      >
        <ProfileModal
          selectedItem={selectedItem}
          closeModal={closeModal}
          onSendMessageFromModal={onSendMessageFromModal}
        />
      </Modal>
      {searchResults.map((result) => (
        <li
          key={result.id}
          className="list-group-item"
          onClick={() => openModal(result)}
          style={{ cursor: "pointer" }}
        >
          <div className="d-flex align-items-center">
            <img
              src={result.image}
              className="rounded-circle me-2"
              alt={result.full_name}
              style={{ width: "35px", height: "35px" }}
            />
            <p className="mb-1">{result.full_name}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default SearchResults;
