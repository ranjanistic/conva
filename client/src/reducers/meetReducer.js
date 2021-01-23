import { SET_CURRENT_MEET, MEET_LOADING } from "../actions/types";
const isEmpty = require("is-empty");
const initialState = {
  isActive: false,
  roomid:"",
  people:[],
  chats:[],
  loading:false
};

export default function meetReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_MEET:
      return {
        ...state,
        isActive:!isEmpty(action.payload),
        roomid:action.payload.roomid,
        people:action.payload.people,
        chats:action.payload.chats
      };
    case MEET_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}
