import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { leaveMeeting } from "../../actions/meetActions";
import { Key } from "../../keys";
import "./../../meeting.css"
import { get } from "../../paths/get";
import { refer } from "../../actions/requests";

class Meeting extends Component {
  constructor(){
    super();
    this.state = {
      room:{},
      actions:{
        cam:false,
        mic:false,
        chatbox:false,
        active:true,
      }
    }
  }

  onLeaveClick = (e) => {
    e.preventDefault();
    this.props.leaveMeeting();
  };


  componentDidMount() {
    console.log(this.props);
    // if (!this.props.meet.isActive) {
    //   this.props.history.push(get.DASHBOARD);
    // }
    this.setState({room:this.props.room})
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps);
    const {room,meet} = nextProps;
    if(!meet.active){
      this.props.history.push(get.room.self(room.id));
    }
    // if(!nextProps.meet.isActive){
    //   this.props.history.push(get.DASHBOARD);
    // }
  }


  getChildernFrames(){
    let children = [];
    [1,2,3,4].forEach((e)=>{
      children.push(
        <div className="w3-padding w3-row shadow" key={e}>
          <div style={{ height: "30vh", width:"100%", padding:"0",borderRadius:"8px" }} className="btn black waves-effect waves-light">
            <video height="100%" width="100%">
            </video>
          </div>
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
    const {mic,cam} = this.state.actions,
      {room} = this.state;
    return (
      <div className="w3-row" style={{height:"100vh"}}>

          <div className="w3-col w3-twothird" style={{height:"100vh"}}>
            <div className="w3-row" style={{ height: "85vh"}}>
            <video className="black white-text" style={{ width:"100%",height:"100%" }} id="parent"></video>
            </div>
            <div className="w3-row" style={{ height: "15vh"}}>
              <div className="w3-col w3-half" style={{ height: "15vh",overflowY: "scroll"}}>
                <h3 style={{paddingLeft:"1rem"}}>{room.title}</h3>
              </div>
              <div className="w3-col w3-half" style={{ height: "15vh"}}>

              </div>
            </div>
          </div>

          <div className="w3-col w3-third" style={{height: "100vh"}}>
            <div className="w3-row w3-center w3-padding-small" id="actions" style={{height: "10vh"}}>
            <span>
              <div style={{ width: "20%"}} className="w3-col w3-padding-small w3-center"><button className="btn-floating btn-large waves-effect white w3-right" onClick={this.toggle}><i className="material-icons blue-text" id="cam">{this.getToggleViewById('cam',cam)}</i></button></div>
              <div style={{ width: "20%"}} className="w3-col w3-padding-small w3-center"><button id="toggleAudio" className="btn-floating btn-large waves-effect white w3-center" onClick={this.toggle}><i className="material-icons blue-text" id="mic">{this.getToggleViewById('mic',mic)}</i></button></div>
              <div style={{ width: "20%"}} className="w3-col w3-padding-small w3-center"><button id="togglechatbox" className="btn-floating btn-large waves-effect waves-light blue w3-center" onClick={this.toggleChatBox} ><i className="material-icons" id="chat">chat</i></button></div>
              <div style={{ width: "20%"}} className="w3-col w3-padding-small w3-center"><button id="aboutroom" className="btn-floating btn-large waves-effect waves-light w3-center" onClick={_=>refer(get.room.self(room.id))} ><i className="material-icons">more_horiz</i></button></div>
              <div style={{ width: "20%"}} className="w3-col w3-padding-small w3-center"><button id="endcall" className="btn-floating btn-large waves-effect waves-light red w3-left" onClick={this.onLeaveClick} ><i className="material-icons" id="end">call_end</i></button></div>
            </span>
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
              <div className="col s2" style={{ width: "49px"}} ><button id="sendmsg" onClick={this.sendMessage} className="btn-floating waves-effect green w3-right"><i className="material-icons white-text">send</i></button></div>
            </div>
          </div>
      </div>
    );
  }

  sendMessage(){

  }

  toggle=(e)=>{
    console.log(e.target.id);
    this.setState({
      actions:{[e.target.id]:!this.state.actions[e.target.id]}
    });
  }

  getToggleViewById(id,on = false){
    switch(id){
      case 'cam':return on?'videocam':'videocam_off';
      case 'mic':return on?'mic':'mic_off';
      default: return on;
    }
  }
}

Meeting.propTypes = {
  leaveMeeting: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  room: PropTypes.object.isRequired,
  meet: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  room: state.room,
  meet: state.meet,
});
export default connect(mapStateToProps, { leaveMeeting })(Meeting);
