import gsap from 'gsap';
import {ScrollTrigger} from "gsap/ScrollTrigger";
import styles from '../Styles/Nav.module.css';
import { useGSAP } from '@gsap/react'
import { useRecoilState } from 'recoil';
import { authState } from '../Recoil/Atoms/Login.atom';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import RoomInvite from './RoomInvite';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);
export default function Navbar({children}) {
    const [auth] = useRecoilState(authState);

    const {contextSafe}=useGSAP({});

  
    const fullref=useRef();


 

    var tl=gsap.timeline();
    useGSAP(()=>{
        tl.to(fullref.current,{
            right:0,
            duration:0.2,
            
        })

        tl.from("#full h4",{
                x:150,
                opacity:0,
                duration:0.1,
                stagger:0.1
        })

        tl.from("#full i",{
            opacity:0
        })

        tl.pause();
       
     
    })
  
    const clickmenu=contextSafe(()=>{
        console.log("play");
        tl.play();
    })

    const closemenu=contextSafe(()=>{
        console.log("close")
        tl.reverse();
    })

    
    const mousemove=contextSafe((e)=>{
      
        gsap.to("#cursor",{
            x:e.clientX,
            y:e.clientY,
            delay:0.1
        })
    })
  
   
    

    
    return (



        
            <div  className={styles.main}>
          
            <nav className={styles.nav}>
            <h2>colaBoard</h2>
            <i onClick={clickmenu} className="ri-menu-line"></i>
                <div id='full' ref={fullref} className={styles.full}>

                <i  onClick={closemenu} className="ri-close-fill"></i>
                  
                        {auth.isAuthenticated ? (
                          <h4>
                          <Link  to="/logout">Logout</Link>
                          </h4>
                               
                           
                        ) : (
                          <h4>
                          <Link  to="/">Login</Link>
                          
                          </h4>
                              
                        )}
                      
                      <h4>
                      <Link  to="/create">Create Room</Link>
                      </h4>
                      <h4>
                      <Link to="/join">Join Room</Link>
                      </h4>
                      <h4>
                      <Link to="/mycanvas">MyCanvas</Link>
                      </h4>
                    <Link >{auth.isAuthenticated && <h4>{auth.user.username}</h4>} </Link>
                   
                               
                         
                              
                           
                              
                            
                 
                    </div>
                    </nav>
                
                        {children}
                    </div>
    )
}