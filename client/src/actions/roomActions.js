import { postData, loading } from "./actions";
import { post } from "../paths/post";
import { validRoomCreateData } from "../utils/validator";
import {
  REQ_ERRORS,
  INPUT_ERRORS,
  ROOM_CREATED,
  ROOM_EXISTS,
  ROOM_EXIT,
  ROOMS_LIST,
} from "../utils/dispatchType";

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
        console.log('res',res)
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

export const enterRoom = (roomID) => (dispatch) => {
  dispatch(loading());
  postData(post.room.ENTER, { roomID })
    .then((res) => {
      console.log(res);
      dispatch(enteredRoom(res.data.room));
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: REQ_ERRORS,
        payload: err,
      });
    });
};

export const exitRoom = () => (dispatch) => {
  dispatch({
    type: ROOM_EXIT,
  });
};

export const getRooms = (_) => (dispatch) => {
  postData(post.room.RECEIVE)
    .then((res) => {
      console.log('rooms',res);
      dispatch(roomsList(res.data.rooms));
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: REQ_ERRORS,
        payload: err,
      });
    });
};

// Set logged in user
export const roomCreated = (roomData) => ({
  type: ROOM_CREATED,
  payload: roomData,
});

export const enteredRoom = (roomData) => ({
  type: ROOM_EXISTS,
  payload: roomData,
});

export const roomsList = (rooms) => ({
  type: ROOMS_LIST,
  data: rooms,
});
