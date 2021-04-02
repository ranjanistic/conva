const  Joi = require("joi"),
  { Users } = require("../db"),
  { SESSIONKEY } = require("../config"),
  bcrypt = require("bcrypt"),
  {
    encrypt,
    createSessionToken,
    passRegex,
    tokenValid,
    validObjectId,
  } = require("../validate");

class User {
  filterNew(user = { email: String, password: String, username: String }) {
    const { error, value } = Joi.object({
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      password: Joi.string().pattern(passRegex).required(),
      username: Joi.string().min(3).max(30).required(),
    }).validate(user);
    if (error) return false;
    return value;
  }

  filterExisting(user = { email: String, password: String }) {
    const { error, value } = Joi.object({
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      password: Joi.string().required().min(1),
    }).validate(user);
    if (error) return false;
    return value;
  }

  async createNew(
    user = { email: String, password: String, username: String }
  ) {
    const valid = await this.filterNew(user);
    if (!valid) return false;
    valid.password = await encrypt(valid.password);
    user = valid;
    const res = await Users().insertOne({
      email: user.email,
      password: user.password,
      username: user.username,
      verified: false,
      created: Date.now(),
      twofa: false,
      otp: null,
    });
    return res.insertedCount===1 ? res.ops[0] : false;
  }

  async findByEmail(email) {
    const { error, value } = Joi.string().email().validate(email);
    if (error) return false;
    email = value;
    const res = await Users().findOne({ email });
    return res ? res : false;
  }

  async findByID(_id) {
    _id = validObjectId(_id);
    if (!_id) return false;
    const res = await Users().findOne({ _id });
    return res ? res : false;
  }

  async verifyCreds(testuser) {
    testuser = this.filterExisting(testuser);
    if (!testuser) return false;
    const result = await this.findByEmail(testuser.email);
    if(!result) return false;
    const checked = await bcrypt.compare(testuser.password, result.password);
    return !checked ? false : result;
  }

  async sendOTP(_id) {
    _id = validObjectId(_id);
    if (!_id) return false;
    const user = await this.findByID(_id);
    if (!user) return false;
    return true;
    let done = await Users().findOneAndUpdate(
        { email: user.email },
        { $set: { otp: "someotp" } }
    );
    // email the same otp
    return done.ok?true:false;
  }

  async verifyOTP(_id, code) {
    _id = validObjectId(_id);
    if (!_id) return false;
    const user = await this.findByID(_id);
    if (!user) return false;
    let done = await Users().findOneAndUpdate(
      { email: user.email },
      { $set: { verified: true } }
    );
    return done.ok?true:false;
    if (user.otp === code) {
      let done = await Users().findOneAndUpdate(
        { email: user.email },
        { $set: { verified: true } }
      );
      return done.ok?true:false;
    }
  }

  createSession(user, temp = false) {
    return createSessionToken({
      id: user._id,
      username: user.username,
      email: user.email,
      verified: user.verified,
      temp,
    });
  }

  checkSession(token) {
    return tokenValid(token, SESSIONKEY);
  }
}

module.exports = new User();
