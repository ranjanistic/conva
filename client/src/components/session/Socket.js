import openSocket from "socket.io-client"
import { sessionToken } from "../../actions/validator";

const socket = openSocket(`${process.env.REACT_APP_PROXY_URL}}`);

export const connectToChat=(roomID,callback)=>{
    console.log("connecting to chat",roomID)
    socket.on('newmsg', newchat=>{callback(null,newchat)});
    socket.emit('chatroom',sessionToken(),roomID);
}

export const connectToPeople=(roomID,callback)=>{
    console.log("connecting to people", roomID)
    socket.on('newperson', activeperson=>{callback(null,activeperson)});
    socket.emit('people',sessionToken(),roomID);
}