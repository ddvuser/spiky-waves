import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import MessageListItem from "../components/MessageListItem";
import SearchUser from "../components/SearchUser";
import SearchResults from "../components/SearchResults";
import Loading from "../components/Loading";
import InboxPage from "./InboxPage";
import "./HomePage.css";
import { useAxios } from "../hooks/useAxios";
import { useScreenSize } from "../hooks/useScreenSize";

const HomePage = () => {
  let [latestMessages, setMessages] = useState([]);
  let { user, authTokens } = useContext(AuthContext);

  let [chatParticipants, setChatParticipants] = useState(null);
  let [selectedProfile, setSelectedProfile] = useState(null);

  let [loading, setLoading] = useState(true);

  let [searchResult, setSearchResult] = useState(null);

  // Set screen size
  const { isSmallScreen } = useScreenSize();

  // Get latest messages
  const { response, isLoading, error } = useAxios({
    method: "get",
    url: `/chat/api/my-messages/${user.user_id}/`,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + String(authTokens.access),
    },
  });

  useEffect(() => {
    if (error) {
      console.log(
        `Error status: ${error.status}\nError statusText: ${error.statusText}\nError detail: ${error.data.detail}`
      );
    } else if (response) {
      setMessages(response);
      setLoading(isLoading);
    }
  }, [response, error]);

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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {isSmallScreen ? (
          <div className="col">
            {/* Small screen (profile selected) */}
            {selectedProfile && (
              <InboxPage
                key={selectedProfile.id}
                participantID={selectedProfile.user.id}
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
                      latestMessages.map((message) => (
                        <MessageListItem
                          key={message.id}
                          message={message}
                          user={user}
                          unread={message.unread_count}
                          onClick={() => {
                            handleItemClick(message);
                          }}
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
                  {/* Latest latestMessages */}
                  <ul className="list-group inbox-page">
                    {latestMessages.map((message) => (
                      <MessageListItem
                        key={message.id}
                        message={message}
                        user={user}
                        unread={message.unread_count}
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
                  participantID={selectedProfile.user.id}
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
    </div>
  );
};

export default HomePage;
