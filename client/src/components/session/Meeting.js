import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { leaveMeeting } from "../../actions/meetActions";
import { toggleCamera, toggleMic } from "../../actions/hardware";
import { get } from "../../paths/get";
import { Icon } from "../elements/Icon";
import Chat from "./Chat";
import M from "materialize-css";
import People from "./People";
import { Dialog } from "../elements/Dialog";
import { connectToStream, disconnectFromStream } from "./Socket";

class Meeting extends Component {
  constructor() {
    super();
    this.initialState = {
      room: {},
      streams: [],
      local: {
        video: false,
        audio: false,
        vstream: null,
        astream: null,
      },
      remote: [],
    };
    this.state = this.initialState;
    this.videos = {};
    this.audios = {};
    this.iceServers = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
      ],
    }
  }

  toggleCam = (e) => {
    e.preventDefault();
    console.log(this.state);
    this.props.toggleCamera(!this.state.local.video, this.state.local.vstream);
  };

  toggleMic = (e) => {
    e.preventDefault();
    console.log(this.state);
    this.props.toggleMic(!this.state.local.audio, this.state.local.astream);
  };

  leave = (e) => {
    e.preventDefault();
    this.props.leaveMeeting();
  };

  componentDidUpdate(prevProps, prevState) {
    console.log(this.state);
    if (this.state.local.video) {
      this.selfVideo.srcObject = this.state.local.vstream;
    }
    if (this.state.local.audio) {
      // this.audio.srcObject = this.state.local.astream
    }
  }

  componentDidMount() {
    console.log(this.props);
    if (!this.props.auth.user.verified) {
      return this.props.history.push(get.auth.VERIFY);
    }
    const {
      hw: { cam, mic },
      room,
    } = this.props;
    this.setState({
      ...this.initialState,
      room,
      local: {
        video: cam.active,
        audio: mic.active,
        vstream: cam.stream,
        astream: mic.stream,
      },
    });
    connectToStream(this.props.room._id, (err, newstream, gonestream) => {
      let streams = this.state.streams;
      if (newstream) {
        streams.push(newstream);
        
      }
      if (gonestream) {
        let newstreams = [];
        streams.forEach((stream) => {
          if (stream.id !== gonestream.id) newstreams.push(stream);
        });
        streams = newstreams;
      }
      this.setState({ streams });
    });
  }

  componentWillUnmount() {
    disconnectFromStream(this.props.room._id);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log(nextProps);
    const {
      room,
      meet,
      hw: { cam, mic },
    } = nextProps;
    if (!meet.active) {
      return this.props.history.push(get.room.self(room._id));
    }
    return {
      ...prevState,
      local: {
        audio: mic.active,
        astream: mic.active ? mic.stream : null,
        video: cam.active,
        vstream: cam.active ? cam.stream : null,
      },
    };
  }

  meetActions = (local) => {
    let actions = [];
    const allacts = [
      {
        content: Icon(local.video ? "videocam" : "videocam_off", {
          classnames: "blue-text",
        }),
        title: "Toggle Camera",
        classnames: "white w3-right",
        onclick: this.toggleCam,
      },
      {
        content: Icon(local.audio ? "mic" : "mic_off", {
          classnames: "blue-text",
        }),
        title: "Toggle Mic",
        classnames: "white w3-center",
        onclick: this.toggleMic,
      },
      {
        content: Icon("chat"),
        classnames: "blue w3-center",
        title: "Chat Toggle",
        onclick: this.toggleChatBox,
      },
      {
        content: Icon("people"),
        classnames: "w3-center",
        title: "Room Info Toggle",
        onclick: this.toggleAbout,
      },
      {
        content: Icon("call_end"),
        classnames: "red w3-left",
        title: "Leave Meeting",
        onclick: this.leave,
      },
    ];
    allacts.forEach((action, a) => {
      actions.push(
        <div
          style={{ width: `${100 / allacts.length}%` }}
          className="w3-col w3-padding-small w3-center"
          key={a}
        >
          <button
            title={action.title}
            className={`btn-floating btn-large waves-effect ${action.classnames}`}
            onClick={action.onclick}
          >
            {action.content}
          </button>
        </div>
      );
    });
    return <span>{actions}</span>;
  };

  getChildernFrames(streams) {
    let children = [];
    streams.forEach((stream) => {
      children.push(
        <div className="w3-padding w3-row shadow" key={stream.id}>
          <div
            style={{
              height: "30vh",
              width: "100%",
              padding: "0",
              borderRadius: "8px",
            }}
            className="btn black waves-effect"
          >
            <video
              height="100%"
              width="100%"
              autoPlay="autoplay"
              id={stream.id + "video"}
              ref={(video) => {
                this.videos[stream.id] = video;
              }}
            ></video>
            <audio
              id={stream.id + "audio"}
              ref={(audio) => {
                this.audios[stream.id] = audio;
              }}
              autoPlay="autoPlay"
              hidden={true}
            ></audio>
          </div>
        </div>
      );
    });
    return children;
  }

  toggleChatBox = (e) => {
    let inst = M.Modal.init(this.Chat);
    inst.open();
  };

  toggleAbout = (e) => {
    let inst = M.Modal.init(this.About);
    inst.open();
  };

  render() {
    const { room, streams, local } = this.state,
      { user } = this.props.auth;
    return (
      <div className="w3-row" style={{ height: "100vh" }}>
        <div className="w3-col w3-twothird" style={{ height: "100vh" }}>
          <div className="w3-row" style={{ height: "85vh" }}>
            <video
              className="black white-text"
              style={{ width: "100%", height: "100%" }}
              id="parent"
              autoPlay="autoplay"
              ref={(video) => {
                if (
                  streams.some(
                    (stream) =>
                      String(stream.id) === String(user.id) && stream.admin
                  )
                )
                  this.selfVideo = video;
                else this.video = video;
              }}
            ></video>
          </div>
          <div className="w3-row" style={{ height: "15vh" }}>
            <div
              className="w3-col w3-half"
              style={{ height: "15vh", overflowY: "scroll" }}
            >
              <h3 style={{ paddingLeft: "1rem" }}>{room.title}</h3>
            </div>
            <div className="w3-col w3-half" style={{ height: "15vh" }}></div>
          </div>
        </div>

        <div className="w3-col w3-third" style={{ height: "100vh" }}>
          <div
            className="w3-row w3-center w3-padding-small"
            id="actions"
            style={{ height: "10vh" }}
          >
            {this.meetActions(local)}
          </div>
          <div
            className="w3-row secondary"
            id="children"
            style={{ overflowY: "scroll", height: "90vh" }}
          >
            {this.getChildernFrames(streams)}
          </div>
        </div>
        {Dialog.custom({
          ref: (Chat) => {
            this.Chat = Chat;
          },
          classes: "bottom-sheet transparent",
          content: (
            <div style={{ width: "fit-content", height: "100%" }}>
              <Chat />
            </div>
          ),
        })}
        {Dialog.custom({
          ref: (About) => {
            this.About = About;
          },
          classes: "bottom-sheet transparent",
          content: (
            <div style={{ width: "fit-content", height: "100%" }}>
              <People />
            </div>
          ),
        })}
      </div>
    );
  }

  getToggleViewById(id, on = false) {
    switch (id) {
      case "cam":
        return on ? "videocam" : "videocam_off";
      case "mic":
        return on ? "mic" : "mic_off";
      default:
        return on;
    }
  }
}

Meeting.propTypes = {
  toggleMic: PropTypes.func.isRequired,
  toggleCamera: PropTypes.func.isRequired,
  leaveMeeting: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  room: PropTypes.object.isRequired,
  meet: PropTypes.object.isRequired,
  hw: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  room: state.room,
  meet: state.meet,
  hw: state.hw,
});

export default connect(mapStateToProps, {
  leaveMeeting,
  toggleMic,
  toggleCamera,
})(Meeting);
