import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import MessageListItem from "../components/MessageListItem";
import SearchUser from "../components/SearchUser";
import SearchResults from "../components/SearchResults";
import Loading from "../components/Loading";
import InboxPage from "./InboxPage";
import "./HomePage.css";

const HomePage = () => {
  let [messages, setMessages] = useState([]);
  let { user, authTokens, logoutUser } = useContext(AuthContext);

  let [selectedMessage, setSelectedMessage] = useState(null);
  let [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

  let [isLoading, setIsLoading] = useState(true);

  let [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    myMessages();
  }, [selectedMessage]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  let myMessages = async () => {
    console.log("Fetch my-messages");
    let response = await fetch(
      `http://127.0.0.1:8000/chat/api/my-messages/${user.user_id}/`,
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
      setMessages(data);
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };

  const handleItemClick = (message) => {
    setSelectedMessage(message);
  };
  const handleBackToList = () => {
    setSelectedMessage(null);
  };
  const handleSearchResult = (result) => {
    setSearchResult(result);
  };
  const handleCloseSearchResult = () => {
    setSearchResult(null);
  };

  return (
    <div className="container-fluid">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="row">
          {isSmallScreen ? (
            <div className="col">
              {/* Small screen */}
              {selectedMessage ? (
                <InboxPage
                  key={selectedMessage.id}
                  participantID={
                    selectedMessage.sender.id !== user.user_id
                      ? selectedMessage.sender.id
                      : selectedMessage.receiver.id
                  }
                  onSelect={handleBackToList}
                  selectedMessage={selectedMessage}
                />
              ) : (
                <>
                  <ul className="list-group inbox-page">
                    <h3>Chats</h3>
                    <SearchUser onSearchResult={handleSearchResult} />
                    {searchResult ? (
                      <SearchResults searchResults={searchResult} />
                    ) : (
                      messages.map((message) => (
                        <MessageListItem
                          key={message.id}
                          message={message}
                          user={user}
                          onClick={() => handleItemClick(message)}
                        />
                      ))
                    )}
                  </ul>
                  {searchResult && (
                    <button
                      className="btn btn-outline-info"
                      onClick={handleCloseSearchResult}
                    >
                      Back to my chats
                    </button>
                  )}
                </>
              )}
            </div>
          ) : (
            <>
              {/* Default screen */}
              <div className="col">
                <h3>Chats</h3>
                <SearchUser onSearchResult={handleSearchResult} />
                {searchResult ? (
                  <>
                    <div className="inbox-page">
                      <SearchResults searchResults={searchResult} />
                    </div>
                    <button
                      className="btn btn-outline-info"
                      onClick={handleCloseSearchResult}
                    >
                      Back to my chats
                    </button>
                  </>
                ) : (
                  <>
                    {/* Latest messages */}
                    <ul className="list-group inbox-page">
                      {messages.map((message) => (
                        <MessageListItem
                          key={message.id}
                          message={message}
                          user={user}
                          onClick={() => handleItemClick(message)}
                        />
                      ))}
                    </ul>
                  </>
                )}
              </div>
              <div className="col-9">
                {selectedMessage && (
                  <InboxPage
                    key={selectedMessage.id}
                    participantID={
                      selectedMessage.sender.id !== user.user_id
                        ? selectedMessage.sender.id
                        : selectedMessage.receiver.id
                    }
                    onSelect={handleBackToList}
                    selectedMessage={selectedMessage}
                  />
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
