import React from 'react';
import moment from 'moment';

const MessageListItem = ({ message, user, onClick }) => {

  return (
    <li
      key={message.id}
      className="list-group-item list-group-item-action border-0"
      onClick={() => onClick()}
    >
      <div className="d-flex align-items-start">
        {message.sender.id !== user.user_id && (
          <img
            src={message.sender_profile.image}
            className="rounded-circle mr-1"
            alt="1"
            width={40}
            height={40}
          />
        )}
        {message.sender.id === user.user_id && (
          <img
            src={message.receiver_profile.image}
            className="rounded-circle mr-1"
            alt="2"
            width={40}
            height={40}
          />
        )}
        <div className="flex-grow-1 ml-3">
          {message.sender.id === user.user_id &&

            (message.receiver.name !== null && message.receiver.surname !== null
              ? `${message.receiver.name} ${message.receiver.surname}`
              : message.receiver.username)}

          {message.sender.id !== user.user_id &&

            (message.sender.name !== null && message.sender.surname !== null
              ? `${message.sender.name} ${message.sender.surname}`
              : message.sender.username)}
              
          <div className="small">
            <small>
              {`${message.sender.id === user.user_id ?
                "me" : message.sender.username}: ${message.text}`.substring(0, 30)} {message.text.length >= 20 && '...'}
            </small>
          </div>
        </div>
      </div>
      <small>
        <span className="badge bg-primary badge-pill text-white">
          {moment.utc(message.created).local().startOf('seconds').fromNow()}
        </span>
      </small>
    </li>
  );
};

export default MessageListItem;