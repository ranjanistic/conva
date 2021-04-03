const express = require("express"),
  room = express.Router(),
  User = require("../models/user"),
  Room = require("../models/room");

room.post("/create", async (req, res) => {
  const session = User.checkSession(req.headers.authorization);
  if (!session) return res.json({ success: false });
  const room = await Room.createNew({
    title: req.body.title,
    adminID: session.id,
  });
  return res.json({
    success: room?true:false,
    room,
  });
});

room.post("/enter", async (req, res) => {
  const session = User.checkSession(req.headers.authorization);
  if (!session) return res.json({ success: false });
  const room = await Room.getByIDIfUser(req.body.roomID,session.id)
  return res.json({success: room?true:false,room});
});

room.post("/receive", async(req, res) => {
  const session = User.checkSession(req.headers.authorization);
  if (!session) return res.json({ success: false });
  const rooms = await Room.getListByUserID(session.id)
  return res.json({
    success: true,
    rooms
  });
});

room.post("/leave", async(req, res) => {
  const session = User.checkSession(req.headers.authorization);
  if (!session) return res.json({ success: false });
  const left = await Room.removePerson(req.body.roomID,session.id)
  return res.json({success: left?true:false});
});

room.post("/remove", async(req, res) => {
  const session = User.checkSession(req.headers.authorization);
  if (!session) return res.json({ success: false });
  const removed = await Room.removePerson(req.body.roomID,req.body.personID, req.body.block)
  return res.json({success: removed?true:false});
});

module.exports = room;
