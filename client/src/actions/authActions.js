import { setAuthToken } from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { loading, postData } from "./actions";
import { post } from "../paths/post";
import {
  validNewUser,
  validLoginUser,
  validRecoveryInfo,
  valid2FAData,
  isSessionValid,
  isJWTValid,
} from "../utils/validator";
import {
  AUTH_ERRORS,
  INPUT_ERRORS,
  REQ_ERRORS,
  SET_CURRENT_USER,
  CODE_SENT,
  CODE_VERIFIED,
  CODE_EXPIRED,
} from "../utils/dispatchType";
import { Key } from "../utils/keys";
import { Toast } from "../components/elements/Toast";

// Register User
export const registerUser = (userData) => (dispatch) => {
  const result = validNewUser(userData);
  if (!result.isValid) {
    dispatch({
      type: INPUT_ERRORS,
      errors: result.err,
    });
  } else {
    dispatch(loading());
    postData(post.auth.SIGNUP, userData)
      .then((res) => {
        if (res.data.success) {
          const { token } = res.data;
          localStorage.setItem(Key.sessionToken, token);
          setAuthToken(token);
          const decoded = jwt_decode(token);
          dispatch(setUser(decoded));
        } else {
          dispatch({
            type: AUTH_ERRORS,
            errors: res.data.errors,
          });
        }
      })
      .catch((err) => {
        dispatch({
          type: REQ_ERRORS,
          exceptions: err,
        });
      });
  }
};

// Login - get user token
export const loginUser = (userData) => (dispatch) => {
  const result = validLoginUser(userData);
  if (!result.isValid) {
    dispatch({
      type: INPUT_ERRORS,
      errors: result.err,
    });
  } else {
    dispatch(loading());
    postData(post.auth.LOGIN, userData)
      .then((res) => {
        if (res.data.success) {
          const { token } = res.data;
          localStorage.setItem(Key.sessionToken, token);
          setAuthToken(token);
          const decoded = jwt_decode(token);
          dispatch(setUser(decoded));
        } else {
          dispatch({
            type: AUTH_ERRORS,
            errors: res.data.errors,
          });
        }
      })
      .catch((err) => {
        dispatch({
          type: REQ_ERRORS,
          exceptions: err,
        });
      });
  }
};

// Log user out
export const logoutUser = (_) => (dispatch) => {
  setAuthToken(false);
  localStorage.removeItem(Key.sessionToken);
  localStorage.removeItem(Key.tempSessionToken);
  dispatch(setUser());
};

export const send2FACode = (email) => (dispatch) => {
  const result = validRecoveryInfo({ email });
  if (!result.isValid) {
    dispatch({
      type: INPUT_ERRORS,
      errors: result.err,
    });
  } else {
    dispatch(loading());
    postData(post.auth.twofactor.SEND, { email })
      .then((res) => {
        if (res.data.success) {
          dispatch({ type: CODE_SENT });
          setTimeout(() => {
            dispatch({ type: CODE_EXPIRED });
          }, 15*60*1000);
        }
      })
      .catch((e) => {});
  }
};

export const verify2FACode = (email, code) => (dispatch) => {
  const result = valid2FAData({ email, code });
  if (!result.isValid) {
    dispatch({
      type: INPUT_ERRORS,
      errors: result.err,
    });
  } else {
    dispatch(loading());
    postData(post.auth.twofactor.VERIFY, { email, code })
      .then((res) => {
        if (res.data.success){
          const { token } = res.data;
          let data = isJWTValid(token)
          localStorage.setItem(data.temp?Key.tempSessionToken:Key.sessionToken, token);
          setAuthToken(token);
          dispatch(setUser(data));
          dispatch({ type: CODE_VERIFIED });
        }
      })
      .catch((e) => {});
  }
};

export const setRecoveryPassword = (email,newpassword) => (dispatch) => {
  let sessdata = isSessionValid();
  if(!sessdata){
    sessdata = isSessionValid(true);
    if(!sessdata){
      Toast.errorAction('Session Error. Please click here to reload this page.',()=>window.location.reload());
      return null;
    }
  }
  const result = validNewUser({ email, password:newpassword, username:[sessdata.username] });
  console.log(result);
  if (!result.isValid) {
    dispatch({
      type: INPUT_ERRORS,
      errors: result.err,
    });
  } else {
    dispatch(loading());
    postData(post.auth.RECPASS, { email, newpassword })
      .then((res) => {
        console.log(res.data);
        Toast.show(res.data.success)
        if (res.data.success) {
          setAuthToken(false);
          localStorage.removeItem(Key.sessionToken);
          localStorage.removeItem(Key.tempSessionToken);
          dispatch(setUser());
        }
        else Toast.error(res.data.error);
      })
      .catch((e) => {Toast.error(e)});
  }
};

// Set logged in user
export const setUser = (decoded = {}) => ({
  type: SET_CURRENT_USER,
  payload: decoded,
});
