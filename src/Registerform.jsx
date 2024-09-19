import React, { useEffect, useState } from 'react';
import { authState } from '../Recoil/Atoms/Login.atom';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from "../Styles/Register.module.css"


const baseUrl = 'http://localhost:5000';


export default function Registerform() {
    const navigate = useNavigate();
    const [auth] = useRecoilState(authState);

    useEffect(()=>{
        if (auth.isAuthenticated) {
            navigate('/');
          }
      
    },[])
   
    const [username, setUsername] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('username', username);
      
        formData.append('email', email);
        formData.append('password', password);
        formData.append('avatar', avatar);
       

        try {
            const response = await axios.post(`${baseUrl}/api/v1/users/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            
             
              
               if(response.status===201){
                    navigate('/');
               } 
            
        } catch (error) {
            console.error('Error during signup:', error);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Sign In</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="username">User Name</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>

          

                <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="avatar">Avatar</label>
                    <input
                        type="file"
                        id="avatar"
                        onChange={(e) => setAvatar(e.target.files[0])}
                        required
                        className={styles.input}
                    />
                </div>


                <button type="submit" className={styles.submitButton}>Sign up</button>
            </form>
        </div>
    );
}