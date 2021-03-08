const { CORSORIGINS, CORSBETA } = require("./config");

class AuthUser {
  constructor() {
    this.passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,50}$/;
    this.emailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
    this.nameRegex = /[A-Za-z]{2,100}/;
  }

  checkPass = (password) => this.passRegex.test(password);

  checkEmail = (email) => email.length > 4 && this.emailRegex.test(email);

  checkName = (name) => this.nameRegex.test(name);

  validateUser = (data = { email: String, password: String, name: String }) =>
    this.checkEmail(data.email) &&
    this.checkName(data.name) &&
    this.checkPass(data.password);

  validateLogin = (data = { email: String, password: String }) =>
    this.checkEmail(data.email) && data.password.length;

  handleCors = (origin, callback) =>
    callback(
      (CORSORIGINS.indexOf(origin) !== -1 || CORSBETA.test(origin) || !origin)
        ?null
        :new Error(`${origin} Not allowed by CORS`),
      (CORSORIGINS.indexOf(origin) !== -1 || CORSBETA.test(origin) || !origin)
    );
}

module.exports = new AuthUser();
