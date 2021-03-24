const express = require("express"),
  auth = express.Router(),
  {SESSIONKEY:sessionSecret} = require("../config"),
  { validateUser, validateLogin } = require("../validate"),
  { Users } = require("../db"),
  bcrypt = require("bcrypt"),
  jwt = require("jsonwebtoken");

const encrypt = async (password) => await bcrypt.hash(password, 10);

auth.post("/login", async (req, res) => {
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
            verified: true,
          },
          sessionSecret
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

auth.post("/signup", async (req, res) => {
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
          verified: true,
        },
        sessionSecret
      ),
    };
  }
  console.log(data);
  res.json(data);
});

auth.post("/2FA/send", (req, res) => {
  res.json({ success: true });
});
auth.post("/2FA/verify", async (req, res) => {
  console.log(req.headers);
  //if not req.headers.authorization, assign temporary token.
  const { email, code } = req.body;
  let result = await Users().findOne({ email });
  res.json({
    success: true,
    token: jwt.sign(
      {
        id: result._id,
        username: result.name,
        email: result.email,
        verified: true,
        temp: true,
      },
      sessionSecret
    ),
  });
});

auth.post("/setrecoverypass", async (req, res) => {
  console.log(req.body);
  //if not req.headers.authorization, don't.
  const { newpassword } = req.body;
  res.json({ success: true });
});

module.exports = auth;