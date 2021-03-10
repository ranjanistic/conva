import { SET_CURRENT_USER } from "../utils/dispatchType";
const isEmpty = require("is-empty");
const initialState = {
  isAuthenticated: false,
  user: {},
};

export const authReducer=(state = initialState, action) =>{
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
      };
    default:
      return state;
  }
}
