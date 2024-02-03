import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext';
import MessageDetail from '../components/MessageDetail';

function InboxPage({ participantID }) {
    let [messages, setGetMessages] = useState([]);
    let {user, authTokens, logoutUser} = useContext(AuthContext);

    useEffect(() => {
        getMessages();
    }, [])

    //console.log(messages);
    console.log(`pariticipant ` + participantID);

    let getMessages = async () => {
        let response = await fetch(`http://127.0.0.1:8000/chat/api/get-messages/${user.user_id}/${participantID}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access)
        }
        })
        let data = await response.json();
        if (response.status === 200) {
            setGetMessages(data);
        }
        else if (response.statusText === 'Unauthorized') {
            logoutUser();
        }
    }    

    return (
        <div>
            <h2>Inbox</h2>
            <div>
                {messages.map((message) => (
                    <MessageDetail key={message.id} message={message} user={user} />
                ))}
            </div>
        </div>
    )
}

export default InboxPage;