import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';
import { authState, logout } from '../Recoil/Atoms/Login.atom.js'
import { logoutSelector } from  '../Recoil/Selectors/Login.selector.js'
import { useNavigate } from 'react-router-dom';

import { useRef } from 'react';
import { useSocket } from './SocketContext.jsx';


export default function Logout() {
  const [auth, setAuth] = useRecoilState(authState);
  const [logot, setLogout] = useRecoilState(logout);
  const logoutLoadable = useRecoilValueLoadable(logoutSelector);
const {socket,resetSocket}=useSocket()
  const navigate = useNavigate();
  const [hasLoggedOut, setHasLoggedOut] = useState(false); // Flag to track logout
    const checker=useRef(false);
  useEffect(() => {
    if (hasLoggedOut) return; // Prevent re-running if already logged out
    if(checker.current) return;
    const performLogout = async () => {
      try {
        setLogout({ loggedout: true });


    
        // Update auth state
        setAuth({
          isAuthenticated: false,
          accessToken: '',
          refreshToken: '',
          user: null,
       
        });
        
       //directly call socket.off event 
       socket.emit('logout');
        socket.disconnect();
      
        checker.current=true;
        
      // Reset socket connection
          resetSocket();

          // Optionally clear local storage or session storage
          localStorage.clear();
          sessionStorage.clear();
       
        // Redirect to login page
      
        navigate('/');
      } catch (error) {
        console.error('Error during logout:', error);
      }

      // Set the flag to true to prevent re-running
      setHasLoggedOut(true);
    };

    performLogout();
  }, []);

  return (
    <div >
      <p>Logging you out...</p>
    </div>
  );
}