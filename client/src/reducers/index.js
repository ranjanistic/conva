import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import meetReducer from "./meetReducer";
export default combineReducers({
  auth: authReducer,
  meet: meetReducer,
  errors: errorReducer
});