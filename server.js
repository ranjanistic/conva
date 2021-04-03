const express = require("express"),
  app = express(),
  { handleCors, sessionTokenValid } = require("./validate"),
  { connectToDB } = require("./db"),
  cors = require("cors"),
  helmet = require("helmet"),
  http = require("http"),
  io = require("socket.io"),
  https = require("https"),
  fs = require("fs");

app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: handleCors,
  })
);

const channel = {
  listener: {
    chat: "newmsg",
    people: "newperson",
    stream: "newstream",
  },
  provider: {
    chat: "chatroom",
    people: "people",
    stream: "stream",
  },
};

const tryHttps = (afterTry) => {
  const server = ((_) => {
    try {
      const key = fs.readFileSync("./localhost-key.pem"),
        cert = fs.readFileSync("./localhost.pem");
      console.log("https");
      return https.createServer({ key, cert }, app);
    } catch (e) {
      console.log("http");
      return http.createServer(app);
    }
  })();
  return afterTry(server, io(server, {
    cors: {
      origin: handleCors,
    },
  }));
};

connectToDB((err, dbname) => {
  if (err) return console.log(err);
  console.log(`Connected to ${dbname}`);

  app.use("/auth", require("./routes/auth"));
  app.use("/room", require("./routes/room"));
  app.use("/meet", require("./routes/meet"));
  app.use("/self", require("./routes/self"));

  app.get("/", (req, res) => {
    res.send(
      'Conva Backend. Status: Good. Access Conva <a href="https://convameet.web.app">here</a>.'
    );
  });

  const server_port = process.env.PORT || 5000 || 80,
    server_host = "0.0.0.0" || "localhost";

  tryHttps((server, socket) => {
    server.listen(server_port, server_host, () => {
      console.log(`Server on ${server_host}:${server_port}`);
    });
    socket.on("connection", (client) => {
      console.log("socket connected");
      client.on(channel.provider.chat, (sessionToken, roomID) => {
        if (sessionTokenValid(sessionToken)) {
          console.log("Listening to chats of", roomID);
          client.emit(channel.listener.chat, "First Message!");
        } else console.log("Invalid session token", sessionToken);
      });
      client.on(channel.provider.people, (sessionToken, roomID) => {
        if (sessionTokenValid(sessionToken)) {
          console.log("Listening to people of", roomID);
          client.emit(channel.listener.people, "Welcome!");
        } else console.log("Invalid session token", sessionToken);
      });
      client.on(channel.provider.stream, (sessionToken, roomID) => {
        if (sessionTokenValid(sessionToken)) {
          console.log("Listening to stream of", roomID);
        } else console.log("Invalid session token", sessionToken);
      });
    });
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
