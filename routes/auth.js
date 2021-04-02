const express = require("express"),
  auth = express.Router(),
  User = require("../models/user");

auth.post("/login", async (req, res) => {
  let testuser = User.filterExisting(req.body);
  if (!testuser) return res.json({ success: false });

  let user = await User.findByEmail(testuser.email);
  if (!user)
    return res.json({
      success: false,
      errors: {
        email: "Account not found",
      },
    });

  user = await User.verifyCreds(testuser);
  if (!user)
    return res.json({
      success: false,
      errors: {
        password: "Wrong credentials",
      },
    });
  return res.json({
    success: true,
    token: User.createSession(user, !user.verified),
  });
});

auth.post("/signup", async (req, res) => {
  const user = await User.filterNew(req.body);
  if (!user) return res.json({ success: false });
  const existing = await User.findByEmail(user.email);
  if (existing)
    return res.json({
      success: false,
      errors: {
        email: "Account already exists.",
      },
    });
  const newuser = await User.createNew(user);
  if (!newuser) return res.json({ success: false });
  return res.json({
    success: true,
    token: User.createSession(user, newuser.verified),
  });
});

auth.post("/2FA/send", async (req, res) => {
  const session = User.checkSession(req.headers.authorization);
  const user = session
    ? await User.findByID(session.id)
    : await User.findByEmail(req.body.email);
  if (!user) return res.json({ success: false });
  const sent = await User.sendOTP(user._id);
  res.json({ success: sent, expireMillis:15*60*1000 });
});

auth.post("/2FA/verify", async (req, res) => {
  const { email, code } = req.body;
  let result = await User.findByEmail(email);
  
  if (!result)
    return res.json({
      success: false,
    });

  const otpverified = await User.verifyOTP(result._id, code);
  result = await User.findByEmail(email);
  return res.json({
    success: otpverified,
    token: otpverified ? User.createSession(result, !result.verified) : null,
  });
});

auth.post("/setrecoverypass", async (req, res) => {
  if (!User.checkSession(req.headers.authorization))
    return res.json({ success: false });

  const { newpassword } = req.body;
  res.json({ success: true });
});

module.exports = auth;
