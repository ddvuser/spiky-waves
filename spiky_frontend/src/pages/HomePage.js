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

  let [chatParticipants, setChatParticipants] = useState(null);
  let [selectedProfile, setSelectedProfile] = useState(null);
  let [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

  let [isLoading, setIsLoading] = useState(true);

  let [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    myMessages();
  }, [chatParticipants]);

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
    setSelectedProfile(null);
    setChatParticipants(message);
  };
  const handleBackToList = () => {
    setChatParticipants(null);
    setSelectedProfile(null);
  };
  const handleSearchResult = (result) => {
    setSearchResult(result);
  };
  const handleCloseSearchResult = () => {
    setSearchResult(null);
  };
  const handleSendMessageFromModal = (e) => {
    setChatParticipants(null);
    setSelectedProfile(e);
  };

  return (
    <div className="container-fluid">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="row">
          {isSmallScreen ? (
            <div className="col">
              {/* Small screen (profile selected) */}
              {selectedProfile && (
                <InboxPage
                  key={selectedProfile.id}
                  participantID={selectedProfile.user}
                  onSelect={handleBackToList}
                  chatParticipants={chatParticipants}
                  participantProfile={selectedProfile}
                />
              )}
              {/* Small screen (profile not selected) */}
              {chatParticipants && !selectedProfile ? (
                <InboxPage
                  key={chatParticipants.id}
                  participantID={
                    chatParticipants.sender.id !== user.user_id
                      ? chatParticipants.sender.id
                      : chatParticipants.receiver.id
                  }
                  onSelect={handleBackToList}
                  chatParticipants={chatParticipants}
                />
              ) : (
                <>
                  {/* Small screen, (no profile, no inbox selected ) */}
                  {!selectedProfile && (
                    <ul className="list-group inbox-page">
                      <h3>Chats</h3>
                      <SearchUser onSearchResult={handleSearchResult} />
                      {searchResult ? (
                        <SearchResults
                          searchResults={searchResult}
                          onSendMessageFromModal={handleSendMessageFromModal}
                        />
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
                  )}
                  {searchResult && !selectedProfile && (
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
                      <SearchResults
                        searchResults={searchResult}
                        onSendMessageFromModal={handleSendMessageFromModal}
                      />
                    </div>
                    <button
                      className="btn btn-outline-info mt-2"
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
                {/* Profile selected */}
                {selectedProfile && (
                  <InboxPage
                    key={selectedProfile.id}
                    participantID={selectedProfile.user}
                    onSelect={handleBackToList}
                    chatParticipants={chatParticipants}
                    participantProfile={selectedProfile}
                  />
                )}
                {/* Profile not selected */}
                {chatParticipants && (
                  <InboxPage
                    key={chatParticipants.id}
                    participantID={
                      chatParticipants.sender.id !== user.user_id
                        ? chatParticipants.sender.id
                        : chatParticipants.receiver.id
                    }
                    onSelect={handleBackToList}
                    chatParticipants={chatParticipants}
                    participantProfile={null}
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
