import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Key } from "../../keys";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { get } from "../../paths/get";
import "./../../meeting.css";

class Room extends Component {
  constructor() {
    super();
    this.state = {
      roomid: "",
    };
  }

  componentDidMount() {
    const { roomid } = this.props.match.params;
    console.log(roomid);
    this.setState({ roomid: roomid });
  }

  toggleChatBox() {
    document.getElementById("chatbox").style.display = ((_) => {
      if (!sessionStorage.getItem(Key.chatboxvisible)) {
        sessionStorage.setItem(Key.chatboxvisible, 1);
        return true;
      }
      sessionStorage.setItem(
        Key.chatboxvisible,
        sessionStorage.getItem(Key.chatboxvisible) === "1" ? 0 : 1
      );
      return sessionStorage.getItem(Key.chatboxvisible) === "1";
    })()
      ? "block"
      : "none";
  }

  render() {
    let { roomid } = this.state;
    return (
      <div className="w3-row">
        <div className="w3-row w3-padding red" style={{ height: "15vh"}}>
          <h4 className="w3-col w3-half">
            <Link to={get.DASHBOARD}>
              <span className="btn-flat waves-effect">
                <i className="material-icons">keyboard_backspace</i>
              </span>
            </Link>
            <span className="w3-padding-small">Room {roomid}</span>
          </h4>
          <div className="w3-col w3-half w3-padding">
            <span className="w3-right w3-padding-small"><button title="Join meeting" className="btn-floating waves-effect blue"><i className="material-icons">video_call</i></button></span>
            <span className="w3-right w3-padding-small"><button title="Toggle mic" className="btn-floating waves-effect white"><i className="material-icons blue-text">mic_off</i></button></span>
            <span className="w3-right w3-padding-small"><button title="Toggle cam" className="btn-floating waves-effect white"><i className="material-icons blue-text">videocam_off</i></button></span>
          </div>
        </div>
        <div className="w3-row blue" style={{ height: "85vh"}}>
          <div className="w3-col w3-third yellow" style={{ overflowY: "scroll", height: "100%"}}>
            All Members
          </div>
          <div className="w3-col w3-third green" style={{ overflowY: "scroll", height: "100%"}}>
            Live members
          </div>
          <div className="w3-col w3-third pink" style={{ height: "100%"}}>
            <div className="w3-row" style={{ height: "25%"}}>
              <div className="w3-col w3-half purple" style={{ height: "100%"}}>
                Cam test
              </div>
              <div className="w3-col w3-half brown" style={{ height: "100%"}}>
                Mic test
              </div>
            </div>
            <div className="w3-row orange" style={{ overflowY: "scroll", height: "75%"}}>
              Live chat
            </div>
          </div>
        </div>
      </div>
    );
  }

  sendMessage() {}
}

Room.propTypes = {
  auth: PropTypes.object.isRequired,
  room: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  room: state.room,
});
export default connect(mapStateToProps)(Room);
