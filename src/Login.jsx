import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useRecoilCallback, useRecoilValueLoadable } from 'recoil';
import { logindetails, authState } from '../Recoil/Atoms/Login.atom.js';
import loginSelector from '../Recoil/Selectors/Login.selector.js';
import styles from '../Styles/login.module.css';
import { logoutSelector } from '../Recoil/Selectors/Login.selector.js';
import { logout } from '../Recoil/Atoms/Login.atom.js';
import { io } from 'socket.io-client';


//used for navigation to another route
import { useNavigate } from 'react-router-dom';
import { useSocket } from './SocketContext.jsx';
import Home from './Home.jsx';

export default function Login() {
   
    const [data, setData] = useRecoilState(logindetails);
    const [auth, setAuth] = useRecoilState(authState);
    const [error, setError] = useState(null);
    const [logot,setlogout]=useRecoilState(logout);

const {socket,resetSocket}=useSocket();

    const navigate=useNavigate();

    // Use useRecoilCallback to manually trigger the selector
    const handleSubmit = useRecoilCallback(({ snapshot, reset }) => async (e) => {
        e.preventDefault();
        setError(null); // Clear previous errors

        try {
            // Manually evaluate the selector
            const result = await snapshot.getPromise(loginSelector);
          
            setAuth({
                isAuthenticated: true,
                user: result.data.user,
                accessToken:result.data.accessToken,
                refreshToken:result.data.refreshToken,
              
            });

            //emit to Login
         
            socket.emit('login',result.data.user.username)
        
          //navigate to progile page if its authenticated
                
                navigate('/first');
            
           
        } catch (error) {
            setError(error.message);
            console.error('Login Error:', error.message);
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prevDetails => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    function handlenewuser(){
        navigate("/register");
    }

 function signout(){
       navigate('/logout')
    }
    return (
        <div>
                
        <div className={styles.loginContainer}>
  
            <div>Login</div>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <input
                        type="text"
                        name="username"
                        value={data.username}
                        onChange={handleChange}
                        placeholder="UserName"
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                    <input
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                    <input
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className={styles.input}
                    />
                </div>
               {!auth.isAuthenticated &&  <button type="submit" className={styles.button}>Login</button>}
               {auth.isAuthenticated &&  <button onClick={signout} className={styles.button}>Logout</button>} 
            </form>
            {auth.isAuthenticated && <div className={`${styles.message} ${styles.successMessage}`}>Login successful!</div>}
            {error && <div className={`${styles.message} ${styles.errorMessage}`}>Error: {error}</div>}
       
       
            {!auth.isAuthenticated &&  <div><button onClick={handlenewuser} className={styles.button}>New User/Sign-up</button></div>}
       
       
        </div>
        </div>
        
    );
}