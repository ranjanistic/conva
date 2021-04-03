import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { leaveMeeting } from "../../actions/meetActions";
import { get } from "../../paths/get";
import { Icon } from "../elements/Icon";
import Chat from "./Chat";

class Meeting extends Component {
  constructor() {
    super();
    this.initialState = {
      room: {},
      local:{
        video:false,
        audio:false,
        vstream:null,
        astream:null
      },
      remote:[],
      actions: {
        cam: false,
        mic: false,
        chatbox: false,
        active: true,
      },
    }
    this.state = this.initialState;
  }

  toggleCam = (e) => {
    e.preventDefault();
    console.log(this.state);
    this.props.toggleCamera(!this.state.local.video,this.state.local.vstream);
  };

  toggleMic = (e) => {
    e.preventDefault();
    console.log(this.state);
    this.props.toggleMic(!this.state.local.audio,this.state.local.astream);
  };

  leave = (e) => {
    e.preventDefault();
    this.props.leaveMeeting();
  };

  componentDidUpdate(prevProps,prevState){
    console.log(this.state);
  }
  
  componentDidMount() {
    console.log(this.props);
    if(!this.props.auth.user.verified){
      return this.props.history.push(get.auth.VERIFY);
    }
    const {hw:{cam,mic}, room} = this.props;
    this.setState({ ...this.initialState,room, local:{video:cam.active,audio:mic.active,vstream:cam.stream,astream:mic.stream}});
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log(nextProps);
    const { room, meet } = nextProps;
    if (!meet.active) {
      return this.props.history.push(get.room.self(room._id));
    }
    return prevState;
  }

  meetActions = () => {
    let actions = [];
    const allacts = [
      {
        content: Icon(this.getToggleViewById("cam", this.state.local.video), {
          classnames: "blue-text",
        }),
        title:"Toggle Camera",
        classnames: "white w3-right",
        onclick: this.toggle,
      },
      {
        content: Icon(this.getToggleViewById("mic", this.state.local.audio), {
          classnames: "blue-text",
        }),
        title:"Toggle Mic",
        classnames: "white w3-center",
      },
      {
        content: Icon("chat"),
        classnames: "blue w3-center",
        title:"Chat Toggle",
        onclick: this.toggleChatBox,
      },
      {
        content: Icon("more_horiz"),
        classnames: "w3-center",
        title:"Room Info Toggle",
        onclick: this.toggleAbout,
      },
      {
        content: Icon("call_end"),
        classnames: "red w3-left",
        title:"Leave Meeting",
        onclick: this.leave,
      },
    ];
    allacts.forEach((action) => {
      actions.push(
        <div
          style={{ width: `${100 / allacts.length}%` }}
          className="w3-col w3-padding-small w3-center"
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

  getChildernFrames() {
    let children = [];
    [1, 2, 3, 4].forEach((e) => {
      children.push(
        <div className="w3-padding w3-row shadow" key={e}>
          <div
            style={{
              height: "30vh",
              width: "100%",
              padding: "0",
              borderRadius: "8px",
            }}
            className="btn black waves-effect waves-light"
          >
            <video
              height="100%"
              width="100%"
              autoPlay="autoplay"
              ref={(video) => {
                this.video = video;
              }}
            ></video>
          </div>
        </div>
      );
    });
    return children;
  }

  toggleChatBox = (e) => {
    document.getElementById("children").hidden = document.getElementById(
      "chat"
    ).hidden;
    document.getElementById("chat").hidden = !document.getElementById("chat")
      .hidden;
  };

  toggleAbout = (e) => {};
  render() {
    const { room } = this.state;
    return (
      <div className="w3-row" style={{ height: "100vh" }}>
        <div className="w3-col w3-twothird" style={{ height: "100vh" }}>
          <div className="w3-row" style={{ height: "85vh" }}>
            <video
              className="black white-text"
              style={{ width: "100%", height: "100%" }}
              id="parent"
            ></video>
          </div>
          <div className="w3-row" style={{ height: "15vh" }}>
            <div
              className="w3-col w3-half"
              style={{ height: "15vh", overflowY: "scroll" }}
            >
              <h3 style={{ paddingLeft: "1rem" }}>{room.title}</h3>
            </div>
            <div
              className="w3-col w3-half red"
              style={{ height: "15vh" }}
            ></div>
          </div>
        </div>

        <div className="w3-col w3-third" style={{ height: "100vh" }}>
          <div
            className="w3-row w3-center w3-padding-small"
            id="actions"
            style={{ height: "10vh" }}
          >
            {this.meetActions()}
          </div>
          <div
            className="w3-row secondary"
            id="children"
            style={{ overflowY: "scroll", height: "90vh" }}
            hidden={false}
          >
            {this.getChildernFrames()}
          </div>
          <div
            className="w3-row secondary"
            id="chat"
            style={{ overflowY: "scroll", height: "90vh" }}
            hidden={true}
          >
            <Chat></Chat>
          </div>
        </div>
      </div>
    );
  }

  toggle = (e) => {
    console.log(e.target.id);
    this.setState({
      actions: { [e.target.id]: !this.state.actions[e.target.id] },
    });
  };

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

export default connect(mapStateToProps, { leaveMeeting })(Meeting);
