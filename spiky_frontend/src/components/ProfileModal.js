import React from "react";

function ProfileModal({ selectedItem, closeModal, onSelectFromSearch }) {
  return (
    <>
      {selectedItem && (
        <div className="d-flex flex-column custom-modal-content">
          <div className="d-flex flex-row-reverse">
            <button className="btn btn-secondary btn-sm" onClick={closeModal}>
              X
            </button>
          </div>
          <img
            src={selectedItem.image}
            className="rounded-circle me-2"
            alt={selectedItem.full_name}
            style={{ width: "35px", height: "35px" }}
          />
          <p>{selectedItem.full_name}</p>
          <p>{selectedItem.bio}</p>
          <button
            onClick={() => {
              onSelectFromSearch(selectedItem);
              closeModal();
            }}
            className="btn btn-outline-dark"
          >
            Send Message
          </button>
        </div>
      )}
    </>
  );
}
export default ProfileModal;
