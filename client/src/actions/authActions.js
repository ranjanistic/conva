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
    dispatch(setLoading());
    postData(post.SIGNUP, userData)
      .then((res) => {
        if (res.data.success) {
          const { token } = res.data;
          localStorage.setItem(Key.sessionToken, token);
          setAuthToken(token);
          const decoded = jwt_decode(token);
          dispatch(setCurrentUser(decoded));
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
    dispatch(setLoading());
    postData(post.LOGIN,userData).then((res)=>{
      if (res.data.success) {
        const { token } = res.data;
        localStorage.setItem(Key.sessionToken, token);
        setAuthToken(token);
        const decoded = jwt_decode(token);
        dispatch(setCurrentUser(decoded));
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

// Set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

// User loading
export const setLoading = () => {
  return {
    type: LOADING,
  };
};

// Log user out
export const logoutUser = (_) => (dispatch) => {
  localStorage.removeItem(Key.sessionToken);
  setAuthToken(false);
  dispatch(setCurrentUser({}));
};
