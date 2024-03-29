import { CAM_ON, CAM_OFF, MIC_ON, MIC_OFF } from "../utils/dispatchType";

const initialState = {
  cam: {
    active: false,
    stream: null,
  },
  mic: {
    active: false,
    stream: null,
  },
};
export const hardwareReducer = (state = initialState, action) => {
  switch (action.type) {
    case CAM_ON:
      return { ...state, cam: action.data };
    case CAM_OFF:
      return { ...state, cam: {} };
    case MIC_ON:
      return { ...state, mic: action.data };
    case MIC_OFF:
      return { ...state, mic: {} };
    default:
      return state;
  }
};
