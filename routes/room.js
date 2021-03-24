const express = require("express"),
  room = express.Router();

room.post("/create", (req, res) => {
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

room.post("/enter", (req, res) => {
  return res.json({
    success: true,
    room: {
      id: req.body.roomID,
      title: req.body.roomID,
      people: [6, 5, 4, 3, 2, 1],
      chats: [1, 2, 3, 4, 5, 6],
    },
  });
});

room.post("/receive", (req, res) => {
  return res.json({
    success: true,
    rooms: [1, 2, 3, 4, 5, 6],
  });
});

module.exports = room;
