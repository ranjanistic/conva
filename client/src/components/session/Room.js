import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Key } from "../../keys";
import { withRouter } from "react-router";
import "./../../meeting.css"

class Room extends Component {

  constructor(){
    super();
    this.state = {
      roomid:""
    }
  }

  componentDidMount(){
    const {roomid} = this.props.match.params
    console.log(roomid);
    this.setState({roomid:roomid});
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
    let {roomid} = this.state;
    return (
      <div className="w3-row">
        Room {roomid}
      </div>
    );
  }

  sendMessage(){

  }
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
