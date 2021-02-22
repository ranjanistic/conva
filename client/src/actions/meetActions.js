import { postData } from "./requests";
import { post } from "../paths/post";
import { validJoinMeetingData } from "./validator";
import { REQ_ERRORS, MEET_JOINED, MEET_LEFT, LOADING,INPUT_ERRORS } from "./types";

export const joinMeeting = (meetData) => (dispatch) => {
  console.log(meetData);
  const result = validJoinMeetingData(meetData);
  if (!result.isValid) {
    dispatch({
      type: INPUT_ERRORS,
      errors: result.err,
    });
  } else {
    dispatch(loading());
    postData(post.meet.JOIN, meetData)
      .then((res) => {
        console.log(res);
        dispatch(joinedMeet(res.data.meet));
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: REQ_ERRORS,
          payload: err.response.data,
        });
      });
  }
};

export const leaveMeeting = (userData) => (dispatch) => {
  dispatch(loading());
  postData(post.meet.END, userData)
    .then((res) => {
      console.log(res);
      if(res.data.success){
        sessionStorage.clear();
        dispatch(leftMeet());
      }
    })
    .catch((err) =>
      dispatch({
        type: REQ_ERRORS,
        payload: err,
      })
    );
};

// Set logged in user
const joinedMeet = (meetData) => {
  return {
    type: MEET_JOINED,
    payload: meetData,
  };
};

// Set logged in user
const leftMeet = (_) => {
  console.log("leaving...")
  return {
    type: MEET_LEFT,
  };
};

// loading
const loading = () => {
  return {
    type: LOADING,
  };
};
