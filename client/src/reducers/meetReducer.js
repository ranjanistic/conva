import { MEET_JOINED, MEET_LEAVED } from "../actions/types";

const initialState = {
  isActive: false,
  room:{},
};

export default function meetReducer(state = initialState, action) {
  switch (action.type) {
    case MEET_JOINED:
      return {
        ...state,
        isActive:true,
        room:action.payload,
      };
    case MEET_LEAVED: return {
      ...state,
      isActive:false,
      room:{}
    }
    default:
      return state;
  }
}
