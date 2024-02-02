import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext';
import moment from 'moment';

const HomePage = () => {
  let [messages, setMessages] = useState([]);
  let {user, authTokens, logoutUser} = useContext(AuthContext);

  useEffect(() => {
    myMessages();
  }, [])

  console.log(messages);

  let myMessages = async () => {
    let response = await fetch(`http://127.0.0.1:8000/chat/api/my-messages/${user.user_id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens.access)
      }
    })
    let data = await response.json();
    if (response.status === 200) {
      setMessages(data);
    }
    else if (response.statusText === 'Unauthorized') {
      logoutUser();
    }
  }

  return (
    <div>
      <h3>HomePage</h3>
      <ul>
        {messages.map((message) =>
          <Link 
            to={"/inbox/" + (message.sender.id === user.user_id ? message.receiver.id : message.sender.id) + "/"}
            href="#"
            className="list-group-item list-group-item-action border-0"
          >
          <small>
            <div className="badge bg-success float-right text-white">
              {moment.utc(message.created).local().startOf('seconds').fromNow()}
            </div>
          </small>
          <div className="d-flex align-items-start">
            {message.sender.id !== user.user_id && 
              <img 
                src={message.sender_profile.image} 
                className="rounded-circle mr-1" alt="1" width={40} height={40}
              />
            }
            {message.sender.id === user.user_id &&
              <img 
                src={message.receiver_profile.image} 
                className="rounded-circle mr-1" alt="2" width={40} height={40}
              />
            }
            <div className="flex-grow-1 ml-3">
                {message.sender.id === user.user_id && 
                  (message.receiver.name !== null  && message.receiver.surname !== null ? 
                    message.receiver.name + " " + message.receiver.surname : 
                    message.receiver.username)
                }

                {message.sender.id !== user.user_id && 
                  (message.sender.name !== null && message.sender.surname !== null ?
                    message.sender.name + " " + message.sender.surname :
                    message.sender.username ) 
                }
              <div className="small">
                  <small>{message.text}</small>
              </div>
            </div>
        </div>
            </Link>
        )}
      </ul>
    </div>
  )
}

export default HomePage;