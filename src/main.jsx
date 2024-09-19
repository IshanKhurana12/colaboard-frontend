import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import RoomComponent from './RoomComponent'
import Registerform from './Registerform'
import { RecoilRoot } from 'recoil'
import App from './App'
import Home from './Home'
import Navbar from './Navbar'

createRoot(document.getElementById('root')).render(
<>
<RecoilRoot>

     <App />
   
</RecoilRoot>


</>
   
)
