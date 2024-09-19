import { atom,useRecoilState,selector } from "recoil";

import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();
export const authState=atom({
    key:"auth",
    default: {
        isAuthenticated: false,
        user: null,
        accessToken:"",
        refreshToken:"",
      
      },  effects_UNSTABLE: [persistAtom],
})

export const logindetails=atom({
    key:"logindetails",
    default:{
        username:"",
        password:"",
        email:""
    },  effects_UNSTABLE: [persistAtom],
})

export const logout=atom({
    key:"logout",
    default:{
        loggedout:false
    },  effects_UNSTABLE: [persistAtom],
})