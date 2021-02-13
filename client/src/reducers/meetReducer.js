import { MEET_JOINED, MEET_LEAVED } from "../actions/types";

const initialState = {
  isActive: false,
  roomid:"",
  people:[],
  chats:[],
  loading:false
};

export default function meetReducer(state = initialState, action) {
  switch (action.type) {
    case MEET_JOINED:
      return {
        ...state,
        isActive:true,
        roomid:action.payload.roomid,
        people:action.payload.people,
        chats:action.payload.chats
      };
    case MEET_LEAVED: return {
      ...state,
      loading:true
    }
    default:
      return state;
  }
}
