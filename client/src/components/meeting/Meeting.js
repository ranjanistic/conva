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
