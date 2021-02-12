import {OAUTH} from './routes';

export const get ={
    ROOT:'/',
    LOGIN:'/login',
    SIGNUP:'/register',
    DASHBOARD:'/dashboard',
    MEETING:'/meeting',
    OAUTH:{
        LOGIN:`${OAUTH}/login/:token`
    }
}