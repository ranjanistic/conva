const express = require("express"),
  meet = express.Router();

meet.post("/join", (req, res) => {
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

meet.post("/end", (req, res) => {
  return res.json({ success: true });
});

module.exports = meet;
