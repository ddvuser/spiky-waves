import React, { useState, useEffect, useContext, useRef } from "react";
import AuthContext from "../context/AuthContext";
import MessageDetail from "../components/MessageDetail";
import "./HomePage.css";
import Loading from "../components/Loading";
import ProfileModal from "../components/ProfileModal";
import Modal from "react-modal";
import { useAxios } from "../hooks/useAxios";

function InboxPage({
  participantID,
  onSelect,
  chatParticipants,
  participantProfile,
}) {
  let [inboxMessages, setInboxMessages] = useState([]);
  let { user, authTokens, logoutUser } = useContext(AuthContext);

  let [loading, setLoading] = useState(true);

  const inboxPageRef = useRef(null);

  useEffect(() => {
    getMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [inboxMessages]);

  const [newMessage, setNewMessage] = useState("");

  const [modalIsOpen, setIsOpen] = useState(false);

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
  // Open and Close modal
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  // Handle Modal Resize
  useEffect(() => {
    const handleResize = () => {
      setModalWidth(window.innerWidth <= 768 ? "80%" : "30%");
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Scroll to bottom on 1 render, on new message
  const scrollToBottom = () => {
    let lastChildElement = inboxPageRef.current?.lastElementChild;
    lastChildElement?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    try {
      const formData = new FormData();
      formData.append("sender", user.user_id);
      formData.append("receiver", participantID);
      formData.append("text", newMessage);
      formData.append("is_read", false);
      console.log(formData);

      const response = await fetch(
        "http://127.0.0.1:8000/chat/api/send-messages/",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: formData,
        }
      );

      if (response.status === 201) {
        getMessages();
      } else {
        console.log("error while sending message");
      }
      setNewMessage("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  let getMessages = async () => {
    try {
      console.log("Fetch Inbox inboxMessages");
      console.log(participantID);
      let response = await fetch(
        `http://127.0.0.1:8000/chat/api/get-messages/${user.user_id}/${participantID}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );
      let data = await response.json();
      if (response.status === 200) {
        setLoading(false);
        setInboxMessages(data);
        // Mark rendered inboxMessages as read
        markMessages(data);
      } else if (response.statusText === "Unauthorized") {
        logoutUser();
      }
    } catch (error) {
      console.error("Error fetching inboxMessages:", error);
    }
  };

  let markMessages = async (data) => {
    try {
      // Update inboxMessages to mark them as read
      console.log(data.map((message) => message.id));
      await fetch(
        `http://127.0.0.1:8000/chat/api/mark-messages-as-read/${user.user_id}/${participantID}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: JSON.stringify(data.map((message) => message.id)),
        }
      );
    } catch (error) {
      console.error("Error marking inboxMessages as read:", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div>
        <div className="d-flex align-items-center justify-content-between">
          <h2>Inbox</h2>
          <div>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              style={customStyles}
              contentLabel="Item Modal"
            >
              {!participantProfile ? (
                <ProfileModal
                  selectedItem={
                    chatParticipants.sender_profile.user.id === participantID
                      ? chatParticipants.sender_profile
                      : chatParticipants.receiver_profile
                  }
                  closeModal={closeModal}
                  onSendMessageFromModal={closeModal}
                />
              ) : (
                <ProfileModal
                  selectedItem={participantProfile}
                  closeModal={closeModal}
                  onSendMessageFromModal={closeModal}
                />
              )}
            </Modal>
            <div onClick={openModal}>
              {participantProfile
                ? participantProfile.full_name
                : chatParticipants.receiver.id !== user.user_id
                ? chatParticipants.receiver_profile.full_name
                : chatParticipants.sender_profile.full_name}
            </div>
          </div>
          {(chatParticipants || participantProfile) && (
            <button
              onClick={() => onSelect()}
              className="btn btn-primary btn-sm"
            >
              Back to List
            </button>
          )}
        </div>
        <div ref={inboxPageRef} className="inbox-page">
          {inboxMessages.map((message) => (
            <MessageDetail key={message.id} message={message} user={user} />
          ))}
        </div>
        <form>
          <div className="mt-2 d-flex">
            <textarea
              className="form-control flex-grow-1"
              rows="1"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{ resize: "none" }}
            />
            <button
              type="button"
              className="btn btn-primary ms-2"
              onClick={() => {
                handleSendMessage();
              }}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InboxPage;
