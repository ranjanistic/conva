import { ROOMS_LIST} from "../actions/types";
const initialState = {
    rooms:[],
    chats:[],
};
export const dataReducer=(state = initialState, action) =>{
  switch (action.type) {
    case ROOMS_LIST: return {...state,rooms:action.data};
    default:
      return state;
  }
}
