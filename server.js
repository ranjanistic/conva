const express = require("express"),
  app = express(),
  { handleCors } = require("./validate"),
  { connectToDB } = require("./db"),
  server = require("http").createServer(app),
  cors = require("cors"),
  bodyParser = require("body-parser"),
  helmet = require("helmet"),
  io = require("socket.io")(server, {
    cors: {
      origin: handleCors,
    },
  });

app.use(helmet());
app.use(bodyParser.json());
app.use(cors({
  origin: handleCors,
}));

connectToDB((err, dbname) => {
  if (err) return console.log(err);
  console.log(`Connected to ${dbname}`);

  app.use("/auth", require("./routes/auth"));
  app.use("/room", require("./routes/room"));
  app.use("/meet", require("./routes/meet"));

  app.get("/", (req, res) => {
    res.send("Conva Backend. Status: Good");
  });

  const server_port = process.env.PORT || 5000 || 80;
  const server_host = "0.0.0.0" || "localhost";

  server.listen(server_port, server_host, () => {
    console.log(`Server on ${server_host}:${server_port}`);
  });
});


io.on("connection", (client) => {
  console.log("connection");
  console.log(client);
  client.on("chatroom", (sessionToken, roomID) => {
    console.log("client is subscribing chatroom ", roomID, sessionToken);
    setInterval(() => {
      client.emit("newmsg", "lol");
      console.log("loled");
    }, 1000);
  });
  client.on("people", (sessionToken, roomID) => {
    console.log("client is subscribing people ", roomID, sessionToken);
    setInterval(() => {
      client.emit("newperson", "lol");
      console.log("loled");
    }, 1000);
  });
});
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
