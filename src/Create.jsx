import React, { useState } from 'react';
import { useSocket } from './SocketContext';
import styles from '../Styles/create.module.css'; // Import CSS module for styling
import { useEffect } from 'react';
import {useRecoilState} from 'recoil';
import {useNavigate} from "react-router-dom";
import {authState} from "../Recoil/Atoms/Login.atom.js"
import roomatom from '../Recoil/Atoms/Roomid.atom.js';
import MyCanvas from './MyCanvas.jsx';
export default function Create() {
    const { socket } = useSocket();
    const [roomName, setRoomName] = useState("");
    const [rooms,setrooms]=useState([]);
    const [auth,setauth]=useRecoilState(authState);
    const navigate=useNavigate();
    const [rt,setrt]=useRecoilState(roomatom);
    useEffect(() => {

    
        // Listen for incoming messages from the room
        if(socket){

        
        socket.on('roomCreated', ({ roomId, username }) => {
            console.log(`room with id ${roomId} is created by ${username}`)
          setrooms(prevrooms=>[...prevrooms,{roomId,username}])
        });
    
        // Clean up socket events when component unmounts
        return () => {
          socket.off('roomCreated');
        };
    }
      }, []);

    const createRoom = (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        if (roomName.trim() === "") {
            alert("Room name cannot be empty");
            return;
        }

        if (socket) {
            socket.emit('createroom', roomName,auth.user);
            // set room atom then navigate
            setrt({
                roomId:roomName
            })
            navigate(`/canvas/${roomName}`);
            setRoomName("");
        } else {
            console.error("Socket is not initialized");
        }
    }

    return (
        <div>

      
        <div className={styles.container}>
            <h2 className={styles.title}>Create a New Room</h2>
            <form onSubmit={createRoom} className={styles.form}>
                <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Enter room name"
                    className={styles.input}
                />
                <button type="submit" className={styles.button}>Create Room</button>
            </form>
        </div>
        {rooms && <div>{rooms.map((room)=>{
          return  <div>
                <h1>{room.roomId}</h1>
                <p>Created by- {room.username}</p>
            </div>
        })}</div>}
        </div>
    );
}
