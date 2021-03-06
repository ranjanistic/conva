import { REQ_ERRORS,INPUT_ERRORS,AUTH_ERRORS,LOADING, HW_ERRORS} from "../actions/types";
const initialState = {
  loading:false,
  errors:{}
};
export const eventReducer=(state = initialState, action) => {
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
    case HW_ERRORS:
      return {
        ...state,
        loading: false,
        hwerror:action.error,
      };
    case LOADING:
      return {
        errors:{},
        loading:true
      };
    default:
      return state;
  }
}