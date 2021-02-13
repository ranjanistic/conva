import { postData } from "./requests";
import { post } from "../paths/post";
import { REQ_ERRORS, MEET_JOINED, MEET_LEAVED, LOADING } from "./types";

// Register User
export const leaveMeeting = (userData) => (dispatch) => {
  dispatch(loading());
  postData(post.ENDMEET, userData)
    .then((res) => {
      sessionStorage.clear();
      dispatch(leftMeet());
    })
    .catch((err) =>
      dispatch({
        type: REQ_ERRORS,
        payload: err,
      })
    );
};

// Login - get user token
export const joinMeeting = (meetData) => (dispatch) => {
  dispatch(loading());
  postData(post.JOINMEET, meetData)
    .then((res) => {
      dispatch(joinedMeet(res.data));
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: REQ_ERRORS,
        payload: err.response.data,
      });
    });
};

// Set logged in user
export const joinedMeet = (meetData) => {
  return {
    type: MEET_JOINED,
    payload: meetData,
  };
};

// Set logged in user
export const leftMeet = (_) => {
  return {
    type: MEET_LEAVED,
  };
};

// loading
export const loading = () => {
  return {
    type: LOADING,
  };
};
