import { ROOMS_LIST, CHAT_LIST} from "../actions/types";
const initialState = {
    rooms:[],
    chats:[],
};
export const dataReducer=(state = initialState, action) =>{
  switch (action.type) {
    case ROOMS_LIST: return {...state,rooms:action.data};
    case CHAT_LIST: return {...state,chats:action.data};
    default:
      return state;
  }
}
