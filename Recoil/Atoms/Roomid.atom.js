import { atom } from "recoil"

const roomatom=atom({
    key:'room',
    default:{
        roomId:""
    }
})

export default roomatom