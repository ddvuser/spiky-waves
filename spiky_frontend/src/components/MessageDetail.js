import React from "react";
import moment from "moment";

const MessageItem = ({ message, user }) => {
  return (
    <div key={message.id} className="list-group-item border-0">
      <div>
        {message.sender.id !== user.user_id ? (
          <div>
            <div className="d-flex justify-content-center">
              <small>
                <span className="badge bg-warning badge-pill text-white">
                  {moment
                    .utc(message.created)
                    .local()
                    .format("MMMM Do YYYY, h:mm:ss a")}
                </span>
              </small>
            </div>
            <div className="d-flex align-items-center flex-row">
              <img
                src={message.sender_profile.image}
                className="rounded-circle me-2"
                alt="1"
                width={40}
                height={40}
              />
              <div>
                {message.sender.name !== null && message.sender.surname !== null
                  ? `${message.sender.name} ${message.sender.surname}`
                  : message.sender.username}
                <div>
                  <p style={{ overflowWrap: "break-word" }}>{message.text}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="d-flex justify-content-center">
              <small>
                <span className="badge bg-info badge-pill text-white">
                  {moment
                    .utc(message.created)
                    .local()
                    .format("MMMM Do YYYY, h:mm:ss a")}
                </span>
              </small>
            </div>
            <div className="d-flex flex-row-reverse">
              <div className="d-flex align-items-center flex-row-reverse">
                <img
                  src={message.sender_profile.image}
                  className="rounded-circle mr-1"
                  alt="1"
                  width={40}
                  height={40}
                />
              </div>
              <div className="d-flex flex-column me-2">
                <div className="d-flex flex-row-reverse">me:</div>
                <div className="text-break">
                  <p style={{ overflowWrap: "break-word" }}>{message.text}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
