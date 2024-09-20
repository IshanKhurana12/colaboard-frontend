import React, { useEffect, useState } from 'react';
import { useSocket } from './SocketContext';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { authState } from '../Recoil/Atoms/Login.atom';
import roomatom from '../Recoil/Atoms/Roomid.atom';
import styles from '../Styles/roominvite.module.css'

export default function RoomInvite() {
    const [invite, setInvite] = useState(null); // Store invite details
    const { socket } = useSocket();
    const [auth] = useRecoilState(authState);
    const [rt, setRt] = useRecoilState(roomatom);
    const navigate = useNavigate();

    useEffect(() => {
        if (socket) {
            console.log("Room Invite component mounted");

            // Listen for the 'invitestatus' event
            socket.on('invitestatus', ({ invitefrom, roomId,to }) => {
                //if user matcches then only
                if(auth.isAuthenticated){

                
                if(auth.user.username==to){
                  console.log("inside");
                    setInvite({ invitefrom, roomId }); // Store invite details
                }
            }
              
            });

            return () => {
                socket.off('invitestatus'); // Clean up on unmount
            };
        }
    }, [socket,auth]);

    const handleAccept = () => {
        if (invite) {
            console.log(`Accepted invite to room: ${invite.roomId}`);
            // Emit join room event
            socket.emit('joinroom', invite.roomId, auth.user);
            setRt({ roomId: invite.roomId });
            navigate(`/canvas/${invite.roomId}`);
            socket.emit('inviteaccept', invite.roomId);
            setInvite(null); // Reset invite state
        }
    };

    const handleReject = () => {
        console.log(`Rejected invite from: ${invite.invitefrom}`);
        setInvite(null); // Reset invite state
    };

    return (
        <div className={styles.inviteContainer}>
            {invite ? (
                <>
                    <p className={styles.inviteMessage}>Room Invite from: {invite.invitefrom}</p>
                    <button className={`${styles.button} ${styles.acceptButton}`} onClick={handleAccept}>Accept</button>
                    <button className={`${styles.button} ${styles.rejectButton}`} onClick={handleReject}>Reject</button>
                </>
            ) : (
               <p></p>
            )}
        </div>
    );
}
