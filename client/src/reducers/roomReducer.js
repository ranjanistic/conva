import { ROOM_CREATED, ROOM_EXISTS, ROOM_EXIT} from "../utils/dispatchType";
const initialState = {};
export const roomReducer=(state = initialState, action) =>{
  switch (action.type) {
    case ROOM_EXISTS:
    case ROOM_CREATED:
      return action.payload;
    case ROOM_EXIT: return {};
    default:
      return state;
  }
}
