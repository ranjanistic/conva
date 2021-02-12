import { REQ_ERRORS,INPUT_ERRORS,AUTH_ERRORS} from "../actions/types";
const initialState = {
  loading:true,
  errors:{}
};
export default function errorReducer(state = initialState, action) {
  switch (action.type) {
    case REQ_ERRORS:
      return {
        ...state,
        loading: false,
        errors:action.exceptions,
      };
    case AUTH_ERRORS:
    case INPUT_ERRORS:
      return {
        ...state,
        loading: false,
        errors:action.errors,
      };
    default:
      return state;
  }
}