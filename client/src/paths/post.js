import {AUTH,MEET,ROOM} from './routes';

export const post = {
    auth:{
        LOGIN: `${AUTH}/login`,
        SIGNUP: `${AUTH}/signup`,
        RECPASS: `${AUTH}/setrecoverypass`,
        twofactor: {
            SEND:`${AUTH}/2FA/send`,
            VERIFY:`${AUTH}/2FA/verify`,
        },
        VERIFICATION: `${AUTH}/verification`,
    },
    room:{
        CREATE:`${ROOM}/create`,
        ENTER:`${ROOM}/enter`,
        RECEIVE:`${ROOM}/receive`,
        CHATS:`${ROOM}/chats`,
    },
    meet:{
        JOIN: `${MEET}/join`,
        LEAVE: `${MEET}/leave`,
    },
}