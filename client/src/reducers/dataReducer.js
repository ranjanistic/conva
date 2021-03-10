import { ROOMS_LIST} from "../utils/dispatchType";
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
