import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import styles from "../Styles/home.module.css"
import {ScrollTrigger} from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);

export default function Home() {

    const textref=useRef();
    const parentref=useRef();
    useGSAP(()=>{
            gsap.from(textref.current,{
                duration:2,
                opacity:0,
               xPercent:-100,
                scrollTrigger:{
                    trigger:parentref.current,
                    start:"top top",
                    end:"bottom top",
                    scrub:2,
                    markers:true,
                    pin:true
                }
            })
    },)

    const {contextSafe}=useGSAP({});
    // var path="M 10 100 Q 255 100 990 100"
    // var finalpath="M 10 100 Q 255 100 990 100"

    // const onmousemovestring=contextSafe((dets)=>{
       
    //     path=`M 10 100 Q ${dets.clientX/10} ${dets.clientY} 990 100`
    //        gsap.to("svg path",{
    //         attr:{d:path},
    //         duration:0.3,
    //         ease:"power3.out"
    //        })
    // })  

    // const onmouseleavestring=contextSafe((dets)=>{
    //        gsap.to("svg path",{
    //         attr:{d:finalpath},
    //         duration:0.9,
    //         ease:"elastic.out(1,0.2)"
           
    //        })
    // })  


    // const mousemove=contextSafe((e)=>{
      
    //     gsap.to("#cursor",{
    //         x:e.clientX,
    //         y:e.clientY,
            
    //     })
    // })

    
  return (
    <>
    
    <div ref={parentref}  className={styles.page1} >
    
    {/* <div id='cursor' className={styles.c}></div> */}
    <h1 ref={textref} className={styles.text}>ColaBoard</h1>
    </div>


   
</>
  )
}
