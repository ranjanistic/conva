import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { leaveMeeting } from "../../actions/meetActions";
import { Key } from "../../keys";
import "./../../meeting.css"

class Meeting extends Component {

  constructor(){
    super();
    this.state = {
      actions:{
        cam:false,
        mic:false,
        chat:false,
        end:false,
      }
    }

    this.actions = [];

    Object.keys(this.state.actions).forEach((act)=>{
      this.actions.push({
        id:act,
        html:(on = false)=>{return (
          <button className="btn-floating btn-large waves-effect white w3-right" onClick={this.toggle}>
          <i className="material-icons blue-text" id={act}>{this.getToggleViewByAction(act,on)}</i>
          </button>
        )}
      })
    });
    console.log(this.actions);
  }

  getToggleViewByAction(action,on = false){
    switch(action){
      case this.state.actions.cam:return on?'videocam':'videocam_off';
      case this.state.actions.mic:return on?'mic':'mic_off';
      case this.state.actions.chat:return 'chat';
      case this.state.actions.end:return 'call_end';
      default: return on;
    }
  }

  componentDidUpdate(nextProps) {
    console.log(nextProps);
    // if (!nextProps.meet.isActive) {
    //   this.props.history.push("/dashboard"); // push user to dashboard when they login
    // }
    
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
        <div className="w3-row black white-text w3-margin btn waves-effect waves-light" style={{ height: "30vh" }} key={e}>
          Child Frame {e}
          <video src=""></video>
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
    // let {mic,cam} = this.state;
    return (
      <div className="w3-row">
          <div className="w3-col w3-twothird black white-text" style={{ height: "100vh" }} id="parent">
            Parent Frame
            <video></video>
          </div>

          <div className="w3-col w3-third" style={{height: "100vh"}}>
            <div className="w3-row w3-center" id="actions" style={{height: "10vh"}}>
              {(_=>{
                let childactions = [];
                this.actions.forEach((action,a)=>{
                  childactions.push(
                    <div className="w3-col w3-padding-small w3-center" style={{ width: `${100/Object.keys(this.actions).length}%`}} key={a}>
                      {action.html(this.state.actions[action])}
                    </div>
                  )
                });
                return childactions;
              })()}
            </div>
            <div className="w3-row white" id="children"  style={{ overflowY: "scroll", height: "90vh"}}>
              {this.getChildernFrames()}
            </div>
          </div>
          <div className="white z-depth-5 chatview" id="chatbox">
            <div className="w3-row grey" id="chathead" style={{ height: "10vh" }}>
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
              <div className="col s2" style={{ width: "49px"}} ><button id="sendmsg" className="btn-floating waves-effect green w3-right"><i className="material-icons white-text">send</i></button></div>
            </div>
          </div>
      </div>
    );
  }

  toggle=(e)=>{
    console.log(e.target.id);
    this.setState({
      [e.target.id]:!this.state[e.target.id]
    });
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
