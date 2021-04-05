import openSocket from "socket.io-client"
import { sessionToken } from "../../utils/validator";

const socket = openSocket(`${process.env.REACT_APP_PROXY_URL}`);

const channel = {
    listener:{
        chat:"newmsg",
        people:"newperson",
        stream:"newstream"
    },
    provider:{
        chat:"chatroom",
        people:"people",
        stream:"stream"
    },
    leaver:{
        chat:"leavechat",
        people:"leavepeople",
        stream:"leavestream"
    }
}

export const connectToChat=(roomID,callback)=>{
    console.log("connecting to chat",roomID)
    socket.on(channel.listener.chat, newchat=>callback(null,newchat));
    socket.emit(channel.provider.chat,sessionToken(),roomID);
}

export const disconnectFromChat=(roomID)=>{
    console.log("disconnecting chat",roomID)
    socket.emit(channel.leaver.chat,sessionToken(),roomID);
    socket.removeAllListeners(channel.listener.chat);
}

export const connectToPeople=(roomID,callback)=>{
    console.log("connecting to people", roomID)
    socket.on(channel.listener.people, activeperson=>callback(null,activeperson));
    socket.emit(channel.provider.people,sessionToken(),roomID);
}

export const disconnectFromPeople=(roomID)=>{
    console.log("disconnecting people",roomID)
    socket.emit(channel.leaver.people,sessionToken(),roomID);
    socket.removeAllListeners(channel.listener.people);
}

export const connectToStream=(roomID,callback)=>{
    console.log("connecting to stream", roomID)
    socket.on(channel.listener.stream, (newstream=null,gonestream=null)=>callback(null, newstream, gonestream));
    socket.emit(channel.provider.stream,sessionToken(),roomID);
}

export const disconnectFromStream=(roomID)=>{
    console.log("disconnecting stream",roomID)
    socket.emit(channel.leaver.stream,sessionToken(),roomID);
    socket.removeAllListeners(channel.listener.stream);
}