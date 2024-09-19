import React from 'react'
import Nav from './Nav'
import Navbar from './Navbar'
import { SocketProvider } from './SocketContext'
import RoomInvite from './RoomInvite'

export default function App() {
  return (
    <SocketProvider>
    
<Nav />

    </SocketProvider>
   
  )
}
