import React from 'react'
import { useSocket } from './SocketContext'
import { useNavigate } from 'react-router-dom'
import styles from '../Styles/First.module.css'
export default function FirstStep() {
    const navigate=useNavigate();
    const create=()=>{
        navigate('/create');
    }
    const join=()=>{
        
        navigate('/join');
    }
  return (
    <div className={styles.container}>
      <div className={styles.button} onClick={create}>Create Room</div>
      <div className={styles.button} onClick={join}>Join Room</div>
    </div>
  )
}
