import React from "react";

function ProfileModal({ selectedItem, closeModal, onSendMessageFromModal }) {
  return (
    <>
      {selectedItem && (
        <div className="d-flex flex-column custom-modal-content">
          <div className="d-flex justify-content-between align-items-center">
            <p>User Profile</p>
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
          <p>Bio: {selectedItem.bio}</p>
          <button
            onClick={() => {
              onSendMessageFromModal(selectedItem);
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
