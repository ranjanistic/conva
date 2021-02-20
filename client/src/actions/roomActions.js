import { postData } from "./requests";
import { post } from "../paths/post";
import { validRoomCreateData} from "./validator";
import { REQ_ERRORS,LOADING,INPUT_ERRORS,ROOM_CREATED, ROOM_EXISTS } from "./types";

export const createRoom = (roomData) => (dispatch) => {
  const result = validRoomCreateData(roomData);
  if (!result.isValid) {
    dispatch({
      type: INPUT_ERRORS,
      errors: result.err,
    });
  } else {
    dispatch(loading());
    postData(post.room.CREATE, roomData)
      .then((res) => {
        dispatch(roomCreated(res.data.room));
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

export const enterRoom = (roomData) => (dispatch) => {
  const result = validRoomCreateData(roomData);
  if (!result.isValid) {
    dispatch({
      type: INPUT_ERRORS,
      errors: result.err,
    });
  } else {
    dispatch(loading());
    postData(post.room.CREATE, roomData)
      .then((res) => {
        dispatch(enteredRoom(res.data.room));
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

// Set logged in user
export const roomCreated = (roomData) => {
  return {
    type: ROOM_CREATED,
    payload: roomData,
  };
};

export const enteredRoom = (roomData) => {
  return {
    type: ROOM_EXISTS,
    payload: roomData,
  };
}


// loading
const loading = () => {
  return {
    type: LOADING,
  };
};
