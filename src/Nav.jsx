import React, { useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { authState } from '../Recoil/Atoms/Login.atom.js';
import RoomComponent from './RoomComponent';
import Login from './Login';
import Registerform from './Registerform';
import AuthMiddleware from './Authmiddleware';
import Logout from './Logout.jsx';
import { SocketProvider } from './SocketContext.jsx';
import FirstStep from './FirstStep.jsx';

import Create from './Create.jsx';
import styles from '../Styles/Nav.module.css'; // Import the CSS module
import MyCanvas from './MyCanvas.jsx';
import 'remixicon/fonts/remixicon.css';
import gsap from 'gsap';
import {ScrollTrigger} from "gsap/ScrollTrigger";

import { useGSAP } from '@gsap/react';
import Home from './Home.jsx';
import Navbar from './Navbar.jsx';
import Join from './Join.jsx';
import RoomInvite from './RoomInvite.jsx';
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);
export default function Nav() {
    const [auth] = useRecoilState(authState);

   

   
  

    
    return (



        <Router>
        <RoomInvite />
        <Navbar>
                    
                  
                  
                 
               
                    <Routes>

                        <Route path='/logout' element={<AuthMiddleware><Logout /></AuthMiddleware>} />
                        <Route path='/register' element={<Registerform />} />
                        <Route path='/' element={<Login />} />
                        <Route path='/canvas/:roomId' element={<AuthMiddleware><RoomComponent /></AuthMiddleware>} />
                        <Route path='/first' element={<AuthMiddleware><FirstStep /></AuthMiddleware>} />
                        <Route path='/create' element={<AuthMiddleware><Create /></AuthMiddleware>} />
                        <Route path='/join' element={<AuthMiddleware><Join /></AuthMiddleware>} />
                        <Route path='/mycanvas' element={<AuthMiddleware><MyCanvas /></AuthMiddleware>} />
                    </Routes>


                 
              
              
              
               
            
            </Navbar>
        </Router>
    );
}
