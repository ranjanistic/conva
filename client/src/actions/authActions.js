import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING
} from "./types";
import {Key} from "../keys";

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/auth/signup", userData)
    .then(res => {
      if(res.data.success){
        const { token } = res.data;
        localStorage.setItem(Key.sessionToken, token);
        setAuthToken(token);
        console.log(token);
        const decoded = jwt_decode(token);
        console.log(decoded);
        dispatch(setCurrentUser(decoded));
      } else {
        alert("NO");
      }
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};

// Login - get user token
export const loginUser = userData => dispatch => {
  axios
    .post("/auth/login", userData)
    .then(res => {
      if(res.data.success){
        const { token } = res.data;
        localStorage.setItem(Key.sessionToken, token);
        setAuthToken(token);
        console.log(token);
        const decoded = jwt_decode(token);
        console.log(decoded);
        dispatch(setCurrentUser(decoded));
      } else {
        alert("NO");
      }
    })
    .catch(err =>{
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    });
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// Log user out
export const logoutUser = _ => dispatch => {
  localStorage.removeItem(Key.sessionToken);
  setAuthToken(false);
  dispatch(setCurrentUser({}));
};