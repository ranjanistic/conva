import { SET_CURRENT_USER, CODE_SENT, CODE_VERIFIED, CODE_EXPIRED } from "../utils/dispatchType";
const isEmpty = require("is-empty");
const initialState = {
  isAuthenticated: false,
  user: {},
  twofa:{
    sent:false,
    verified:false,
    expired:false
  }
};

export const authReducer=(state = initialState, action) =>{
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
      };
    case CODE_SENT:
      return {
        ...state,twofa:{
          sent:true,
          verified:false,
          expired:false
        }
      }
    case CODE_EXPIRED:
      return {
        ...state,twofa:{
          ...state.twofa,
          expired:true
        }
      }
    case CODE_VERIFIED:
      return {
        ...state,twofa:{
          ...state.twofa,
          verified:true,
        }
      }
    default:
      return state;
  }
}
