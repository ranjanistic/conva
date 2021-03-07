import { CAM_ON, CAM_OFF, MIC_ON, MIC_OFF } from "./types";

const checkMediaDevices = () => (navigator.mediaDevices || navigator.mediaDevices.enumerateDevices)

export const toggleCamera = (turnOn,stream) => (dispatch) => {
  if (turnOn && checkMediaDevices()) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(async (res) => {
      let newstream;
      try {
        newstream = await navigator.mediaDevices.getUserMedia({ video: true });
        dispatch({
          type: CAM_ON,
          data: {
            active:true,
            stream: newstream,
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
      let newstream;
      try {
        newstream = await navigator.mediaDevices.getUserMedia({ audio: true });
        dispatch({
          type: MIC_ON,
          data: {
            active:true,
            stream: newstream,
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
