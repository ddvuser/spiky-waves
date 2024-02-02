import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import MessageDetail from '../components/MessageDetail';

function InboxPage() {
    let [messages, setMessages] = useState([]);
    let {user, authTokens, logoutUser} = useContext(AuthContext);
    let routeParams = useParams();

    useEffect(() => {
        myMessages();
    }, [])

    //console.log(messages);

    let myMessages = async () => {
        let response = await fetch(`http://127.0.0.1:8000/chat/api/get-messages/${user.user_id}/${routeParams.id}/`, {
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
        <div className='container'>
            <h2>Inbox</h2>
            {messages.map((message) => (
                <MessageDetail key={message.id} message={message} user={user} />
            ))}
        </div>
    )
}

export default InboxPage;