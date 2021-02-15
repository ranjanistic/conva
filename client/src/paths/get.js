import {OAUTH,MEET} from './routes';

export const get ={
    ROOT:'/',
    LOGIN:'/login',
    SIGNUP:'/register',
    DASHBOARD:'/dashboard',
    ACCOUNT : '/account',
    MEETING:{
        ROOM: `${MEET}/room/:roomid`,
        LIVE: `${MEET}/live/:roomid`,
        room:(roomid)=>`${MEET}/room/${roomid}`,
        live:(roomid)=>`${MEET}/live/${roomid}`,
    },
    OAUTH:{
        LOGIN:`${OAUTH}/login/:token`
    }
}