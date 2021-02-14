import { postData } from "./requests";
import { post } from "../paths/post";
import { validJoinMeetingData } from "./validator";
import { REQ_ERRORS, MEET_JOINED, MEET_LEAVED, LOADING,INPUT_ERRORS } from "./types";

export const joinMeeting = (meetData) => (dispatch) => {
  const result = validJoinMeetingData(meetData);
  if (!result.isValid) {
    dispatch({
      type: INPUT_ERRORS,
      errors: result.err,
    });
  } else {
    dispatch(loading());
    postData(post.JOINMEET, meetData)
      .then((res) => {
        dispatch(joinedMeet(res.data.room));
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

// Set logged in user
const joinedMeet = (meetData) => {
  return {
    type: MEET_JOINED,
    payload: meetData,
  };
};

// Set logged in user
const leftMeet = (_) => {
  return {
    type: MEET_LEAVED,
  };
};

// loading
const loading = () => {
  return {
    type: LOADING,
  };
};
