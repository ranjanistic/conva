const err = {
  input: {
    common: "This can't be empty.",
    email: "Invalid email address.",
    username: "Something's not quite right with your name.",
    newpassword: "Password is too weak! Go for something stronger.",
  },
};
export const validPass = (password) => {
  let passRe = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,50}$/;
  return passRe.test(password);
};

export const validEmail = (email) => {
  let userRE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
  return email.length > 4 && userRE.test(email);
};
export const validUsername = (name) => {
  let nameRe = /[A-Za-z]{2,100}/;
  return nameRe.test(name);
};

export const validNewUser = (
  user = { email: String, password: String, username: String }
) => {
  return {
    isValid:
      validEmail(user.email) &&
      validUsername(user.name) &&
      validPass(user.password),
    err: {
      email: !validEmail(user.email) ? err.input.email : 0,
      password: !validPass(user.password) ? err.input.newpassword : 0,
      username: !validUsername(user.username) ? err.input.username : 0,
    },
  };
};

export const validLoginUser = (user = { email: String, password: String }) => {
  return {
    isValid:
      validEmail(user.email) && user.password.length>0,
    err: {
      email: !validEmail(user.email) ? err.input.email : 0,
      password: user.password.length===0 ? err.input.common : 0,
    },
  };
};
