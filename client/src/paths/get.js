import {OAUTH,MEET} from './routes';

export const get ={
    ROOT:'/',
    LOGIN:'/login',
    SIGNUP:'/register',
    DASHBOARD:'/dashboard',
    MEETING:'/meet',
    MEETROOM:`${MEET}/:roomid`,
    OAUTH:{
        LOGIN:`${OAUTH}/login/:token`
    }
}