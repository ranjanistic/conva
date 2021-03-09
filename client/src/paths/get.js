import {OAUTH,MEET, AUTH, ROOM} from './routes';

export const get ={
    ROOT:'/',
    DASHBOARD:'/dashboard',
    ACCOUNT : '/account',
    auth:{
        LOGIN:`${AUTH}/login`,
        SIGNUP:`${AUTH}/register`,
        login:(nextURL='')=>`${AUTH}/login${nextURL?'?next='+nextURL:''}`,
        signup:(nextURL='')=>`${AUTH}/register${nextURL?'?next='+nextURL:''}`,
    },
    room: {
        self:(roomid=":roomid")=>`${ROOM}/${roomid}`,
    },
    meet:{
        live:(roomid=":roomid")=>`${MEET}/${roomid}`,
    },
    OAUTH:{
        LOGIN:`${OAUTH}/login/:token`
    }
}