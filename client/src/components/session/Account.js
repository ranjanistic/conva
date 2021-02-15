import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Key } from "../../keys";
import "./../../meeting.css"

class Account extends Component {

  constructor(){
    super();
    this.state = {}
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
    return (
      <div className="w3-row">
        Account
      </div>
    );
  }

  sendMessage(){

  }
}

Account.propTypes = {
  auth: PropTypes.object.isRequired,
  room: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  room: state.room,
});
export default connect(mapStateToProps)(Account);
