const express = require("express"),
  self = express.Router(),
  User = require("../models/user");

self.post('/', async (req,res)=>{
  const session = User.checkSession(req.headers.authorization)
  if(!session) return res.json({success:false});
  let user = await User.findByID(session.id);
  return res.json({
    id:user._id,
    username:user.username,
    email:user.email,
    verified:user.verified,
    created:user.created
  });
})

self.post('/update', async (req,res)=>{
  const session = User.checkSession(req.headers.authorization)
  if(!session) return res.json({success:false});
})

module.exports = self;