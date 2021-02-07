import { REQ_ERRORS,INPUT_ERRORS,AUTH_ERRORS} from "../actions/types";
const initialState = {};
export default function errorReducer(state = initialState, action) {
  switch (action.type) {
    case REQ_ERRORS:
      return action.exeptions;
    case AUTH_ERRORS:
    case INPUT_ERRORS:
      return action.errors;
    default:
      return state;
  }
}