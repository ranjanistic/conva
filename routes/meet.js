const express = require("express"),
  meet = express.Router(),
  User = require("../models/user"),
  Meet = require("../models/meet");

meet.post("/join", async(req, res) => {
  const session = User.checkSession(req.headers.authorization);
  if (!session) return res.json({ success: false });
  console.log(req.body)
  let meet = await Meet.join(req.body.roomID,session.id)
  return res.json({
    success: meet?true:false,
    meet
  });
});

meet.post("/leave", (req, res) => {
  const session = User.checkSession(req.headers.authorization);
  if (!session) return res.json({ success: false });
  return res.json({success:true});
});

module.exports = meet;
