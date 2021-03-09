const express = require("express"),
  { validateUser, validateLogin, handleCors } = require("./re"),
  app = express(),
  { connectToDB, Users } = require("./db"),
  server = require("http").createServer(app);
  (bodyParser = require("body-parser")),
  (cors = require("cors")),
  (bcrypt = require("bcrypt")),
  (io = require("socket.io")(server, {
    cors: {
      origin: handleCors,
    },
  })),
  (jwt = require("jsonwebtoken")),
  (helmet = require("helmet"));

app.use(helmet());
app.use(bodyParser.json());

app.use(
  cors({
    origin: handleCors,
  })
);

const encrypt = async (password) => {
  return await bcrypt.hash(password, 16);
};

io.on("connection", (client) => {
  console.log("connection");
  console.log(client);
  client.on("chatroom", (sessionToken, roomID) => {
    console.log("client is subscribing chatroom ", roomID, sessionToken);
    setInterval(()=>{
      client.emit("newmsg", "lol")
      console.log("loled")
    },1000);
  });
  client.on("people", (sessionToken, roomID) => {
    console.log("client is subscribing people ", roomID, sessionToken);
    setInterval(()=>{
      client.emit("newperson", "lol")
      console.log("loled")
    },1000);
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
          token: jwt.sign(
            {
              id: result._id,
              username: result.name,
              email: result.email,
              verified: true
            },
            "secret"
          ),
        };
      } else {
        data = {
          success: false,
          errors: {
            password: "Wrong credentials",
          },
        };
      }
    } else {
      data = {
        success: false,
        errors: {
          email: "Account not found",
        },
      };
    }

    console.log(data);
    res.json(data);
  });

  app.post("/auth/signup", async (req, res) => {
    if (!validateUser(req.body)) {
      console.log("signup failed");
      return res.json({ success: false });
    }
    let { email, password, username } = req.body;
    let data = {};
    check = await Users().findOne({ email: email });
    if (check) {
      data = {
        success: false,
        errors: {
          email: "Account already exists.",
        },
      };
    } else {
      newpass = await encrypt(password);
      result = await Users().insertOne({
        email: email,
        password: newpass,
        name: username,
      });
      data = {
        success: true,
        token: jwt.sign(
          {
            id: result.ops[0]._id,
            username: result.ops[0].name,
            email: result.ops[0].email,
            verified: true
          },
          "secret"
        ),
      };
    }
    console.log(data);
    res.json(data);
  });

  app.post("/auth/2FA/send",(req,res)=>{
    res.json({success:true})
  })
  app.post("/auth/2FA/verify",(req,res)=>{
    res.json({success:true})
  })
  app.post("/room/create", (req, res) => {
    return res.json({
      success: true,
      room: {
        id: "123456",
        title: req.body.title,
        people: [],
        chats: [],
      },
    });
  });

  app.post("/room/enter", (req, res) => {
    return res.json({
      success: true,
      room: {
        id: req.body.roomID,
        title: req.body.roomID,
        people: [6,5,4,3,2,1],
        chats: [1,2,3,4,5,6],
      },
    });
  });

  app.post("/room/receive", (req, res) => {
    return res.json({
      success: true,
      rooms: [1, 2, 3, 4, 5, 6],
    });
  });

  app.post("/meet/join", (req, res) => {
    console.log(req.body);
    return res.json({
      success: true,
      meet: {
        active: true,
        people: [],
        chats: [],
      },
    });
  });

  app.post("/meet/end", (req, res) => {
    console.log("here");
    return res.json({ success: true });
  });
  const server_port = process.env.PORT || 5000 || 80;
  const server_host = "0.0.0.0" || "localhost";

  server.listen(server_port, server_host, () => {
    console.log(`Server on ${server_host}:${server_port}`);
  });
});
