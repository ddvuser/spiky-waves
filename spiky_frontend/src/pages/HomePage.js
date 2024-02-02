import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext';
import MessageListItem from '../components/MessageListItem';

const HomePage = () => {
  let [messages, setMessages] = useState([]);
  let {user, authTokens, logoutUser} = useContext(AuthContext);

  useEffect(() => {
    myMessages();
  }, [])

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
    <div className='container-fluid'>
      <h3>HomePage</h3>
      <ul>
        {messages.map((message) =>
          <MessageListItem key={message.id} message={message} user={user} />
        )}
      </ul>
    </div>
  )
}

export default HomePage;