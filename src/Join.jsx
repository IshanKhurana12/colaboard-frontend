import React, { useEffect, useState } from 'react';
import { useSocket } from './SocketContext';
import styles from '../Styles/create.module.css'; // Import CSS module for styling
import { useRecoilState } from 'recoil';
import { authState } from "../Recoil/Atoms/Login.atom.js";
import { useNavigate } from 'react-router-dom';
import roomatom from '../Recoil/Atoms/Roomid.atom.js';

export default function Join() {
  const [roomid, setRoomId] = useState("");
  const { socket } = useSocket();
  const [auth] = useRecoilState(authState);
  const [activeRooms, setActiveRooms] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();
  const [rt, setRt] = useRecoilState(roomatom);

  useEffect(() => {
    if (socket) {
      socket.emit('activerooms');

      socket.on('joined', ({ roomId, joined }) => {
        console.log(`${joined} joined the room ${roomId}`);
      });

      socket.on('activeRoomsList', (rooms) => {
        setActiveRooms(rooms);
        setLoading(false); // Stop loading when rooms are fetched
        if (rooms.length === 0) {
          // Navigate back to /create if no active rooms
          navigate('/create');
        }
      });

      // Clean up socket events when component unmounts
      return () => {
        socket.off('joined');
        socket.off('activeRoomsList');
      };
    }
  }, [socket, navigate]);

  const join = (e) => {
    e.preventDefault();
    if (roomid.trim() === "") {
      alert("Room name cannot be empty");
      return;
    }
    if (socket) {
      socket.emit('joinroom', roomid, auth.user);
      setRt({ roomId: roomid });
      navigate(`/canvas/${roomid}`);
    }
  };

  const joinRoom = (r) => {
    socket.emit('joinroom', r, auth.user);
    setRt({ roomId: r });
    navigate(`/canvas/${r}`);
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={join}>
        <input
          className={styles.input}
          value={roomid}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter Room ID"
        />
        <button className={styles.button} type="submit">Join Room</button>
      </form>

      <p>Or join from Active Rooms</p>
      {loading ? (
        <p>Loading rooms...</p> // Loading message
      ) : (
        <div className={styles.activeRooms}>
          {activeRooms.map((act) => (
            <div key={act}>
              <button onClick={() => joinRoom(act)}>{act}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
