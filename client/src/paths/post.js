import {AUTH,MEET,ROOM} from './routes';

export const post = {
    auth:{
        LOGIN: `${AUTH}/login`,
        SIGNUP: `${AUTH}/signup`,
    },
    room:{
        CREATE:`${ROOM}/create`,
    },
    meet:{
        JOIN: `${MEET}/join`,
        END: `${MEET}/end`,
    },
    JOINMEET: `${MEET}/join`,
    ENDMEET: `${MEET}/end`,
}