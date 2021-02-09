const constant = {
  nothing:'',
  emailRegex : /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  passRegex : /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,50}$/,
  weekdays:[
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ]
}
const err = {
  input: {
    common: "This can't be empty.",
    email: "Invalid email address.",
    username: "Something's not quite right with your name.",
    newpassword: "Password is too weak! Go for something stronger.",
  },
};
export const validPass = (password) => {
  return constant.passRegex.test(password);
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

export const inputType = {
  name : "name",
  text : "text",
  email : "email",
  password : "password",
  nonempty : "nonempty",
  username : "username",
  phone : "phone",
  number : "number",
  naturalnumber : "greaterthanzero",
  wholenumber : "nonnegative",
  weekday : "weekday",
}

export const getErrorByType=(type = inputType.nonempty)=>{
  switch (type) {
    case inputType.name: return "There has to be a name.";
    case inputType.email: return "Invalid email address.";
    case inputType.phone:return "Not a valid number";
    case inputType.number:return "Not a valid number";
    case inputType.naturalnumber:return "Must be greater than zero";
    case inputType.wholenumber:return "Must be a positive number";
    case inputType.password:return "Weak password, try something else.";
    case inputType.weekday:return "Invalid weekday";
    default: return "This can't be empty";
  }
}

export const validateTextField = (
  textfield,
  onError=_=>{},
  type = inputType.nonempty,
  afterValidAction = (_) => {},
) => {
  // let error = getErrorByType(type);
  // onError();
  if (!isStringValid(textfield.value, type)) {
    textfield.focus();
    textfield.oninput=(_) => {
      if (textfield.value !== constant.nothing) {
        validateTextField(
          textfield,
          onError,
          type,
          (_) => {
            afterValidAction();
          },
        );
      } else {
        textfield.oninput=(_) => {
          onError();
        };
        textfield.onchange=(_) => {
          if (isStringValid(textfield.value, type)) {
            afterValidAction();
          } else {
            onError();
            validateTextField(
              textfield,
              onError,
              type,
              (_) => {
                afterValidAction();
              },
            );
          }
        };
      }
    };
  } else {
    textfield.onchange=(_) => {
      if (isStringValid(textfield.value, type)) {
        afterValidAction();
      } else {
        onError();
        validateTextField(
          textfield,
          onError,
          type,
          (_) => {
            afterValidAction();
          },
        );
      }
    };
  }
};

export const isStringValid = (
  value = String,
  type = inputType.nonempty,
) => {
  switch (type) {
    case inputType.name:
      return isStringValid(String(value).trim());
    case inputType.email:
      return String(value).length<=320&&constant.emailRegex.test(String(value).toLowerCase());
    case inputType.phone:
      return !isNaN(value) && isStringValid(String(value).trim());
    case inputType.number:
      return !isNaN(value) && isStringValid(String(value).trim());
    case inputType.naturalnumber:
      return (
        isStringValid(String(value).trim(), inputType.number) &&
        Number(value) > 0
      );
    case inputType.wholenumber:
      return (
        isStringValid(String(value).trim(), inputType.number) &&
        Number(value) >= 0
      );
    case inputType.password:
      return String(value).length<=1000
      // &&constant.passRegex.test(String(value))
      &&String(value).length>=8;
    case inputType.username:
      return isStringValid(String(value).trim());
    case inputType.weekday:
      return constant.weekdays.includes(value.toLowerCase());
    default:
      return value != null && value !== constant.nothing;
  }
};
