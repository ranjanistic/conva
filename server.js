const express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  bodyParser = require('body-parser'),
  // io = require('socket.io')(server),
  jwt = require("jsonwebtoken"),
  helmet = require("helmet");

app.use(helmet());
app.use(bodyParser.json());

// io.on('connection', (socket) => {
//   socket.on('join', (roomId) => {
//     console.log(roomId);
//     console.log(io.sockets.adapter.rooms);
//     let roomClients = io.sockets.adapter.rooms[roomId] || { length: 0 }
//     console.log(roomClients);
//     const numberOfClients = roomClients.length

    // These events are emitted only to the sender socket.
//     if (numberOfClients === 0) {
//       console.log(`Creating room ${roomId} and emitting room_created socket event`)
//       socket.join(roomId)
//       socket.emit('room_created', roomId)
//       io.sockets.adapter.rooms[roomId] = {length: numberOfClients+1};
//     } else if (numberOfClients === 1) {
//       console.log(`Joining room ${roomId} and emitting room_joined socket event`)
//       socket.join(roomId)
//       socket.emit('room_joined', roomId)
//     }
    // } else {
    //   console.log(`Can't join room ${roomId}, emitting full_room socket event`)
    //   socket.emit('full_room', roomId)
    // }
//   })

  // These events are emitted to all the sockets connected to the same room except the sender.
//   socket.on('start_call', (roomId) => {
//     console.log(`Broadcasting start_call event to peers in room ${roomId}`)
//     socket.broadcast.to(roomId).emit('start_call')
//   })
//   socket.on('webrtc_offer', (event) => {
//     console.log(`Broadcasting webrtc_offer event to peers in room ${event.roomId}`)
//     socket.broadcast.to(event.roomId).emit('webrtc_offer', event.sdp)
//   })
//   socket.on('webrtc_answer', (event) => {
//     console.log(`Broadcasting webrtc_answer event to peers in room ${event.roomId}`)
//     socket.broadcast.to(event.roomId).emit('webrtc_answer', event.sdp)
//   })
//   socket.on('webrtc_ice_candidate', (event) => {
//     console.log(`Broadcasting webrtc_ice_candidate event to peers in room ${event.roomId}`)
//     socket.broadcast.to(event.roomId).emit('webrtc_ice_candidate', event)
//   })
// })

// app.use("/auth",require('routes/auth.js'))
// app.use("/room",require('routes/room.js'))

app.post("/auth/login",(req,res)=>{
  console.log(req.body);
  let data = {
    success:true,
    token:jwt.sign({
      id: "23874923847",
      name: "Priyanshu"
    },'secret'),
  };
  console.log(data);
  res.json(data);
});

app.post("/auth/signup",(req,res)=>{
  console.log(req.body);
  let data = {
    success:true,
    token:jwt.sign({
      id: "23874923847",
      name: "Priyanshu"
    },'secret'),
  };
  console.log(data);
  res.json(data);
});

const server_port = process.env.PORT|| 5000 || 80;
const server_host = '0.0.0.0' || 'localhost';

server.listen(server_port, server_host, ()=>{ 
  console.log(`Server on ${server_port}`);
});

