import {OAUTH,MEET} from './routes';

export const get ={
    ROOT:'/',
    LOGIN:'/login',
    SIGNUP:'/register',
    DASHBOARD:'/dashboard',
    ACCOUNT : '/account',
    MEETING:{
        room:(roomid=":roomid")=>`${MEET}/room/${roomid}`,
        live:(roomid=":roomid")=>`${MEET}/live/${roomid}`,
    },
    OAUTH:{
        LOGIN:`${OAUTH}/login/:token`
    }
}