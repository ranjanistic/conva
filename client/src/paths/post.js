import {AUTH,MEET,ROOM} from './routes';

export const post = {
    auth:{
        LOGIN: `${AUTH}/login`,
        SIGNUP: `${AUTH}/signup`,
    },
    room:{
        CREATE:`${ROOM}/create`,
        ENTER:`${ROOM}/enter`,
        RECEIVE:`${ROOM}/receive`,
        CHATS:`${ROOM}/chats`,
    },
    meet:{
        JOIN: `${MEET}/join`,
        END: `${MEET}/end`,
    },
}