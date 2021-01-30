import axios from "axios";
// import setAuthToken from "../utils/setAuthToken";
// import jwt_decode from "jwt-decode";

import {
  GET_ERRORS,
  SET_CURRENT_MEET,
  MEET_LOADING
} from "./types";

// import {Key} from "../keys";

// Register User
export const leaveMeeting = (userData) => dispatch => {
  axios
    .post("/meet/end", userData)
    .then(res => {
      sessionStorage.clear();
      dispatch(setCurrentMeet({}))
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};

// Login - get user token
export const joinMeeting = meetData => dispatch => {
  axios
    .post("/meet/join", meetData)
    .then(res => {
      dispatch(setCurrentMeet(res.data))
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
export const setCurrentMeet = meetInfo => {
    return {
      type: SET_CURRENT_MEET,
      payload: meetInfo
    };
  };
  
  // User loading
  export const setMeetLoading = () => {
    return {
      type: MEET_LOADING
    };
  };