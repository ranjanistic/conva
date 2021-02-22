import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import {postData} from './requests'
import {post} from '../paths/post';
import { validNewUser,validLoginUser } from "./validator";
import {
  AUTH_ERRORS,
  INPUT_ERRORS,
  REQ_ERRORS,
  SET_CURRENT_USER,
  LOADING,
} from "./types";
import { Key } from "../keys";

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
    postData(post.auth.LOGIN,userData).then((res)=>{
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
    }).catch((err)=>{
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
  dispatch(setUser({}));
};

// Set logged in user
export const setUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

// User loading
const loading = () => {
  return {
    type: LOADING,
  };
};
