import React, { useState, useEffect, useContext, useRef } from "react";
import AuthContext from "../context/AuthContext";
import MessageDetail from "../components/MessageDetail";
import "./HomePage.css";
import Loading from "../components/Loading";

function InboxPage({ participantID, onSelect, selectedMessage }) {
  let [messages, setGetMessages] = useState([]);
  let { user, authTokens, logoutUser } = useContext(AuthContext);

  let [isLoading, setIsLoading] = useState(true);

  const inboxPageRef = useRef(null);

  useEffect(() => {
    console.log("messages refreshed");
    getMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const [newMessage, setNewMessage] = useState("");

  const scrollToBottom = () => {
    let lastChildElement = inboxPageRef.current?.lastElementChild;
    lastChildElement?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    let response = await fetch(
      "http://127.0.0.1:8000/chat/api/send-messages/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
        body: JSON.stringify({
          sender: user.user_id,
          receiver: participantID,
          text: newMessage,
          is_read: false,
        }),
      }
    );
    if (response.status === 201) {
      getMessages();
    } else {
      alert("Error");
    }
    setNewMessage("");
  };

  let getMessages = async () => {
    console.log("get-messages");
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
      setIsLoading(false);
      setGetMessages(data);
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };
  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <div className="d-flex align-items-center justify-content-between">
            <h2>Inbox</h2>
            {selectedMessage && (
              <button
                onClick={() => onSelect()}
                className="btn btn-primary btn-sm"
              >
                Back to List
              </button>
            )}
          </div>
          <div ref={inboxPageRef} className="inbox-page">
            {messages.map((message) => (
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
      )}
    </div>
  );
}

export default InboxPage;
