import { CAM_ON, CAM_OFF, MIC_ON, MIC_OFF, HW_ERRORS } from "./types";

const checkMediaDevices = () => (navigator.mediaDevices || navigator.mediaDevices.enumerateDevices)

export const toggleCamera = (turnOn,stream) => (dispatch) => {
  console.log('ayes',checkMediaDevices());
  if (turnOn && checkMediaDevices()) {
    console.log('yes')
    navigator.mediaDevices.getUserMedia({ video: true }).then(async (res) => {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        dispatch({
          type: CAM_ON,
          data: {
            active:true,
            stream: stream,
          },
        });
      } catch (error) {
        dispatch({
          type: CAM_OFF,
        });
      }
    });
  } else {
    if(stream.active){
      if(stream.getTracks().some((track)=>{
        if(track.readyState === "live" && track.kind === "video"){
          console.log("stopping")
          track.stop();
          return true;
        } 
        return false
      })){
        dispatch({
          type: CAM_OFF,
        });
      }
    }
  }
};

export const toggleMic = (turnOn,stream) => (dispatch) => {
  if (turnOn && checkMediaDevices()) {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(async (res) => {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        dispatch({
          type: MIC_ON,
          data: {
            active:true,
            stream: stream,
          },
        });
      } catch (error) {
        dispatch({
          type: MIC_OFF,
        });
      }
    });
  } else {
    if(stream.active){
      if(stream.getTracks().some((track)=>{
        if(track.readyState === "live" && track.kind === "audio"){
          track.stop();
          return true;
        } 
        return false
      })){
        dispatch({
          type: MIC_OFF,
        });
      }
    }
  }
};
