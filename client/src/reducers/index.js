import { combineReducers } from "redux";
import authReducer from "./authReducer";
import eventReducer from "./eventReducer";
import roomReducer from "./roomReducer";
import meetReducer from "./meetReducer";
export default combineReducers({
  auth: authReducer,
  event: eventReducer,
  room: roomReducer,
  meet: meetReducer,
});