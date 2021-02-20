import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { joinMeeting } from "../../actions/meetActions";
import { get } from "../../paths/get";
import { filterMeetJoinData } from "../../actions/validator";

class Room extends Component {
  constructor() {
    super();
    this.vstream = "";
    this.astream = "";
    this.state = {
      room: {},
      audio: true,
      video: true,
      stream: {},
    };
  }

  componentDidMount() {
    console.log(this.props);
    const {room} = this.props;
    // if(!room.id){

    // }
    this.setState({ room: room, audio: false, video: false, stream: {} });
    
  }
  
  componentWillReceiveProps(nextProps){
    console.log(nextProps);
    const {room,meet} = nextProps;
    if(meet.active){
      return this.props.history.push(`${get.meet.live(room.id)}`);
    }
    this.setState({ room: room, audio: false, video: false, stream: {} });
  }

  toggleCam = (e) => {
    if (!this.state.video) {
      this.streamVideo();
    } else {
      this.setState({
        video: false,
      });
      this.vstream.getTracks().forEach((track) => {
        track.stop();
      });
      this.vstream = "";
      this.video.srcObject = null;
    }
  };

  toggleMic = (e) => {
    if (!this.state.audio) {
      this.streamAudio();
    } else {
      this.setState({
        audio: false,
      });
      this.astream.getTracks().forEach((track) => {
        console.log(track);
        track.stop();
      });
      this.astream = "";
      this.audio.srcObject = null;
    }
  };

  streamVideo() {
    if (this.checkMediaDevices()) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(async (res) => {
        this.listDevices();
        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          this.vstream = stream;
          this.setState({
            video: true,
          });
          this.video.srcObject = stream;
        } catch (error) {
          console.error("Could not get user media", error);
        }
      });
    }
  }

  streamAudio() {
    if (this.checkMediaDevices()) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(async (res) => {
        this.listDevices();
        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          this.astream = stream;
          this.setState({
            audio: true,
          });
          this.audio.srcObject = stream;
          this.visualizeAudio();
        } catch (error) {
          console.error("Could not get user media", error);
        }
      });
    }
  }

  visualizeAudio = () => {
    const context = this.canvas.getContext("2d");
    var audioContent = new AudioContext();
    var audioStream = audioContent.createMediaStreamSource(this.astream);
    var analyser = audioContent.createAnalyser();
    audioStream.connect(analyser);
    analyser.fftSize = 1024;

    var frequencyArray = new Uint8Array(analyser.frequencyBinCount);
    console.log(this.astream);
    console.log(audioStream);
    console.log(analyser);
    console.log(frequencyArray);
    console.log(analyser.getByteFrequencyData(frequencyArray));
    // //Through the frequencyArray has a length longer than 255, there seems to be no
    // //significant data after this point. Not worth visualizing.
    // var doDraw = () => {
    //   requestAnimationFrame(doDraw);
    //   analyser.getByteFrequencyData(frequencyArray);

    //   for (var i = 0; i < 255; i++) {
    //     context.rect(0,this.canvas.height,Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 5),Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 5))
    //   // var adjustedLength;
    //   //   adjustedLength = Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 5);
    //   //   paths[i].setAttribute("d", "M " + i + ",255 l 0,-" + adjustedLength);
    //   }
    // };
    // doDraw();
  };

  onJoinClick=(e)=>{
    this.props.joinMeeting(filterMeetJoinData(this.state.room));
  }
  render() {
    let { room, video: cam, audio: mic, stream } = this.state;
    return (
      <div className="w3-row">
        <div className="w3-row w3-padding" style={{ height: "15vh" }}>
          <h4 className="w3-col w3-half">
            <Link to={get.DASHBOARD}>
              <span className="btn-flat waves-effect" title="Back to dashboard">
                <i className="material-icons">keyboard_backspace</i>
              </span>
            </Link>
            <span className="w3-padding-small">{room.title}</span>
          </h4>
          <div className="w3-col w3-half w3-padding">
            <span className="w3-right w3-padding-small">
              <button
                title="Join meeting"
                className="btn-floating waves-effect blue"
                onClick={this.onJoinClick}
              >
                <i className="material-icons">video_call</i>
              </button>
            </span>
            <span className="w3-right w3-padding-small">
              <button
                title="Toggle mic"
                className="btn-floating waves-effect white"
                onClick={this.toggleMic}
              >
                <i className="material-icons blue-text">
                  {mic ? "mic" : "mic_off"}
                </i>
              </button>
            </span>
            <span className="w3-right w3-padding-small">
              <button
                title="Toggle cam"
                className="btn-floating waves-effect white"
                onClick={this.toggleCam}
              >
                <i className="material-icons blue-text">
                  {cam ? "videocam" : "videocam_off"}
                </i>
              </button>
            </span>
          </div>
        </div>
        <div className="w3-row " style={{ height: "85vh" }}>
          <div
            className="w3-col w3-third "
            style={{ overflowY: "scroll", height: "100%" }}
          >
            All Members + Online
          </div>
          <div
            className="w3-col w3-third z-depth-4 secondary"
            style={{ overflowY: "scroll", height: "100%" }}
          >
            Live Chat
          </div>
          <div className="w3-col w3-third " style={{ height: "100%" }}>
            <div className="w3-row" style={{ height: "25%" }}>
              <div className="w3-col w3-half " style={{ height: "100%" }}>
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
              <div className="w3-col w3-half " style={{ height: "100%" }}>
                Audio visual
                <audio
                  id="localaudio"
                  autoPlay="autoplay"
                  ref={(audio) => {
                    this.audio = audio;
                  }}
                ></audio>
                <canvas
                  ref={(canvas) => {
                    this.canvas = canvas;
                  }}
                  width="200"
                  height="200"
                ></canvas>
              </div>
            </div>
            <div
              className="w3-row "
              style={{ overflowY: "scroll", height: "75%" }}
            >
              Settings
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
  sendMessage() {}
}

Room.propTypes = {
  joinMeeting:PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  room: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  room: state.room,
  meet: state.meet
});
export default connect(mapStateToProps, {joinMeeting})(Room);
