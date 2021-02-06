const { validateUser, validateLogin } = require('./re');

const express = require('express'),
  app = express(),
  { connectToDB, Users } = require("./db"),
  server = require('http').createServer(app)
  bodyParser = require('body-parser'),
  cors = require("cors"),
  bcrypt = require('bcrypt'),
  // io = require('socket.io')(server),
  jwt = require("jsonwebtoken"),
  helmet = require("helmet");

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());

const encrypt = async (password) => {
  return await bcrypt.hash(password, 16);
}

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

connectToDB((err, dbname) => {

  if (err) {
    return console.log(err);
  }

  console.log(`Connected to ${dbname}`);

  app.get("/", (req, res) => {
    res.send("Conva Backend.");
  });

  app.post("/auth/login", async (req, res) => {

    if (!validateLogin(req.body)) {
      console.log("validation failed");
      return res.json({ success: false });
    }

    const { email, password } = req.body;

    let data = {};


    result = await Users().findOne({ email: email });
    if (result) {
      comparison = await bcrypt.compare(password, result.password);
      if (comparison) {
        data = {
          success: true,
          token: jwt.sign({
            id: result._id,
            name: result.name,
          }, 'secret'),
        };
      }
    }

    else {
      data = {
        success: false,
        token: null,
      }
    }

    console.log(data);
    res.json(data);
  });

  app.post("/auth/signup", async (req, res) => {
    if (!validateUser(req.body)) {
      console.log("signup failed");
      return res.json({ success: false });
    }
    let { email, password, name } = req.body;
    let data = {};
    check = await Users().findOne({ email: email });
    if (check) {
      data = {
        success: false,
        token: null,
      }

    }
    else {

      newpass = await encrypt(password);
      result = await Users().insertOne({
        email: email,
        password: newpass,
        name: name
      });

      data = {
        success: true,
        token: jwt.sign({
          id: result.ops[0]._id,
          name: result.ops[0].name
        }, 'secret'),
      };
    }
    console.log(data);
    res.json(data);
  });

  app.post("/meet/end", (req, res) => {
    console.log("here");
    return res.json({ success: true });
  })
  const server_port = process.env.PORT || 5000 || 80;
  const server_host = '0.0.0.0' || 'localhost';

  server.listen(server_port, server_host, () => {
    console.log(`Server on ${server_host}:${server_port}`);
  });

});