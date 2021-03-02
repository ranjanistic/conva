import { Key } from "./../keys";
import jwt_decode from "jwt-decode";

export const constant = {
  nothing: "",
  regex: {
    name: /[A-Za-z]{2,100}/,
    email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    pass: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,50}$/,
    link: /^((https):\/\/)+[a-z.]+(\/room\/)+[a-z0-9A-Z-]/,
  },
  weekdays: [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ],
};

export const inputType = {
  name: "name",
  text: "text",
  email: "email",
  title: "title",
  link: "link",
  password: "password",
  nonempty: "nonempty",
  username: "username",
  phone: "phone",
  number: "number",
  naturalnumber: "greaterthanzero",
  wholenumber: "nonnegative",
  weekday: "weekday",
};

export const errorByType = {
  [inputType.name]: "There has to be a proper name.",
  [inputType.title]: "There has to be a proper title.",
  [inputType.link]: "Invalid meeting link.",
  [inputType.email]: "Invalid email address.",
  [inputType.phone]: "Not a valid number",
  [inputType.number]: "Not a valid number",
  [inputType.naturalnumber]: "Must be greater than zero",
  [inputType.wholenumber]: "Must be a positive number",
  [inputType.password]: "Weak password. Must include special chars, upper & lowercase letters with numbers.",
  [inputType.weekday]: "Invalid weekday",
  [inputType.nonempty]: "This can't be empty.",
};

export const checkValidityByType = {
  [inputType.name]: (value = String) =>
    isStringValid(String(value).trim()) &&
    constant.regex.name.test(String(value)),
  [inputType.user]: (value = String) =>
    isStringValid(String(value).trim(), inputType.name),
  [inputType.title]: (value = String) =>
    isStringValid(String(value).trim(), inputType.name),
  [inputType.email]: (value = String) =>
    String(value).length <= 320 &&
    constant.regex.email.test(String(value).toLowerCase()),
  [inputType.phone]: (value = String) =>
    !isNaN(value) && isStringValid(String(value).trim()),
  [inputType.number]: (value = String) =>
    !isNaN(value) && isStringValid(String(value).trim()),
  [inputType.naturalnumber]: (value = String) =>
    isStringValid(String(value).trim(), inputType.number) && Number(value) > 0,
  [inputType.wholenumber]: (value = String) =>
    isStringValid(String(value).trim(), inputType.number) && Number(value) >= 0,
  [inputType.password]: (value = String) =>
    String(value).length <= 1000 &&
    constant.regex.pass.test(String(value)) &&
    String(value).length >= 8,
  [inputType.weekday]: (value = String) =>
    constant.weekdays.includes(value.toLowerCase()),
  [inputType.nonempty]: (value = String) =>
    value != null && value !== constant.nothing,
};

export const getErrorByType = (type = inputType.nonempty) =>
  errorByType[type] ? errorByType[type] : errorByType[inputType.nonempty];

export const isStringValid = (value = String, type = inputType.nonempty) =>
  checkValidityByType[type]
    ? checkValidityByType[type](value)
    : checkValidityByType[inputType.nonempty](value);


export const isJWTValid=(token)=>{
  try {
    let decoded = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime?false:decoded
  } catch {
    return false;
  }
}

export const isSessionValid = () => {
  const token = localStorage.getItem(Key.sessionToken);
  if (!token) return false;
  return isJWTValid(token);
};

export const validNewUser = (
  user = { email: String, password: String, username: String }
) => ({
  isValid:
    isStringValid(user.username, inputType.name) &&
    isStringValid(user.email, inputType.email) &&
    isStringValid(user.password, inputType.password),
  err: {
    username: isStringValid(user.username, inputType.name)
      ? 0
      : getErrorByType(inputType.name),
    email: isStringValid(user.email, inputType.email)
      ? 0
      : getErrorByType(inputType.email),
    password: isStringValid(user.password, inputType.password)
      ? 0
      : getErrorByType(inputType.password),
  },
});

export const validLoginUser = (user = { email: String, password: String }) => ({
  isValid:
    isStringValid(user.email, inputType.email) && isStringValid(user.password),
  err: {
    email: isStringValid(user.email, inputType.email)
      ? 0
      : getErrorByType(inputType.email),
    password: isStringValid(user.password)
      ? 0
      : getErrorByType(inputType.nonempty),
  },
});

export const validJoinMeetingData = (data = { roomID: String }) => ({
  isValid: isStringValid(data.roomID, inputType.nonempty),
  err: {
    title: isStringValid(data.roomID, inputType.nonempty)
      ? 0
      : getErrorByType(inputType.nonempty),
  },
});

export const validRoomCreateData = (data = { title: String }) => ({
  isValid: isStringValid(data.title, inputType.title),
  err: {
    title: isStringValid(data.title, inputType.title)
      ? 0
      : getErrorByType(inputType.title),
  },
});

export const validRoomEntryData = (data = { id: String }) => ({
  isValid: isStringValid(data.id, inputType.nonempty),
  err: {
    id: isStringValid(data.id, inputType.nonempty) ? 0 : getErrorByType(),
  },
});

export const filterLoginUser = (data = { email: String, password: String }) => {
  return {
    email: String(data.email) || "",
    password: String(data.password) || "",
  };
};

export const filterSignupUser = (
  data = { username: String, email: String, password: String }
) => ({
  username: String(data.username) || "",
  email: String(data.email) || "",
  password: String(data.password) || "",
});

export const filterMeetJoinData = (data = { id: String }) => ({
  roomID: String(data.id),
});

export const filterRoomCreateData = (data = {}) => ({
  title: String(data.title),
});

/**
 * Checks if any key's value in given data param is empty or null or 0, and removes that key.
 * @returns JSON object with only those keys from param data which have a value.
 */
export const filterKeys = (data = {}) =>
  Object.keys(data).length
    ? ((_) => {
        Object.keys(data).forEach((key) => {
          if (data[key] !== false) {
            if (!data[key]) delete data[key];
          }
        });
        return data;
      })()
    : {};

/**
 * Live input field validation
 */
export const validateTextField = (
  textfield,
  onError = (_) => {},
  type = inputType.nonempty,
  afterValidAction = (_) => {}
) => {
  if (!isStringValid(textfield.value, type)) {
    textfield.focus();
    textfield.oninput = (_) => {
      if (textfield.value !== constant.nothing) {
        validateTextField(textfield, onError, type, (_) => {
          afterValidAction();
        });
      } else {
        textfield.oninput = (_) => {
          onError();
        };
        textfield.onchange = (_) => {
          if (isStringValid(textfield.value, type)) {
            afterValidAction();
          } else {
            onError();
            validateTextField(textfield, onError, type, (_) => {
              afterValidAction();
            });
          }
        };
      }
    };
  } else {
    textfield.onchange = (_) => {
      if (isStringValid(textfield.value, type)) {
        afterValidAction();
      } else {
        onError();
        validateTextField(textfield, onError, type, (_) => {
          afterValidAction();
        });
      }
    };
  }
};
