import { MEET_JOINED,MEET_LEFT } from "../utils/dispatchType";
const initialState = {};
export const meetReducer=(state = initialState, action)=>{
  switch (action.type) {
    case MEET_JOINED:
      return action.payload;
    case MEET_LEFT:
      return {};
    default:
      return state;
  }
}
