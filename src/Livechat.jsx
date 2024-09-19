import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { authState } from '../Recoil/Atoms/Login.atom';
import { useSocket } from './SocketContext';
import styles from '../Styles/livechat.module.css'; // Import CSS module for styling
import { useParams } from 'react-router-dom';

export default function Livechat() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [auth] = useRecoilState(authState);
    const { socket } = useSocket();
    const {roomId}=useParams();
    useEffect(() => {
        // Listen for incoming messages from the room
        if(socket){
        socket.on('receiveMessage', ({ message, sender }) => {
            setMessages(prevMessages => [...prevMessages, { message, sender }]);
        });

        // Clean up socket events when component unmounts
        return () => {
            socket.off('receiveMessage');
        };
    }
    }, [socket]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message) {
            socket.emit('sendMessage', {roomId, message, sender: auth.user.username });
            setMessage(''); // Clear the input field
        }
    };
    
    return (
        <div className={styles.container}>
            <div className={styles.header}>Livechat</div>
            <div className={styles.messages}>
                {messages.map((msg, index) => (
                    <div key={index} className={styles.message}>
                        <strong>{msg.sender}: </strong>{msg.message}
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className={styles.form}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={styles.input}
                    placeholder="Type your message..."
                />
                <button type="submit" className={styles.button}>Send</button>
            </form>
        </div>
    );
}
