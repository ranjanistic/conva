import { ROOM_CREATED, ROOM_EXISTS} from "../actions/types";
const initialState = {};
export default function meetReducer(state = initialState, action) {
  switch (action.type) {
    case ROOM_EXISTS:
    case ROOM_CREATED:
      return action.payload;
    default:
      return state;
  }
}
