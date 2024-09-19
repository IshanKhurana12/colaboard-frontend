import React, { useEffect, useState } from 'react';
import { useSocket } from './SocketContext';
import { useRecoilState } from 'recoil';
import { authState } from '../Recoil/Atoms/Login.atom';
import styles from '../Styles/mycanvas.module.css'; // Import CSS module


export default function MyCanvas() {
    const { socket } = useSocket();
    const [auth, setauth] = useRecoilState(authState);
    const [canvas, setcanvas] = useState([]);
    const [data, setdata] = useState({});

    useEffect(() => {
        if (socket) {

            socket.emit('getmycanvas', { userid: auth.user._id });

            const handleCanvasUpdate = (data) => {
                console.log(data)
                setdata(data);
                setcanvas(data[0].canvas);
            };

            // Register the event listener
            socket.on('sendmycanvas', handleCanvasUpdate);

            // Cleanup function
            return () => {
                socket.off('sendmycanvas', handleCanvasUpdate);
            };
        }
    }, [socket,setcanvas]);

  
       
    

    const extractPublicIdFromUrl = (url) => {
        // Adjust the regex to better match common patterns for public IDs
        const regex = /\/upload\/.*\/([^\/]+\.[^\/]+)$/;
        const match = url.match(regex);
        return match ? match[1].split('.')[0] : null;
    };
    function deletecanvas(canvasId,imageUrl){
        const publicid=extractPublicIdFromUrl(imageUrl);
        socket.emit('deletecanvas', {canvasId,imageUrl,publicid});
        const filtereddata=canvas.filter((img)=>{
            return img!=imageUrl;
        })
        setcanvas(filtereddata);
    }

    return (
        <div className={styles.container}>
      
            { <div className={styles.canvasWrapper}>
                {canvas.length!==0 ? canvas.map((img) => (
                    <div key={img} className={styles.canvasItem}> 
                        <img src={img} alt="Canvas" />
                        <button onClick={()=>deletecanvas(data[0]._id,img)}>Delete image</button>
                    </div>
                )):<h2>No images found</h2>}
            </div> }
        </div>
    );
}
