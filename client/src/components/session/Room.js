import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { exitRoom } from "../../actions/roomActions";
import { joinMeeting } from "../../actions/meetActions";
import { toggleCamera,toggleMic } from "../../actions/hardware";
import { get } from "../../paths/get";
import { filterMeetJoinData } from "../../utils/validator";
import People from "./People";
import Chat from "./Chat";
import { Icon } from "../elements/Icon";
import { Button } from "../elements/Button";

class Room extends Component {
  constructor() {
    super();
    this.initialState = {
      room: {},
      audio: true,
      video: true,
      astream: null,
      vstream: null,
      listen:false
    }
    this.state = this.initialState;
  }

  componentDidUpdate() {
    if (!this.props.room._id) {
      return this.props.history.push(get.DASHBOARD);
    }
    if(this.state.video){
      this.video.srcObject = this.state.vstream
    }
    if(this.state.audio){
      this.audio.srcObject = this.state.astream
    }
  }
  componentDidMount() {
    if(!this.props.auth.user.verified){
      return this.props.history.push(get.auth.VERIFY);
    }
    this.setState({ ...this.initialState, room: this.props.room });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log(nextProps,prevState);
    const { room, meet, hw:{cam,mic} } = nextProps;
    if (meet.active) {
      return nextProps.history.push(get.meet.live(room._id));
    }
    return {...prevState, audio: mic.active, astream:mic.active?mic.stream:null, video:cam.active, vstream:cam.active?cam.stream:null };
  }

  toggleCam = (e) => {
    e.preventDefault();
    console.log(this.state);
    this.props.toggleCamera(!this.state.video,this.state.vstream);
  };

  toggleMic = (e) => {
    e.preventDefault();
    console.log(this.state);
    this.props.toggleMic(!this.state.audio,this.state.astream);
  };

  toggleLocalPlay = (e) =>{
    this.audio.paused?this.audio.play():this.audio.pause();
    this.setState({listen:this.audio.paused?false:true})
  }

  exit = (e) => {
    e.preventDefault();
    this.props.exitRoom();
  };

  onJoinClick = (e) => {
    this.props.joinMeeting(filterMeetJoinData(this.state.room));
  };

  render() {
    let { room, video: cam, audio: mic,listen } = this.state;
    return (
      <div className="w3-row">
        <div className="w3-row w3-padding" style={{ height: "15vh" }}>
          <h4 className="w3-col w3-twothird">
            {Button.flat(Icon("keyboard_backspace"),this.exit)}
            <span className="w3-padding-small">{room.title}</span>
          </h4>
          <div className="w3-col w3-third w3-padding">
            <span className="w3-right w3-padding-small">
              {Button.circle(Icon("video_call"),this.onJoinClick,{classnames:"blue",title:"Join Meeting"})}
            </span>
            <span className="w3-right w3-padding-small">
              {Button.circle(Icon(mic ? "mic" : "mic_off",{classnames:"blue-text"}),this.toggleMic,{classnames:"white",title:"Toggle Mic"})}
            </span>
            <span className="w3-right w3-padding-small">
              {Button.circle(Icon(cam ? "videocam" : "videocam_off",{classnames:"blue-text"}),this.toggleCam,{classnames:"white",title:"Toggle Camera"})}
            </span>
          </div>
        </div>
        <div className="w3-row" style={{ height: "85vh" }}>
          <div className="w3-col w3-third" style={{ padding: "0 18px", height: "85vh", }}>
            <People />
          </div>
          <div className="w3-col w3-third" style={{ padding: "0 18px", height:"85vh" }}>
            <Chat />
          </div>
          <div className="w3-col w3-third " style={{ height: "85vh" }}>
            <div className="w3-row" style={{ height: "20vh" }}>
              <div className="w3-col w3-half w3-padding-small">
                <div className="slate black" style={{ height: "20vh", padding:0 }}>
                  <video
                    id="localvideo"
                    width="100%"
                    height="100%"
                    autoPlay="autoplay"
                    ref={(video) => {
                      this.video = video;
                    }}
                  ></video>
                </div>
              </div>
              <div className="w3-col w3-half w3-padding-small">
                <div className="slate" style={{ height: "20vh" }}>
                  {Button.circle(Icon(listen&&mic?"headset_mic":"headset_off"),this.toggleLocalPlay,{title:"Listen to yourself"})}
                  <audio
                    id="localaudio"
                    ref={(audio) => {
                      this.audio = audio;
                    }}
                  ></audio>
                </div>
              </div>
            </div>
            <br/>
            <div className="w3-row" style={{padding:"0px 12px", height:"60vh"}} >
              <div
                className="slate"
                style={{ height: "100%" }}
              >
                Room settings (disabled if not admin)
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  checkMediaDevices() {
    // check for mediaDevices.enumerateDevices() support
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log("enumerateDevices() not supported.");
      return false;
    } else {
      console.log("supported");
      return true;
    }
  }
  listDevices() {
    navigator.mediaDevices
      .enumerateDevices()
      .then(function (devices) {
        devices.forEach(function (device) {
          console.log(
            device.kind + ": " + device.label + " id = " + device.deviceId
          );
        });
      })
      .catch(function (err) {
        console.log(err.name + ": " + err.message);
      });
  }
}

Room.propTypes = {
  toggleMic: PropTypes.func.isRequired,
  toggleCamera: PropTypes.func.isRequired,
  joinMeeting: PropTypes.func.isRequired,
  exitRoom: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  room: PropTypes.object.isRequired,
  hw: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  room: state.room,
  meet: state.meet,
  hw: state.hw,
});
export default connect(mapStateToProps, { joinMeeting, exitRoom, toggleMic,toggleCamera})(Room);
