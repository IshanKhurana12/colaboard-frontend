import gsap from 'gsap';
import {ScrollTrigger} from "gsap/ScrollTrigger";
import styles from '../Styles/Nav.module.css';
import { useGSAP } from '@gsap/react'
import { useRecoilState } from 'recoil';
import { authState } from '../Recoil/Atoms/Login.atom';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import RoomInvite from './RoomInvite';
import Loader from './Loader';
import { delay } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);
export default function Navbar({children}) {
    const [auth] = useRecoilState(authState);
    const {contextSafe}=useGSAP({});
    const tl=gsap.timeline();
    useGSAP(()=>{
        const colors = ["#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "#9400d3"];
        gsap.from("#nav",{
            opacity:0,
            duration:1
        })

        gsap.from('#left',{
            x:-150
        })
        
        gsap.from('#opa',{
            opacity:0,
            duration:1
        })
      
        gsap.from('#right',{
            x:150
        })


        tl.from('#ol h1',{
            delay:1,
            scale:7,
            duration:1,
            opacity:0,
            stagger:1,
            onComplete:()=>{
                gsap.to('#ol h1',{
                    delay:1,
                  
                   opacity:0,
                })

            
            }
        }).to('#heading',{
            opacity:0,
            
        })
        
        
       tl.to("#children",{
            opacity:1,
            duration:1,
            delay:1
       })
      
     
    });

 

  
   
    

    
    return (



        <div>
           
            <div>
            <h1 id="cola" className={styles.colab}>ColaBoard</h1> 
                <nav id='nav'>
               
                {auth.isAuthenticated ? (
                          <h4 id='left'>
                          <Link  to="/logout">Logout</Link>
                          </h4>
                               
                           
                        ) : (
                          <h4 id='left'>
                          <Link   to="/">Login</Link>
                          
                          </h4>
                              
                        )}
                      
                      <h4 id='left'>
                      <Link  to="/create">Create Room</Link>
                      </h4>
                      <h4 id='opa'>
                      <Link  to="/join">Join Room</Link>
                      </h4>
                      <h4 id='right'>
                      <Link  to="/mycanvas">MyCanvas</Link>
                      </h4>
                    <Link >{auth.isAuthenticated && <h4  id='right'>{auth.user.username}</h4>} </Link>
                   
                </nav>
            </div>
            <div id='ol' className={styles.outleft}>
            <h1>Create.  </h1> <h1>Join.</h1> <h1 >Invite.</h1>
            <h2 id='heading'>whiteboards by ColaBoard...</h2>
          
            </div>
          
      
        <div id='children' className={styles.children}>
        {children}
        </div>
          
        </div>
    )
}