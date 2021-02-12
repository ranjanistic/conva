import {postData} from './requests';
import {post} from '../paths/post';
import {
  REQ_ERRORS,
  SET_CURRENT_MEET,
  MEET_LOADING
} from "./types";

// import {Key} from "../keys";

// Register User
export const leaveMeeting = (userData) => dispatch => {
  postData(post.ENDMEET, userData)
    .then(res => {
      sessionStorage.clear();
      dispatch(setCurrentMeet({}))
    })
    .catch(err =>
      dispatch({
        type: REQ_ERRORS,
        payload: err
      })
    );
};

// Login - get user token
export const joinMeeting = meetData => dispatch => {
  postData(post.JOINMEET, meetData)
    .then(res => {
      dispatch(setCurrentMeet(res.data))
    })
    .catch(err =>{
      console.log(err);
      dispatch({
        type: REQ_ERRORS,
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