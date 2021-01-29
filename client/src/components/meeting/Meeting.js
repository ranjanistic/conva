import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { leaveMeeting } from "../../actions/meetActions";
import { Key } from "../../keys";
import "./../../meeting.css"

class Meeting extends Component {
  onLeaveClick = (e) => {
    e.preventDefault();
    this.props.leaveMeeting();
  };
  componentDidUpdate(nextProps) {
    if (!nextProps.meet.isActive) {
      this.props.history.push("/dashboard"); // push user to dashboard when they login
    }
    
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }

  }

  getChildernFrames(){
    let children = [];
    [1,2,3,4].forEach((e)=>{
      children.push(
        <div className="w3-padding-small" key={e}>
          <div className="w3-row w3-padding black white-text" style={{ height: "30vh" }}>Child Frame {e}</div>
        </div>
      )
    })
    return children;
  }

  toggleChatBox(){
    document.getElementById("chatbox").style.display = (_=>{
      if(!sessionStorage.getItem(Key.chatboxvisible)){
        sessionStorage.setItem(Key.chatboxvisible,1);
        return true;
      }
      sessionStorage.setItem(Key.chatboxvisible,sessionStorage.getItem(Key.chatboxvisible)==='1'?0:1);
      return sessionStorage.getItem(Key.chatboxvisible)==='1'
    })()?'block':'none';
  }

  render() {
    // const { user } = this.props.auth;
    // const { meet } = this.props;
    return (
      <div className="w3-row">
          <div className="w3-col w3-twothird black white-text" style={{ height: "100vh" }} id="parent">
            Parent Frame
          </div>
          <div className="w3-col w3-third" style={{ overflowY: "scroll", height: "100vh"}}>
            <div className="w3-row w3-padding w3-center" id="actions">
              <div style={{ width: "25%"}} className="w3-col w3-padding-small w3-center"><button id="toggleVideo" className="btn-floating btn-large waves-effect white w3-right" onClick={this.toggleCam}><i className="material-icons blue-text" id="camview">videocam_off</i></button></div>
              <div style={{ width: "25%"}} className="w3-col w3-padding-small w3-center"><button id="toggleAudio" className="btn-floating btn-large waves-effect white w3-center" onClick={this.toggleMic}><i className="material-icons blue-text" id="micview">mic_off</i></button></div>
              <div style={{ width: "25%"}} className="w3-col w3-padding-small w3-center"><button id="togglechatbox" className="btn-floating btn-large waves-effect waves-light blue w3-center" onClick={this.toggleChatBox} ><i className="material-icons">chat</i></button></div>
              <div style={{ width: "25%"}} className="w3-col w3-padding-small w3-center"><button id="endcall" className="btn-floating btn-large waves-effect waves-light red w3-left" onClick={this.onLeaveClick} ><i className="material-icons">call_end</i></button></div>
            </div>
            <div className="w3-row" id="children">
              {this.getChildernFrames()}
            </div>
          </div>
          <div className="white z-depth-5 chatview" id="chatbox">
            <div className="w3-row grey" id="chathead" style={{ height: "20vh" }}>
              <div className="w3-col w3-padding w3-half"><h4>Chat</h4></div>
              <div style={{ width: "25%"}} className="w3-col w3-padding w3-right"><button id="closechat" onClick={this.toggleChatBox} className="btn-floating waves-effect blue w3-right"><i className="material-icons white-text">close</i></button></div>
            </div>
            <div className="w3-row" id="chatbody">

            </div>
            <div className="w3-row w3-bottom w3-padding" id="useractions">
              <div className="w3-col w3-half">
                <div className="input-field">
                  <textarea
                    rows="4"
                    cols="5"
                    id="newmsg"
                    type="text"
                    className="materialize-textarea"
                  />
                  <label htmlFor="newmsg">Message</label>
                </div>
              </div>
              <div className="col s2" style={{ width: "49px"}} ><button id="sendmsg" onClick={this.sendMessage} className="btn-floating waves-effect green w3-right"><i className="material-icons white-text">send</i></button></div>
            </div>
          </div>
      </div>
    );
  }

  sendMessage(){

  }

  toggleCam(){
    document.getElementById("camview").innerHTML = (_=>{
      if(!sessionStorage.getItem(Key.cameraon)){
        sessionStorage.setItem(Key.cameraon,1);
        return true;
      }
      sessionStorage.setItem(Key.cameraon,sessionStorage.getItem(Key.cameraon)==='1'?0:1);
      return sessionStorage.getItem(Key.cameraon)==='1'
    })()?'videocam':'videocam_off';
  }

  toggleMic(){
    document.getElementById("micview").innerHTML = (_=>{
      if(!sessionStorage.getItem(Key.micon)){
        sessionStorage.setItem(Key.micon,1);
        return true;
      }
      sessionStorage.setItem(Key.micon,sessionStorage.getItem(Key.micon)==='1'?0:1);
      return sessionStorage.getItem(Key.micon)==='1'
    })()?'mic':'mic_off';
  }
}

Meeting.propTypes = {
  leaveMeeting: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  meet: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  meet: state.meet,
});
export default connect(mapStateToProps, { leaveMeeting })(Meeting);

function f() {
  // DOM elements.
  const roomSelectionContainer = document.getElementById(
    "room-selection-container"
  );
  const roomInput = document.getElementById("room-input");
  const connectButton = document.getElementById("connect-button");

  const videoChatContainer = document.getElementById("video-chat-container");
  const localVideoComponent = document.getElementById("local-video");
  const remoteVideoComponent = document.getElementById("remote-video");
  let io=_=>{};
  // Variables.
  const socket = io();
  const mediaConstraints = {
    audio: true,
    video: { width: 1280, height: 720 },
  };
  var localStream;
  var remoteStream;
  var isRoomCreator;
  var rtcPeerConnection; // Connection between the local device and the remote peer.
  var roomId;

  // Free public STUN servers provided by Google.
  const iceServers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
      { urls: "stun:stun3.l.google.com:19302" },
      { urls: "stun:stun4.l.google.com:19302" },
    ],
  };

  // BUTTON LISTENER ============================================================
  connectButton.onclick = (_) => {
    joinRoom(roomInput.value);
  };

  // SOCKET EVENT CALLBACKS =====================================================
  socket.on("room_created", async () => {
    console.log("Socket event callback: room_created");

    await setLocalStream(mediaConstraints);
    isRoomCreator = true;
    console.log("room_created over");
  });

  socket.on("room_joined", async () => {
    console.log("Socket event callback: room_joined");

    await setLocalStream(mediaConstraints);
    socket.emit("start_call", roomId);
  });

  socket.on("full_room", () => {
    console.log("Socket event callback: full_room");

    alert("The room is full, please try another one");
  });

  // FUNCTIONS ==================================================================
  function joinRoom(room) {
    if (room === "") {
      alert("Please type a room ID");
    } else {
      roomId = room;
      socket.emit("join", room);
      showVideoConference();
    }
  }

  function showVideoConference() {
    roomSelectionContainer.style = "display: none";
    videoChatContainer.style = "display: block";
  }

  async function setLocalStream(mediaConstraints) {
    var stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
    } catch (error) {
      console.error("Could not get user media", error);
    }

    localStream = stream;
    localVideoComponent.srcObject = stream;
  }

  // SOCKET EVENT CALLBACKS =====================================================
  socket.on("start_call", async () => {
    console.log("Socket event callback: start_call");

    if (isRoomCreator) {
      rtcPeerConnection = new RTCPeerConnection(iceServers);
      addLocalTracks(rtcPeerConnection);
      rtcPeerConnection.ontrack = setRemoteStream;
      rtcPeerConnection.onicecandidate = sendIceCandidate;
      await createOffer(rtcPeerConnection);
    }
  });

  socket.on("webrtc_offer", async (event) => {
    console.log("Socket event callback: webrtc_offer");

    if (!isRoomCreator) {
      rtcPeerConnection = new RTCPeerConnection(iceServers);
      addLocalTracks(rtcPeerConnection);
      rtcPeerConnection.ontrack = setRemoteStream;
      rtcPeerConnection.onicecandidate = sendIceCandidate;
      rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
      await createAnswer(rtcPeerConnection);
    }
  });

  socket.on("webrtc_answer", (event) => {
    console.log("Socket event callback: webrtc_answer");

    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
  });

  socket.on("webrtc_ice_candidate", (event) => {
    console.log("Socket event callback: webrtc_ice_candidate");

    // ICE candidate configuration.
    var candidate = new RTCIceCandidate({
      sdpMLineIndex: event.label,
      candidate: event.candidate,
    });
    rtcPeerConnection.addIceCandidate(candidate);
  });

  // FUNCTIONS ==================================================================
  function addLocalTracks(rtcPeerConnection) {
    localStream.getTracks().forEach((track) => {
      rtcPeerConnection.addTrack(track, localStream);
    });
  }

  async function createOffer(rtcPeerConnection) {
    var sessionDescription;
    try {
      sessionDescription = await rtcPeerConnection.createOffer();
      rtcPeerConnection.setLocalDescription(sessionDescription);
    } catch (error) {
      console.error(error);
    }

    socket.emit("webrtc_offer", {
      type: "webrtc_offer",
      sdp: sessionDescription,
      roomId,
    });
  }

  async function createAnswer(rtcPeerConnection) {
    var sessionDescription;
    try {
      sessionDescription = await rtcPeerConnection.createAnswer();
      rtcPeerConnection.setLocalDescription(sessionDescription);
    } catch (error) {
      console.error(error);
    }

    socket.emit("webrtc_answer", {
      type: "webrtc_answer",
      sdp: sessionDescription,
      roomId,
    });
  }

  function setRemoteStream(event) {
    remoteVideoComponent.srcObject = event.streams[0];
    console.log(event.stream);
    remoteStream = event.stream;
  }

  function sendIceCandidate(event) {
    if (event.candidate) {
      socket.emit("webrtc_ice_candidate", {
        roomId,
        label: event.candidate.sdpMLineIndex,
        candidate: event.candidate.candidate,
      });
    }
  }
}
