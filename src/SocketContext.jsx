import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [connectionKey, setConnectionKey] = useState(0); // Key to force reconnection

    useEffect(() => {
        const newSocket = io('http://localhost:5000'); // Update with your server URL
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
            setSocket(null); // Clear socket instance on unmount
        };
    }, [connectionKey]);

    const resetSocket = () => {
        setConnectionKey(prevKey => prevKey + 1); // Change key to trigger reconnection
    };

    return (
        <SocketContext.Provider value={{ socket, resetSocket }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const { socket, resetSocket } = useContext(SocketContext);
    return { socket, resetSocket };
};
