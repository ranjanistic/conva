import { combineReducers } from "redux";
import authReducer from "./authReducer";
import eventReducer from "./eventReducer";
import meetReducer from "./meetReducer";
export default combineReducers({
  auth: authReducer,
  meet: meetReducer,
  event: eventReducer
});