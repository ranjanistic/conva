import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { leaveMeeting } from "../../actions/meetActions";

class Meeting extends Component {
  onLeaveClick = (e) => {
    e.preventDefault();
    this.props.leaveMeeting();
  };
  componentWillReceiveProps(nextProps) {
    if (!nextProps.meet.isActive) {
      this.props.history.push("/dashboard"); // push user to dashboard when they login
    }
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }
  render() {
    const { user } = this.props.auth;
    // const { meet } = this.props;
    return (
      <div>
        <div>

          <div id="video-chat-container" class="video-position" hidden="true">
            <video id="local-video" autoplay="autoplay"></video>
            <div id="others">
              <video id="remote-video" autoplay="autoplay"></video>
            </div>
          </div>

          <button id="toggleVideo" className="btn btn-large waves-effect waves-light green accent-3">Toggle Video</button>
          <button id="toggleAudio" className="btn btn-large waves-effect waves-light green accent-3">Toggle Audio</button>
          <Link to="/dashboard" ><button className="btn btn-large waves-effect waves-light red accent-3">End call</button></Link>
        </div>
        <div style={{ height: "75vh" }} className="container valign-wrapper">
          <div className="row">
            <div className="col s12 center-align">
              <h4>In Meeting room as {user.name}</h4>
            </div>
          </div>
        </div>
      </div>
    );
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
